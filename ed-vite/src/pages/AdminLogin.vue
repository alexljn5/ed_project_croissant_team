<template>
  <div class="login-wrapper">
    <form @submit.prevent="handleLogin" class="login-card">
      <div class="login-header">
        <h1>Admin login</h1>
        <p>Voer het admin wachtwoord in om verder te gaan.</p>
      </div>

      <label class="field">
        <span>Wachtwoord</span>
        <input 
          v-model="password" 
          :type="showPassword ? 'text' : 'password'"
          placeholder="Wachtwoord"
          :disabled="isLoading"
          autofocus
          required
        />
      </label>

      <label class="show-password">
        <input v-model="showPassword" type="checkbox" :disabled="isLoading" />
        Toon wachtwoord
      </label>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Bezig...' : 'Inloggen' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminAuth } from '../composables/useAdminAuth'

const route = useRoute()
const router = useRouter()
const password = ref('')
const showPassword = ref(false)
const { login, error, isLoading } = useAdminAuth()

async function handleLogin() {
  const success = await login(password.value)
  if (success) {
    const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
    router.push(redirectPath)
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f2ff 0%, #ffffff 55%, #f2f6ff 100%);
  font-family: system-ui, -apple-system, sans-serif;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border: 1px solid #e6e6e6;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08);
  padding: 36px;
  border-radius: 12px;
}

.login-header {
  margin-bottom: 24px;
}

.login-header h1 {
  font-size: 20px;
  font-weight: 600;
  color: #1c1c1c;
  margin-bottom: 6px;
}

.login-header p {
  font-size: 13px;
  color: #555;
  line-height: 1.5;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  color: #333;
  font-size: 12px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.field input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  font-family: inherit;
}

.field input:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08);
}

.field input:disabled {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

button {
  width: 100%;
  padding: 12px;
  background: #111;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;
}

button:hover:not(:disabled) {
  background: #2a2a2a;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #d32f2f;
  font-size: 12px;
  margin-top: 12px;
}

.show-password {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #444;
  margin-bottom: 8px;
}

.show-password input {
  accent-color: #000;
}
</style>
