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
</script>

<style scoped>
:root {
  --body: hsla(304, 36%, 42%, 1);
  --title-text: hsl(0, 0%, 90%);
  --achtergrond-primair: hsl(0, 0%, 96%);
  --site-paars-xtra-light: hsla(304, 36%, 82%, 1);
  --site-paars-light: hsla(304, 36%, 52%, 1);
  --site-paars: hsla(304, 36%, 42%, 1);
  --interactief: hsl(41, 100%, 69%);
  --header-bg: rgba(255, 255, 255, 0.65);
  --header-shadow: rgba(0, 0%, 0.1);
  --font-primair: 'Inter', Roboto, 'Open Sans', Arial, Helvetica, sans-serif;
  --font-heading: 'Montserrat', 'Poppins', 'Nunito', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'Courier New', Courier, monospace;
  --font-smal: 9px;
  --font-grootte: 16px;
  --font-grootte2: 32px;
  --font-grootte3: 42px;
  --titel-font: sans-serif;
  --header-text: hsla(0, 0%, 11%, 1);
  --det-1: hsla(41, 100%, 49%, 0.8);
  --det-2: hsla(41, 100%, 59%, 0.8);
  --det-3: hsla(41, 100%, 69%, 0.8);
}

.caller-div {
  font-family: var(--font-primair);
  background-color: var(--achtergrond-primair);
  min-height: 100vh;
  padding: 2rem 0;
}

.contact-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.contact-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-in;
  border: 2px solid var(--site-paars);
}

.contact-section:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.contact-section h1,
.contact-section h2,
.contact-section h3 {
  font-family: var(--font-heading);
  color: var(--site-paars);
  font-weight: bold;
  margin: 0 0 1rem 0;
}

.contact-section h1 {
  font-size: 1.75rem;
}

.contact-section h2 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
}

.contact-section h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.section-description {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.contact-button {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.email-button {
  background-color: #2563eb;
  color: white;
}

.email-button:hover {
  background-color: #1d4ed8;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
  transform: scale(1.05);
}

.phone-button {
  background-color: #16a34a;
  color: white;
}

.phone-button:hover {
  background-color: #15803d;
  box-shadow: 0 6px 16px rgba(22, 163, 74, 0.3);
  transform: scale(1.05);
}

.response-time {
  color: #999;
  margin-top: 1.5rem;
  font-style: italic;
  font-size: 0.95rem;
}

.phone-block {
  margin-bottom: 1.5rem;
}

.phone-number {
  font-size: 1.75rem;
  font-weight: bold;
  color: var(--site-paars);
  margin: 0 0 1rem 0;
}

.availability {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.availability-days {
  color: #999;
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
}

.bold {
  font-weight: bold;
}

.faq-section {
  background-color: var(--site-paars);
  border: 2px solid var(--site-paars);
}

.faq-section h3 {
  color: #ffffff;
}

.faq-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #ffffff;
  font-size: 0.95rem;
  line-height: 1.6;
}

.faq-content p {
  margin: 0;
  color: #ffffff;
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

@media (max-width: 768px) {
  .contact-container {
    padding: 0 1rem;
  }

  .contact-section {
    padding: 1.5rem;
  }

  .contact-section h1,
  .contact-section h2,
  .contact-section h3 {
    font-size: 1.5rem;
  }

  .phone-number {
    font-size: 1.5rem;
  }
}
</style>
