import { ref, computed } from "vue";

export interface Email {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

const emails = ref<Email[]>([]);

// Load emails from localStorage
function loadEmails() {
  const stored = localStorage.getItem("emails");
  if (stored) {
    emails.value = JSON.parse(stored);
  }
}

// Save emails to localStorage
function saveEmails() {
  localStorage.setItem("emails", JSON.stringify(emails.value));
}

// Send a new email
function sendEmail(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  const newEmail: Email = {
    id: Date.now().toString(),
    name,
    email,
    subject,
    message,
    date: new Date().toLocaleString("nl-NL"),
  };

  emails.value.push(newEmail);
  saveEmails();
  return newEmail;
}

// Delete an email
function deleteEmail(id: string) {
  emails.value = emails.value.filter((e) => e.id !== id);
  saveEmails();
}

// Get all emails
function getAllEmails() {
  return emails.value;
}

// Get email by ID
function getEmailById(id: string) {
  return emails.value.find((e) => e.id === id);
}

export function useEmail() {
  loadEmails();

  return {
    emails: computed(() => emails.value),
    sendEmail,
    deleteEmail,
    getAllEmails,
    getEmailById,
  };
}
