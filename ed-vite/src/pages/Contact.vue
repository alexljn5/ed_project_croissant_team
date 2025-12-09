<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
    <div class="max-w-4xl mx-auto px-6">
      <!-- Contact Email Section -->
      <section class="mb-12 p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition">
        <h2 class="text-2xl font-bold text-purple-700 mb-4">Stuur een email</h2>
        <p class="text-gray-600 mb-6">Neem direct contact met ons op via e-mail:</p>
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=info@voorbeeld.nl&su=Onderwerp&body=Bericht"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Open E-mailclient
        </a>
        <p class="text-gray-500 mt-6 italic">Wij reageren zo snel mogelijk</p>
      </section>

      <!-- Contact Phone Section -->
      <section class="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition">
        <h2 class="text-2xl font-bold text-purple-700 mb-6">Of bel ons</h2>
        <div class="mb-6">
          <p class="text-3xl font-bold text-purple-600 mb-3">+31 (0)6 12345678</p>
          <a 
            href="tel:+31612345678"
            class="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Bel nu
          </a>
        </div>
        <p class="text-gray-600">We zijn van <span class="font-bold">12:00</span> tot <span class="font-bold">18:00</span> beschikbaar</p>
        <p class="text-sm text-gray-500 mt-4">Maandag tot Vrijdag</p>
      </section>

      <!-- Additional Info -->
      <section class="mt-12 p-8 bg-purple-50 rounded-lg border-2 border-purple-200">
        <h3 class="text-xl font-bold text-purple-700 mb-4">Veelgestelde vragen</h3>
        <div class="space-y-4 text-gray-700 text-sm">
          <p>Heeft u een vraag? Neem gerust contact met ons op via e-mail of telefoon.</p>
          <p>We streven ernaar om alle vragen binnen 24 uur te beantwoorden.</p>
          <p>Voor spoedeisende zaken kunt u ons direct bellen.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Contact page component with all interactions handled in Vue
</script>

<style scoped>
/* Smooth hover effects */
a {
  transition: all 0.3s ease;
}

/* Apply global site fonts for contact page */
.min-h-screen {
  font-family: var(--font-primair);
}

h2, h3 {
  font-family: var(--font-heading);
}

section {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
