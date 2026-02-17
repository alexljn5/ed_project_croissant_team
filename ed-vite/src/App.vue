<template>
  <div class="app-layout">
    <!-- Navigation Header -->
    <header class="header-top">
      <div class="header-container">
        <h1 class="dubbeloproute-titel">Dubbelop-route</h1>
        <div class="header-right">
          <!--
          <router-link to="/admin" class="admin-button">
            <button class="adminKnop">Admin</button>
          </router-link>
          -->
          <router-link to="/reviews" class="reviews-button">
            <button class="reviewsKnop">Reviews</button>
          </router-link>
          <router-link to="/contact" class="contact-button">
            <button class="contactKnop">
              <img
                src="/src/assets/img/Mail.png"
                alt="Mail"
                class="mail-icon"
              />
              Neem Contact Op
            </button>
          </router-link>
          <router-link to="/" class="logo-link">
            <div class="logo">
              <img
                src="/src/assets/img/dubbelop-logo.png"
                alt="Dubbelop Logo"
              />
            </div>
          </router-link>
        </div>
      </div>
    </header>
    <router-view />
    <Footer />
  </div>
  <EditButton />
</template>

<script setup lang="ts">
import Footer from "./components/Footer.vue";
import EditButton from "./components/editToolKnop.vue";
import "@/assets/css/app.css";
</script>
