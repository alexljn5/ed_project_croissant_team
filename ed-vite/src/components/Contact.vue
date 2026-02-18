<template>
  <div class="contact-page">
    <header class="contact-header">
      <div class="header-content">
        <div class="logo-container">
          <img
            src="src/assets/img/dubbelop-logo.png"
            alt="Dubbelop Logo"
            class="header-logo"
          />
        </div>
        <h1 class="header-title">Dubbeloproute</h1>
        <p class="header-subtitle">Neem contact met ons op</p>
      </div>
    </header>

    <div class="contact-container">
      <!-- Email Section -->
      <section class="contact-section email-section">
        <h2>📧 Stuur een email</h2>
        <p class="section-description">
          Vul je vraag in en stuur deze naar ons toe. Wij reageren zo snel
          mogelijk!
        </p>
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=info@voorbeeld.nl&su=Onderwerp&body=Bericht"
          class="contact-button email-button"
        >
          Stuur een e-mail
        </a>
      </section>

      <!-- Phone Section -->
      <section class="contact-section phone-section">
        <h2>📞 Of bel ons</h2>
        <div class="phone-content">
          <div class="phone-block">
            <p class="phone-number">+31 (0)6 12 345 678</p>
            <p class="availability">Bel ons voor directe hulp</p>
            <p class="availability-days">
              We zijn van 12:00 tot 18:00 beschikbaar
            </p>
          </div>
        </div>
      </section>

      <!-- Quick Contact Form -->
      <section class="contact-section form-section">
        <h2>💬 Snel bericht</h2>
        <p class="section-description">
          Stuur ons een snel bericht en we nemen zo snel mogelijk contact op
        </p>
        <form class="contact-form">
          <div class="form-group">
            <input type="text" placeholder="Je naam" required />
          </div>
          <div class="form-group">
            <input type="email" placeholder="Je e-mailadres" required />
          </div>
          <div class="form-group">
            <textarea placeholder="Je bericht" rows="4" required></textarea>
          </div>
          <button type="submit" class="contact-button submit-button">
            Verstuur bericht
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
:root {
  --site-paars: hsla(304, 36%, 42%, 1);
  --interactief: hsl(41, 100%, 69%);
  --achtergrond: hsl(0, 0%, 96%);
  --font-heading: "Montserrat", "Poppins", "Nunito", "Segoe UI",
    "Helvetica Neue", Arial, sans-serif;
  --font-primair: "Inter", Roboto, "Open Sans", Arial, Helvetica, sans-serif;
}

.contact-page {
  background-color: var(--achtergrond);
  min-height: 100vh;
}

.contact-header {
background: 
    linear-gradient(45deg, transparent 30%, rgba(var(--interactief-rgb, 255, 107, 53), 0.1) 30.5%, rgba(var(--achtergrond-primair-rgb, 255, 107, 53), 0.1) 70%, transparent 70.5%),
    linear-gradient(-45deg, transparent 30%, rgba(var(--site-paars-rgb, 120, 81, 169), 0.1) 30.5%, rgba(var(--interactief-rgb, 120, 81, 169), 0.1) 70%, transparent 70.5%),
    linear-gradient(to right, transparent 0%, rgba(var(--achtergrond-primair-rgb, 255, 107, 53), 0.05) 25%, rgba(var(--interactief-rgb, 120, 81, 169), 0.05) 50%, rgba(var(--achtergrond-primair-rgb-rgb, 255, 107, 53), 0.05) 75%, transparent 100%),
    linear-gradient(135deg, var(--achtergrond-primair) 0%, var(--interactief) 50%, var(--achtergrond-primair) 100%);
  background-size: 120px 120px, 120px 120px, 100% 100%, 100% 100%;
  background-position: 0 0, 60px 60px, 0 0, 0 0;  color: white;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1000px;
  margin: 0 auto;
}

.logo-container {
  margin-bottom: 1.5rem;
}

.header-logo {
  max-width: 80px;
  height: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.header-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  letter-spacing: 1px;
}

.header-subtitle {
  font-size: 1.1rem;
  color: var(--site-paars);
  margin: 0;
  font-weight: 300;
}

.contact-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.contact-section {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid var(--site-paars);
  transition: all 0.3s ease;
  animation: slideUp 0.5s ease-out;
}

.contact-section:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.contact-section h2 {
  font-family: var(--font-heading);
  color: var(--site-paars);
  font-size: 1.75rem;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.section-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 0.95rem;
}

.contact-button {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.email-button {
  background-color: #2563eb;
  color: white;
}

.email-button:hover {
  background-color: #1d4ed8;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
  transform: translateY(-2px);
}

.phone-content {
  padding: 1rem 0;
}

.phone-block {
  background-color: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.phone-number {
  font-size: 1.75rem;
  font-weight: bold;
  color: var(--site-paars);
  margin: 0 0 0.5rem 0;
}

.availability {
  color: #666;
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
}

.availability-days {
  color: #999;
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
  font-style: italic;
}

/* Form Styles */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-family: var(--font-primair);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--site-paars);
  box-shadow: 0 0 0 3px rgba(78, 29, 98, 0.1);
}

.submit-button {
  background-color: var(--site-paars);
  color: white;
  margin-top: 0.5rem;
}

.submit-button:hover {
  background-color: #3a2142;
  box-shadow: 0 6px 16px rgba(78, 29, 98, 0.3);
  transform: translateY(-2px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .contact-header {
    padding: 2rem 1rem;
  }

  .header-title {
    font-size: 2rem;
  }

  .header-subtitle {
    font-size: 0.95rem;
  }

  .contact-container {
    padding: 1rem;
    gap: 1.5rem;
  }

  .contact-section {
    padding: 1.5rem;
  }

  .contact-section h2 {
    font-size: 1.5rem;
  }

  .phone-number {
    font-size: 1.5rem;
  }
}
</style>

<template>
  <header>
    <h1 class="dubbeloproute-titel">Dubbeloproute</h1>
    <button class="contactKnop">Neem Contact Op</button>
    <div class="logo">
      <img src="src/img/dubbelop-logo.png" alt="Dubbelop Logo" />
    </div>
  </header>
  <h1>Stuur een email</h1>
  <a
    href="https://mail.google.com/mail/?view=cm&fs=1&to=info@voorbeeld.nl&su=Onderwerp&body=Bericht"
    >Stuur een e-mail</a
  >
  <p>Wij reageren zo snel mogelijk</p>
  <h1>Of bel ons</h1>
  <p>+31 6 12345678</p>
  <p>Beschikbaar tussen [tijd1] en [tijd2]</p>
</template>
