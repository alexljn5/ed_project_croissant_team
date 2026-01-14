<template>
  <div class="contact-page">
    <div class="contact-container">
      <h1>Neem Contact Op</h1>

      <div class="contact-content">
        <div class="form-section">
          <h2>Stuur ons een bericht</h2>

          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-group">
              <label for="name">Naam:</label>
              <input
                v-model="form.name"
                id="name"
                type="text"
                placeholder="Uw naam"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Email:</label>
              <input
                v-model="form.email"
                id="email"
                type="email"
                placeholder="Uw email adres"
                required
              />
            </div>

            <div class="form-group">
              <label for="subject">Onderwerp:</label>
              <input
                v-model="form.subject"
                id="subject"
                type="text"
                placeholder="Onderwerp van uw bericht"
                required
              />
            </div>

            <div class="form-group">
              <label for="message">Bericht:</label>
              <textarea
                v-model="form.message"
                id="message"
                placeholder="Uw bericht..."
                rows="6"
                required
              ></textarea>
            </div>

            <button type="submit" class="submit-btn">Verstuur Bericht</button>
          </form>

          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
        </div>

        <div class="info-section">
          <h2>Bel ons</h2>
          <p class="phone-number">+31 (0)6 12345678</p>
          <p class="availability">
            Van <span class="bold">12:00</span> tot
            <span class="bold">18:00</span> uur beschikbaar
          </p>

          <h2 style="margin-top: 2rem">Emails bekijken</h2>
          <router-link to="/emails" class="emails-link">
            <button class="view-emails-btn">Bekijk alle emails →</button>
          </router-link>
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
      form.value.message
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
.contact-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem 1rem;
}

.contact-container {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-section,
.info-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input,
textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #45a049;
}

.submit-btn:active {
  transform: scale(0.98);
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.info-section p {
  margin: 0.5rem 0;
  color: #666;
  line-height: 1.6;
}

.phone-number {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 1rem 0 !important;
}

.availability {
  color: #999;
  font-size: 0.95rem;
}

.bold {
  font-weight: 600;
}

.emails-link {
  text-decoration: none;
  display: block;
}

.view-emails-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;
}

.view-emails-btn:hover {
  background: #0b7dda;
}

/* Responsive design */
@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 1.8rem;
  }

  .form-section,
  .info-section {
    padding: 1.5rem;
  }
}
</style>
