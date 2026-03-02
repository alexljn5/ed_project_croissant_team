import { createRouter, createWebHistory } from "vue-router";

import Home from "./pages/Home.vue";
import Contact from "./pages/Contact.vue";
import Admin from "./pages/Admin.vue";
import AdminLogin from "./pages/AdminLogin.vue";
import Reviews from "./pages/Reviews.vue";
import LocationDetector from "./pages/LocationDetector.vue";
import Emails from "./pages/Emails.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/contact",
        name: "Contact",
        component: Contact,
    },
    {
        path: "/admin-login",
        name: "AdminLogin",
        component: AdminLogin,
    },
    {
        path: "/admin",
        name: "Admin",
        component: Admin,
        meta: { requiresAuth: true },
    },
    {
        path: "/reviews",
        name: "Reviews",
        component: Reviews,
    },
    {
        path: "/locations",
        name: "LocationDetector",
        component: LocationDetector,
    },
    {
        path: "/emails",
        name: "Emails",
        component: Emails,
    },
    {
        path: "/:pathMatch(.)",
        redirect: "/",
    },
];

console.log(
    "[router] registered routes:",
    routes.map((r) => r.path),
);

// Log component details for debugging
console.log("[router] Reviews component loaded:", Reviews);
console.log(
    "[router] registered routes:",
    routes.map((r) => r.path),
);

const router = createRouter({
    history: createWebHistory((import.meta as any).env.BASE_URL),
    routes,
});

// Route guard to protect admin pages
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const token = localStorage.getItem('admin_token');

    if (requiresAuth && !token) {
        next('/admin-login');
    } else {
        next();
    }
});

export default router;
