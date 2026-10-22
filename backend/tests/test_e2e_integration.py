import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.infrastructure.database import SessionLocal
from app.domain import models
from app.core import auth

client = TestClient(app)

@pytest.fixture(scope="module")
def auth_headers():
    db = SessionLocal()
    test_email = f"merchant_test_{uuid.uuid4().hex[:6]}@maisonlune.com"
    password = "SecurePassword123!"
    hashed_pwd = auth.get_password_hash(password)
    
    user = models.User(email=test_email, hashed_password=hashed_pwd)
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

    # Login to obtain JWT
    login_res = client.post(
        "/api/v1/users/login",
        data={"username": test_email, "password": password}
    )
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_01_root_health():
    res = client.get("/")
    assert res.status_code == 200
    assert "running" in res.json().get("message", "").lower()

def test_02_campaign_crud_and_caps(auth_headers):
    # 1. Create Campaign
    payload = {
        "name": "Summer Glow Loyalty Activation",
        "targeting_criteria": {"audience": "VIP Customers", "min_spend": 50},
        "schedule": {"type": "Continuous", "start_date": "2026-06-01"},
        "budget_cap": 2500.0,
        "reward_cap": 100
    }
    create_res = client.post("/api/v1/campaigns/", json=payload, headers=auth_headers)
    assert create_res.status_code == 200, create_res.text
    campaign = create_res.json()
    assert campaign["name"] == "Summer Glow Loyalty Activation"
    assert campaign["budget_cap"] == 2500.0
    assert campaign["reward_cap"] == 100
    campaign_id = campaign["id"]

    # 2. Get Campaign
    get_res = client.get(f"/api/v1/campaigns/{campaign_id}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == campaign_id

    # 3. List Campaigns
    list_res = client.get("/api/v1/campaigns/", headers=auth_headers)
    assert list_res.status_code == 200
    assert any(c["id"] == campaign_id for c in list_res.json())

    # 4. Activate then Pause Campaign Lifecycle
    activate_res = client.post(f"/api/v1/campaigns/{campaign_id}/activate", headers=auth_headers)
    assert activate_res.status_code == 200
    pause_res = client.post(f"/api/v1/campaigns/{campaign_id}/pause", headers=auth_headers)
    assert pause_res.status_code == 200

def test_03_rules_engine_multi_channel(auth_headers):
    # Create campaign
    camp_res = client.post(
        "/api/v1/campaigns/",
        json={"name": "Rule Trigger Test", "budget_cap": 1000.0, "reward_cap": 50},
        headers=auth_headers
    )
    camp_id = camp_res.json()["id"]

    # Add Rule for 30 days inactivity -> Send Push + SMS
    rule_payload = {
        "trigger": {"event": "customer.inactive_30d", "threshold": 30},
        "action": {"type": "Multi-Channel Push & SMS", "offer": "15% Welcome Back"}
    }
    rule_res = client.post(f"/api/v1/campaigns/{camp_id}/rules", json=rule_payload, headers=auth_headers)
    assert rule_res.status_code == 200
    rule_data = rule_res.json()
    assert rule_data["campaign_id"] == camp_id
    assert rule_data["trigger"]["event"] == "customer.inactive_30d"

    # List Rules
    rules_list = client.get(f"/api/v1/campaigns/{camp_id}/rules", headers=auth_headers)
    assert rules_list.status_code == 200
    assert len(rules_list.json()) > 0

def test_04_gamification_server_side_logic_and_caps(auth_headers):
    # 1. List Templates
    tpl_res = client.get("/api/v1/gametemplates/", headers=auth_headers)
    assert tpl_res.status_code == 200
    templates = tpl_res.json()
    assert any(t["id"] == "spin-the-wheel" for t in templates)

    # 2. Create Campaign with strict reward cap = 1
    camp_res = client.post(
        "/api/v1/campaigns/",
        json={"name": "Strict Cap Spin Campaign", "budget_cap": 100.0, "reward_cap": 1},
        headers=auth_headers
    )
    camp_id = camp_res.json()["id"]

    # 3. Configure Spin Game (100% win rate for testing)
    game_payload = {
        "template": "spin-the-wheel",
        "odds": 1.0,
        "prizes": ["Free Macaron Box", "15% VIP Coupon"]
    }
    game_res = client.post(f"/api/v1/campaigns/{camp_id}/game", json=game_payload, headers=auth_headers)
    assert game_res.status_code == 200
    game = game_res.json()
    game_id = game["id"]

    # 4. Play Game (First play wins and takes the 1 available cap slot)
    play_res_1 = client.post(f"/api/v1/games/{game_id}/play", headers=auth_headers)
    assert play_res_1.status_code == 200
    play_data_1 = play_res_1.json()
    assert play_data_1["result"] == "win"
    reward_id = play_data_1["reward_id"]

    # 5. Play Game Second Time (Must enforce reward cap!)
    play_res_2 = client.post(f"/api/v1/games/{game_id}/play", headers=auth_headers)
    assert play_res_2.status_code == 200
    play_data_2 = play_res_2.json()
    assert play_data_2.get("cap_reached") is True
    assert play_data_2["result"] == "loss"

    # 6. Check and Redeem Reward
    chk_res = client.get(f"/api/v1/rewards/{reward_id}", headers=auth_headers)
    assert chk_res.status_code == 200
    assert chk_res.json()["status"] == "Issued"

    redeem_res = client.post(f"/api/v1/rewards/{reward_id}/redeem", headers=auth_headers)
    assert redeem_res.status_code == 200
    assert "successfully" in redeem_res.json()["message"]

def test_05_promo_banners_touchpoints(auth_headers):
    # 1. Check touchpoint templates
    templates_res = client.get("/api/v1/banners/templates/touchpoints", headers=auth_headers)
    assert templates_res.status_code == 200
    touchpoints = templates_res.json()
    assert len(touchpoints) >= 4
    assert any(t["id"] == "pos_screen" for t in touchpoints)
    assert any(t["id"] == "story_9_16" for t in touchpoints)

    # 2. Create Promo Banner
    banner_payload = {
        "title": "Weekend Sparkling Rosé: 20% Off",
        "subtitle": "Scan QR at the checkout counter",
        "touchpoint": "pos_screen",
        "theme": "luxury_gold",
        "discount_code": "SPARKLE20",
        "cta_text": "Scan to Claim"
    }
    create_banner_res = client.post("/api/v1/banners/", json=banner_payload, headers=auth_headers)
    assert create_banner_res.status_code == 200
    banner = create_banner_res.json()
    assert banner["title"] == "Weekend Sparkling Rosé: 20% Off"
    banner_id = banner["id"]

    # 3. Retrieve Banner with Render Payload
    get_b_res = client.get(f"/api/v1/banners/{banner_id}", headers=auth_headers)
    assert get_b_res.status_code == 200
    b_data = get_b_res.json()
    assert "embed_html" in b_data
    assert "qr_url" in b_data

    # 4. List Banners
    list_b_res = client.get("/api/v1/banners/", headers=auth_headers)
    assert list_b_res.status_code == 200
    assert any(b["id"] == banner_id for b in list_b_res.json())

def test_06_events_telemetry_pipeline(auth_headers):
    # Ingest event
    event_payload = {
        "event": "customer.purchase_above_50",
        "customer_id": "cust_9941",
        "amount": 78.50,
        "email": "sarah.dupont@gmail.com"
    }
    ingest_res = client.post("/api/v1/events/", json=event_payload, headers=auth_headers)
    assert ingest_res.status_code == 200
    assert ingest_res.json().get("status") == "Event processed"

    # Verify event appears in logs
    logs_res = client.get("/api/v1/events/logs", headers=auth_headers)
    assert logs_res.status_code == 200
    logs = logs_res.json()
    assert len(logs) > 0

def test_07_analytics_and_overview_telemetry(auth_headers):
    # Overview
    overview_res = client.get("/api/v1/overview/", headers=auth_headers)
    assert overview_res.status_code == 200
    ov_data = overview_res.json()
    assert "active_campaigns" in ov_data
    assert "audience_reached" in ov_data
    assert "conversions" in ov_data
    assert "attributed_revenue" in ov_data

    # Analytics 30d, 7d, today
    an_30 = client.get("/api/v1/analytics/?timeframe=30d&channel=all", headers=auth_headers)
    assert an_30.status_code == 200
    assert "revenue" in an_30.json()

    an_7 = client.get("/api/v1/analytics/?timeframe=7d&channel=push", headers=auth_headers)
    assert an_7.status_code == 200
    assert "conversions" in an_7.json()

def test_08_merchant_settings_and_webhook_url(auth_headers):
    # Get settings
    get_set = client.get("/api/v1/settings/", headers=auth_headers)
    assert get_set.status_code == 200
    settings = get_set.json()
    assert "store_name" in settings
    assert "currency" in settings

    # Update settings
    update_res = client.put(
        "/api/v1/settings/",
        json={"store_name": "Maison Lune Flagship", "currency": "EUR (€)", "default_budget_cap": 3000.0},
        headers=auth_headers
    )
    assert update_res.status_code == 200
    assert update_res.json()["store_name"] == "Maison Lune Flagship"
    assert update_res.json()["default_budget_cap"] == 3000.0
