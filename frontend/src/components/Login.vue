<script setup>
const emit = defineEmits(['login'])

const handleLogin = () => {
  emit('login')
}
</script>

<template>
  <div class="login-container">
    <div class="login-card fade-in">
      <h2 class="logo">Loyum</h2>
      <h1 class="title">Welcome back</h1>
      <p class="subtitle">Run smarter campaigns for your customers.</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input type="email" value="owner@maisonlune.fr" class="input-field" required />
        </div>

        <div class="form-group">
          <div class="password-header">
            <label>Password</label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>
          <input type="password" value="•••••••••" class="input-field" required />
        </div>

        <button type="submit" class="btn-primary">Sign in</button>
        
        <div class="divider"><span>or</span></div>
        
        <button type="button" class="btn-secondary" @click="handleLogin">Continue with Google</button>
      </form>

      <p class="terms">By continuing, you agree to Loyum's merchant terms.</p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #F8FAFC;
  font-family: 'Inter', sans-serif;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  border: 1px solid #E2E8F0;
  text-align: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 1.5rem;
  letter-spacing: -0.5px;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #64748B;
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

.form-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 0.5rem;
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 0.8rem;
  color: #6366F1;
  text-decoration: none;
  font-weight: 500;
}

.input-field {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.95rem;
  color: #0F172A;
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: #6366F1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}

.btn-primary {
  width: 100%;
  padding: 0.85rem;
  background-color: #6366F1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #4F46E5;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: #94A3B8;
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #E2E8F0;
}

.divider span {
  padding: 0 10px;
}

.btn-secondary {
  width: 100%;
  padding: 0.85rem;
  background-color: #F8FAFC;
  color: #334155;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #F1F5F9;
}

.terms {
  margin-top: 2rem;
  font-size: 0.75rem;
  color: #94A3B8;
}

.fade-in {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
