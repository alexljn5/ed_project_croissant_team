import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Home from './pages/Home.vue'
import Contact from './pages/Contact.vue'
import Admin from './pages/Admin.vue'

let Reviews
try {
    // Dynamic import to catch compilation issues
    Reviews = (await import('./pages/Reviews.vue')).default
    console.log('[router] Reviews.vue loaded successfully')
} catch (err) {
    console.error('[router] Failed to load Reviews.vue:', err)
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/contact',
        name: 'Contact',
        component: Contact,
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
    },
    {
        path: '/reviews',
        name: 'Reviews',
        component: Reviews ?? (() => import('./pages/Reviews.vue')), // fallback dynamic import
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
]

console.log('[router] registered routes:', routes.map(r => r.path))

// Log component details for debugging
console.log('[router] Reviews component loaded:', Reviews)

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.onError((error) => {
    console.error('[router] Navigation error:', error)
})

export default router
