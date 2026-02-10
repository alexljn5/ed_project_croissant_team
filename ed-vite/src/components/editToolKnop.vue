<template>
  <router-link v-if="showButton" to="/admin" class="editor-link">
    <div class="editor-bg-box">
      <button class="edit-tool-knop">
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
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAdminAuth } from "../composables/useAdminAuth";
import "@/assets/css/editKnop.css";

const route = useRoute();
const { token } = useAdminAuth();

const showButton = computed(() => !!token.value && route.path !== "/admin");
</script>

<style scoped>
.editor-link {
  text-decoration: none;
}
</style>
