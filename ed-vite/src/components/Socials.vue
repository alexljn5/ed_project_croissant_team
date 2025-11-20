<template>
    <div class="socials">
        <a
        v-for="social in socials"
        :key="social.name"
        :href="social.url"
        target="_blank"
        rel="noopener noreferrer"
        class="social-button"
        :title="social.name"
        >
        <component :is="social.icon" class="icon"/>
        </a>
    </div>
</template>

<script setup>
/* imgs */
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedIn } from "vue-icons/fa"

const socials = [
    { name: "Facebook", url: "https://facebook.com", icon: FaFacebookF },
    { name: "Twitter", url: "https://twitter.com", icon: FaTwitter },
    { name: "Instagram", url: "https://instagram.com", icon: FaInstagram},
    { name: "LinkedIn", url: "https://linkedin.com", icon: FaLinkedIn},
];
</script>

<style scoped>
.socials {
    display: flex;
    gap: 12px;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--button-bg, #eee);
  border-radius: 50%;
  transition: transform 0.2s, background-color 0.2s;
  text-decoration: none;
  color: var(--button-color, #333);
}

.social-button:hover {
  transform: scale(1.1);
  background-color: var(--button-hover-bg, #ddd);
}

.icon {
  width: 20px;
  height: 20px;
}
</style>