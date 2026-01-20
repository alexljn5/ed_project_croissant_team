<template>
  <div class="contact-page">
    <div class="contact-header">
      <div class="header-content">
        <h1>Neem Contact Met Ons Op</h1>
        <p class="header-subtitle">
          We helpen je graag! Stuur ons een bericht of bel ons direct.
        </p>
      </div>
    </div>

    <div class="contact-container">
      <div class="contact-content">
        <!-- Contact Info Cards -->

        <div class="form-section">
          <h2>Stuur ons een bericht</h2>
          <p class="form-description">
            We nemen contact met je op binnen 24 uur
          </p>

          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Naam</label>
                <input
                  v-model="form.name"
                  id="name"
                  type="text"
                  placeholder="Uw volledige naam"
                  required
                />
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  v-model="form.email"
                  id="email"
                  type="email"
                  placeholder="uw@email.com"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="subject">Onderwerp</label>
              <input
                v-model="form.subject"
                id="subject"
                type="text"
                placeholder="Waar gaat uw bericht over?"
                required
              />
            </div>

            <div class="form-group">
              <label for="message">Bericht</label>
              <textarea
                v-model="form.message"
                id="message"
                placeholder="Schrijf hier uw bericht..."
                rows="6"
                required
              ></textarea>
            </div>

            <button type="submit" class="submit-btn">
              <span>Verstuur Bericht</span>
              <span class="btn-arrow">→</span>
            </button>
          </form>

          <transition name="slide-fade">
            <div v-if="successMessage" class="success-message">
              <span class="success-icon">✓</span>
              {{ successMessage }}
            </div>
          </transition>

          <!-- Phone Section Below Form -->
          <div class="phone-section">
            <h3>Of bel ons direct</h3>
            <p class="phone-number">+31 (0)6 12345678</p>
            <p class="phone-hours">
              Maandag - Vrijdag<br /><span class="bold">12:00 - 18:00</span> uur
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useEmail } from "@/composables/useEmail";
import "@/assets/css/contact.css";

const { sendEmail } = useEmail();

const form = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const successMessage = ref("");

const handleSubmit = () => {
  try {
    sendEmail(
      form.value.name,
      form.value.email,
      form.value.subject,
      form.value.message,
    );

    successMessage.value = "Bericht succesvol verzonden! ✓";

    // Reset form
    form.value = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
</script>

<style scoped>
/* Header Section */
.contact-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
}

.contact-header {
  background: linear-gradient(
    135deg,
    var(--site-paars, #6b4e99) 0%,
    #8b5fcf 100%
  );
  color: white;
  padding: 4rem 1rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  font-size: 2.8rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
  animation: slideDown 0.6s ease-out;
}

.header-subtitle {
  font-size: 1.1rem;
  opacity: 0.95;
  margin: 0;
  animation: slideDown 0.8s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Container & Content */
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Info Cards */
.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 1rem;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-top: 4px solid transparent;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
}

.phone-card {
  border-top-color: #ff6b6b;
}

.email-card {
  border-top-color: #4ecdc4;
}

.location-card {
  border-top-color: #ffd93d;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.info-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin: 1rem 0;
  font-weight: 600;
}

.contact-detail {
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
  margin: 0.5rem 0;
}

.contact-hours {
  font-size: 0.95rem;
  color: #999;
  margin: 1rem 0 0 0;
  line-height: 1.6;
}

.bold {
  font-weight: 600;
  color: #333;
}

.view-emails-link {
  text-decoration: none;
  display: block;
}

.view-emails-btn {
  width: 100%;
  padding: 0.7rem 1.5rem;
  background: #4ecdc4;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.view-emails-btn:hover {
  background: #45b8ae;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(78, 205, 196, 0.3);
}

.view-emails-btn:active {
  transform: translateY(0);
}

/* Form Section */
.form-section {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 1s ease-out;
}

.form-section h2 {
  font-size: 1.8rem;
  color: #333;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.form-description {
  color: #999;
  margin: 0 0 2rem 0;
  font-size: 0.95rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.7rem;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

input,
textarea {
  padding: 0.9rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--site-paars, #6b4e99);
  background: white;
  box-shadow: 0 0 0 4px rgba(107, 78, 153, 0.1);
}

textarea {
  resize: vertical;
  min-height: 150px;
}

.submit-btn {
  padding: 1rem 2rem;
  background: linear-gradient(
    135deg,
    var(--site-paars, #6b4e99) 0%,
    #8b5fcf 100%
  );
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(107, 78, 153, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(107, 78, 153, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.submit-btn:hover .btn-arrow {
  transform: translateX(3px);
}

.success-message {
  margin-top: 1.5rem;
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border: 2px solid #c3e6cb;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  animation: slideDown 0.4s ease-out;
}

.success-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

/* Phone Section Below Form */
.phone-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-left: 4px solid #ff6b6b;
  border-radius: 8px;
  text-align: center;
}

.phone-section h3 {
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.phone-number {
  font-size: 1.3rem;
  color: #ff6b6b;
  font-weight: 700;
  margin: 0.5rem 0;
}

.phone-hours {
  font-size: 0.95rem;
  color: #999;
  margin: 0.5rem 0;
  line-height: 1.6;
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateX(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-header {
    padding: 2.5rem 1rem;
  }

  .header-content h1 {
    font-size: 2rem;
  }

  .header-subtitle {
    font-size: 0.95rem;
  }

  .contact-container {
    padding: 2rem 1rem;
  }

  .info-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .form-section {
    padding: 2rem 1.5rem;
  }

  .form-section h2 {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  input,
  textarea {
    font-size: 16px; /* Prevents zoom on iOS */
  }

  .submit-btn {
    font-size: 1rem;
    padding: 0.9rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .header-content h1 {
    font-size: 1.6rem;
  }

  .info-card {
    padding: 1.5rem;
  }

  .form-section {
    padding: 1.5rem 1rem;
  }

  .contact-detail {
    font-size: 1rem;
  }
}
</style>
