<template>
  <div class="login-wrapper">
    <form @submit.prevent="handleLogin" class="login-form">
      <h1>Log In</h1>

      <input 
        v-model="password" 
        type="password" 
        placeholder="Password"
        :disabled="isLoading"
        autofocus
        required
      />

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Loading...' : 'Submit' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuth } from '../composables/useAdminAuth'

const router = useRouter()
const password = ref('')
const { login, error, isLoading } = useAdminAuth()

async function handleLogin() {
  const success = await login(password.value)
  if (success) {
    router.push('/admin')
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
  background: #ffffff;
  font-family: system-ui, -apple-system, sans-serif;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  text-align: center;
}

h1 {
  font-size: 18px;
  font-weight: 400;
  color: #333;
  margin-bottom: 30px;
  letter-spacing: 0.5px;
}

input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 0;
  font-size: 14px;
  margin-bottom: 20px;
  background: #fff;
  font-family: inherit;
}

input[type="password"]:focus {
  outline: none;
  border-color: #333;
}

input[type="password"]:disabled {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

button {
  width: 100%;
  padding: 12px;
  background: #000;
  color: white;
  border: none;
  border-radius: 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 20px;
}

button:hover:not(:disabled) {
  background: #333;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #d32f2f;
  font-size: 12px;
  margin-top: 10px;
}
</style>
