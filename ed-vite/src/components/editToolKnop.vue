<template>
  <router-link v-if="isAuthenticated" to="/admin" class="editor-link">
    <div class="editor-bg-box">
      <button class="edit-tool-knop">
        <!-- knop icon -->
        <img
          class="img-scaler"
          src="@/assets/img/hamerUnhighlight.png"
          alt="Edit Tool Icon"
        />
      </button>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import "@/assets/css/editKnop.css"
import { useAdminAuth } from "../composables/useAdminAuth"

const { isAuthenticated } = useAdminAuth()
</script>

<style scoped>
.editor-link {
  text-decoration: none;
}
</style>
