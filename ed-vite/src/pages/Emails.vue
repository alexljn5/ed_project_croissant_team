<template>
  <div class="emails-container">
    <h1>Ontvangen Emails</h1>

    <div v-if="emails.length === 0" class="no-emails">
      <p>Geen emails ontvangen</p>
    </div>

    <div v-else class="emails-list">
      <div v-for="email in emails" :key="email.id" class="email-item">
        <div class="email-header">
          <div class="email-info">
            <h2>{{ email.subject }}</h2>
            <p class="email-from">
              <strong>Van:</strong> {{ email.name }} ({{ email.email }})
            </p>
            <p class="email-date">{{ email.date }}</p>
          </div>
          <button @click="deleteEmail(email.id)" class="delete-btn">
            Verwijderen
          </button>
        </div>
        <div class="email-body">
          <p>{{ email.message }}</p>
        </div>
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
.emails-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.no-emails {
  text-align: center;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
  color: #666;
}

.emails-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.email-item {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.email-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.email-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.email-info {
  flex: 1;
}

.email-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  color: #333;
}

.email-from {
  margin: 0.25rem 0;
  font-size: 0.95rem;
  color: #666;
}

.email-date {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: #999;
}

.delete-btn {
  padding: 0.5rem 1rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: background 0.3s ease;
}

.delete-btn:hover {
  background: #cc0000;
}

.email-body {
  padding: 1.5rem;
  line-height: 1.6;
  color: #444;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
