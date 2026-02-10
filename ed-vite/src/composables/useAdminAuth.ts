import { ref } from 'vue'
import { useRouter } from 'vue-router'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export function useAdminAuth() {
  const router = useRouter()
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const isAuthenticated = ref(!!token.value)
  const error = ref('')
  const isLoading = ref(false)

  async function login(password: string) {
    isLoading.value = true
    error.value = ''
    
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        error.value = data.error ? 'Wachtwoord niet goed' : 'Login failed'
        return false
      }
      
      token.value = data.token
      localStorage.setItem('admin_token', data.token)
      isAuthenticated.value = true
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    token.value = null
    localStorage.removeItem('admin_token')
    isAuthenticated.value = false
    router.push('/admin-login')
  }

  function getAuthHeader() {
    return token.value ? { 'Authorization': `Bearer ${token.value}` } : {}
  }

  return { token, isAuthenticated, error, isLoading, login, logout, getAuthHeader }
}
