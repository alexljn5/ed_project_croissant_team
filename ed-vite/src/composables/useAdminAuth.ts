import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Global reactive state for auth
const authToken = ref<string | null>(localStorage.getItem('admin_token'))

export function useAdminAuth() {
  const router = useRouter()
  const error = ref('')
  const isLoading = ref(false)

  const isAuthenticated = computed(() => {
    // Check both the ref and localStorage as fallback
    return !!authToken.value || !!localStorage.getItem('admin_token')
  })

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
        error.value = data.error || 'Login failed'
        return false
      }
      
      authToken.value = data.token
      localStorage.setItem('admin_token', data.token)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    authToken.value = null
    localStorage.removeItem('admin_token')
    router.push('/admin-login')
  }

  function getAuthHeader() {
    const token = authToken.value || localStorage.getItem('admin_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  return { authToken, isAuthenticated, error, isLoading, login, logout, getAuthHeader }
}
