<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <h1 class="admin-title">Admin Panel</h1>
      <p class="admin-subtitle">Manage all editable content for your site</p>
      
      <div class="test-button" style="padding: 1rem; margin-bottom: 2rem; background: lime; text-align: center; border-radius: 8px; font-weight: bold;">
        ✅ Admin Panel Loaded! Vue is working! {{ testCounter }}
        <button @click="testCounter++" style="margin-left: 1rem; padding: 0.5rem 1rem; cursor: pointer;">Click me!</button>
      </div>

      <div class="admin-grid">
        <!-- Editable Section -->
        <EditableSection />

        <!-- Dynamic List -->
        <DynamicList />

        <!-- Map View with Marker Management -->
        <MapView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EditableSection from '../components/EditableSection.vue';
import DynamicList from '../components/DynamicList.vue';
import MapView from '../components/MapView.vue';

const testCounter = ref(0);
</script>

<style scoped>
.admin-wrapper {
  background-color: #f5f5f5;
  min-height: 100vh;
  width: 100%;
  padding: 2rem 0;
}

.admin-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.admin-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #6b3f7b;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.admin-subtitle {
  text-align: center;
  color: #666;
  margin: 0 0 3rem 0;
  font-size: 1.1rem;
}

.admin-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
