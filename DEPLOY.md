# 🚀 CampaignOS / LOYUM Deployment Guide

This guide covers building and running the **Backend** and **Frontend** as independent Docker containers, as well as running them together with **Docker Compose**.

---

## 📁 Architecture Overview

* **Backend Service (`campaignos-backend`)**:
  - Python 3.12 (FastAPI ASGI Server with Uvicorn)
  - Connects to Aiven PostgreSQL and Kafka cluster via environment variables
  - Port: `8000`
* **Frontend Service (`campaignos-frontend`)**:
  - Multi-stage build (Node.js 20 $\rightarrow$ Alpine Nginx)
  - Production-grade Nginx reverse-proxies `/api/` to backend and handles SPA routing (`try_files`)
  - Port: `80` (or mapped to `3000` on host)

---

## Option 1: Deploy Separately (Independent Containers)

### 1. Backend

#### Build Backend Image
```bash
cd backend
docker build -t campaignos-backend .
```

#### Run Backend Container
```bash
docker run -d \
  --name campaignos-backend \
  --restart unless-stopped \
  -p 8000:8000 \
  --env-file .env \
  campaignos-backend
```

#### Verify Backend
```bash
curl http://localhost:8000/
# Expected: {"message": "Merchant Marketing & Campaign Engine API is running"}
```

---

### 2. Frontend

#### Build Frontend Image
```bash
cd frontend
docker build -t campaignos-frontend .
```

#### Run Frontend Container
```bash
docker run -d \
  --name campaignos-frontend \
  --restart unless-stopped \
  -p 3000:80 \
  campaignos-frontend
```

#### Access in Browser
Open [http://localhost:3000](http://localhost:3000)

---

## Option 2: Deploy Both Together (Docker Compose)

Run both frontend and backend on a shared internal bridge network with one command:

```bash
# Build and start all services in detached mode
docker compose up -d --build

# View real-time container logs
docker compose logs -f

# Check container status
docker compose ps

# Stop containers
docker compose down
```

---

## ⚙️ Environment Variables Reference (`backend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+psycopg2://user:pass@host:18815/defaultdb?sslmode=require` |
| `SECRET_KEY` | JWT signing secret | `09d25e094faa6ca2556c818166...` |
| `ALGORITHM` | JWT hashing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT expiration | `30` |
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka cluster host:port | `kafka-xxx.l.aivencloud.com:18828` |
| `KAFKA_USERNAME` | Kafka SASL username | `avnadmin` |
| `KAFKA_PASSWORD` | Kafka SASL password | `AVNS_...` |
| `KAFKA_TOPIC` | Kafka topic name | `marketing_events` |
| `SMTP_SERVER` | SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SENDER_EMAIL` | Sender email address | `satyareddy0608@gmail.com` |
| `SENDER_PASSWORD` | Google 16-character App Password | `xxxx xxxx xxxx xxxx` |
