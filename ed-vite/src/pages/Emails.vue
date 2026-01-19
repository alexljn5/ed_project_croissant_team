<template>
  <div class="emails-page">
    <div class="emails-header">
      <div class="header-content">
        <h1>Ontvangen Berichten</h1>
      </div>
      <div class="email-count">{{ emails.length }}</div>
    </div>

    <div class="emails-container">
      <div v-if="emails.length === 0" class="no-emails">
        <p class="empty-icon">📧</p>
        <p class="empty-text">Nog geen berichten ontvangen</p>
        <router-link to="/contact" class="back-to-contact">
          <button class="back-btn">Terug naar contactformulier</button>
        </router-link>
      </div>

      <div v-else class="emails-list">
        <transition-group name="list" tag="div">
          <div
            v-for="(email, index) in emails"
            :key="email.id"
            class="email-item"
            :style="{ '--delay': index * 50 + 'ms' }"
          >
            <div class="email-header">
              <div class="email-indicator"></div>
              <div class="email-info">
                <h2>{{ email.subject }}</h2>
                <div class="email-meta">
                  <div class="meta-row">
                    <span class="meta-label">👤 Van:</span>
                    <span class="meta-value">{{ email.name }}</span>
                  </div>
                  <div class="meta-row">
                    <span class="meta-label">📧 Email:</span>
                    <a :href="'mailto:' + email.email" class="email-link">{{
                      email.email
                    }}</a>
                  </div>
                  <div class="meta-row">
                    <span class="meta-label">📅 Datum:</span>
                    <span class="meta-value">{{ email.date }}</span>
                  </div>
                </div>
              </div>
              <button
                @click="deleteEmail(email.id)"
                class="delete-btn"
                title="Verwijder dit bericht"
              >
                🗑️
              </button>
            </div>
            <div class="email-body">
              <p>{{ email.message }}</p>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useEmail } from "@/composables/useEmail";

const { emails, deleteEmail, getAllEmails } = useEmail();

onMounted(() => {
  getAllEmails();
});
</script>

<style scoped>
/* Header */
.emails-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
}

.emails-header {
  background: linear-gradient(
    135deg,
    var(--site-paars, #6b4e99) 0%,
    #8b5fcf 100%
  );
  color: white;
  padding: 3rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  animation: slideDown 0.6s ease-out;
}

.header-subtitle {
  font-size: 1rem;
  opacity: 0.95;
  margin: 0;
  animation: slideDown 0.8s ease-out;
}

.email-count {
  font-size: 3rem;
  font-weight: 700;
  opacity: 0.9;
  animation: slideDown 0.7s ease-out;
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

/* Container */
.emails-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

/* Empty State */
.no-emails {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.8s ease-out;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

.empty-text {
  font-size: 1.2rem;
  color: #999;
  margin-bottom: 2rem;
}

.back-to-contact {
  text-decoration: none;
}

.back-btn {
  padding: 0.8rem 2rem;
  background: linear-gradient(
    135deg,
    var(--site-paars, #6b4e99) 0%,
    #8b5fcf 100%
  );
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(107, 78, 153, 0.3);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(107, 78, 153, 0.4);
}

/* Emails List */
.emails-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

/* Email Item */
.email-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 5px solid var(--site-paars, #6b4e99);
  animation: slideIn 0.5s ease-out;
  animation-delay: var(--delay);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.email-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.email-header {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
  border-bottom: 1px solid #eee;
}

.email-indicator {
  width: 12px;
  height: 12px;
  background: linear-gradient(
    135deg,
    var(--site-paars, #6b4e99) 0%,
    #8b5fcf 100%
  );
  border-radius: 50%;
  margin-top: 0.3rem;
  flex-shrink: 0;
}

.email-info {
  flex: 1;
  min-width: 0;
}

.email-info h2 {
  margin: 0 0 0.8rem 0;
  font-size: 1.3rem;
  color: #333;
  word-break: break-word;
  font-weight: 600;
}

.email-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.meta-label {
  color: #999;
  font-weight: 500;
  min-width: fit-content;
}

.meta-value {
  color: #555;
}

.email-link {
  color: var(--site-paars, #6b4e99);
  text-decoration: none;
  word-break: break-all;
  transition: color 0.2s ease;
}

.email-link:hover {
  color: #8b5fcf;
  text-decoration: underline;
}

/* Delete Button */
.delete-btn {
  padding: 0.5rem 0.7rem;
  background: #ff5252;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  white-space: nowrap;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(255, 82, 82, 0.2);
}

.delete-btn:hover {
  background: #ff1744;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(255, 82, 82, 0.3);
}

.delete-btn:active {
  transform: scale(0.95);
}

/* Email Body */
.email-body {
  padding: 1.5rem;
  color: #555;
  line-height: 1.7;
  white-space: pre-wrap;
  word-wrap: break-word;
  background: white;
}

.email-body p {
  margin: 0;
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .emails-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 2rem 1rem;
  }

  .header-content h1 {
    font-size: 1.8rem;
  }

  .header-subtitle {
    font-size: 0.9rem;
  }

  .email-count {
    font-size: 2rem;
  }

  .emails-container {
    padding: 2rem 1rem;
  }

  .email-header {
    flex-direction: column;
    gap: 1rem;
  }

  .email-info h2 {
    font-size: 1.1rem;
  }

  .meta-row {
    flex-wrap: wrap;
  }

  .delete-btn {
    align-self: flex-start;
  }

  .no-emails {
    padding: 3rem 1rem;
  }
}

@media (max-width: 480px) {
  .emails-header {
    padding: 1.5rem 1rem;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .email-count {
    font-size: 1.8rem;
  }

  .email-item {
    border-left-width: 3px;
  }

  .email-header {
    padding: 1rem;
  }

  .email-body {
    padding: 1rem;
    font-size: 0.95rem;
  }
}
</style>
