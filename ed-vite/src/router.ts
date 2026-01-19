import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import Contact from './pages/Contact.vue'
import Admin from './pages/Admin.vue'
import AdminLogin from './pages/AdminLogin.vue'
import Reviews from './pages/Reviews.vue'
import LocationDetector from './pages/LocationDetector.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/contact',
        name: 'Contact',
        component: Contact
    },
    {
        path: '/admin-login',
        name: 'AdminLogin',
        component: AdminLogin
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        meta: { requiresAuth: true }
    },
    {
        path: '/reviews',
        name: 'Reviews',
        component: Reviews
    },
    {
        path: '/locations',
        name: 'LocationDetector',
        component: LocationDetector
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

console.log('[router] registered routes:', routes.map(r => r.path))

// Log component details for debugging
console.log('[router] Reviews component loaded:', Reviews)

const router = createRouter({
    history: createWebHistory((import.meta as any).env.BASE_URL),
    routes
})

// Route guard for admin authentication
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('admin_token')
        if (!token) {
            next('/admin-login')
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router

router.onError((error) => {
    console.error('[router] Navigation error:', error)
})
