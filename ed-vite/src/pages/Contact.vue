<template>
  <div class="caller-div">
    <div class="contact-container">
      <section class="contact-section">
        <h1>Stuur een e-mail</h1>
        <p class="section-description">Zoek graag direct contact op via de mail:</p>
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=info@voorbeeld.nl&su=Onderwerp&body=Bericht"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-button email-button"
        >
          Verstuur een e-mail
        </a>
        <p class="response-time">Reactie zo snel mogelijk</p>
      </section>

      <section class="contact-section">
        <h2>Of bel ons</h2>
        <div class="phone-block">
          <p class="phone-number">+31 (0)6 12345678</p>
          <a 
            href="tel:+31612345678"
            class="contact-button phone-button"
          >
            Bel nu
          </a>
        </div>
        <p class="availability">Van <span class="bold">12:00</span> tot <span class="bold">18:00</span> beschikbaar</p>
        <p class="availability-days">Maandag tot Vrijdag</p>
      </section>

      <!-- Additional Info -->
      <section class="contact-section faq-section">
        <h3>Veelgestelde vragen</h3>
        <div class="faq-content">
          <p>Nog vragen? Neem dan gerust contact op via telefoon of email.</p>
          <p>We streven ernaar om alle vragen binnen 24 uur te beantwoorden.</p>
          <p>Voor spoedeisende zaken kunt u ons direct bellen.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/contact.css'
</script>

