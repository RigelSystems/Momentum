<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      deferredPrompt: null as BeforeInstallPromptEvent | null, // Use the appropriate type for the event
    };
  },
  mounted() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      // Prevent the default mini-infobar from showing
      event.preventDefault();
      // Save the event for triggering the install prompt
      this.deferredPrompt = event as BeforeInstallPromptEvent;
    });

    // Optional: Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
    });
  },
  methods: {
    async installApp() {
      if (this.deferredPrompt) {
        // Show the install prompt
        this.deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // Clear the deferredPrompt
        this.deferredPrompt = null;
      } else {
        console.log('Install prompt not available.');
      }
    },
  },
});

// Define BeforeInstallPromptEvent interface (not included in TypeScript by default)
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
</script>

<template>
  <div class="page-wrapper">
    <h1>Dashboard</h1>
    <button @click="installApp">Install App</button>
  </div>
</template>
