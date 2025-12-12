import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Contact from './pages/Contact.vue'
import Admin from './pages/Admin.vue'

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
        path: '/admin',
        name: 'Admin',

        component: Admin
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

console.log('[router] registered routes:', routes.map(r => r.path))

const router = createRouter({
    history: createWebHistory((import.meta as any).env.BASE_URL),
    routes
})

export default router
