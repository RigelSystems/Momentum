<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      deferredPrompt: null as BeforeInstallPromptEvent | null, // Use the appropriate type for the event
    };
  },
  mounted() {
    console.log('Mounted: Setting up beforeinstallprompt listener');

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      console.log('beforeinstallprompt event triggered:', event);

      // Prevent the default mini-infobar from showing
      event.preventDefault();

      // Save the event for triggering the install prompt
      this.deferredPrompt = event as BeforeInstallPromptEvent;
      console.log('deferredPrompt saved:', this.deferredPrompt);
    });

    // Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
      console.log('appinstalled event triggered: PWA successfully installed');
    });

    // Debugging service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistration()
        .then((registration) => {
          if (registration) {
            console.log('Service Worker registered:', registration);
          } else {
            console.error('No Service Worker registered.');
          }
        })
        .catch((error) => {
          console.error('Error checking Service Worker registration:', error);
        });
    } else {
      console.error('Service Workers are not supported in this browser.');
    }
  },
  methods: {
    async installApp() {
      console.log('Install button clicked.');

      if (this.deferredPrompt) {
        console.log('deferredPrompt available, showing install prompt.');

        // Show the install prompt
        this.deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const userChoice = await this.deferredPrompt.userChoice;
        console.log('User choice from install prompt:', userChoice);

        // Clear the deferredPrompt
        this.deferredPrompt = null;
        console.log('deferredPrompt cleared.');
      } else {
        console.error('Install prompt not available. Check if beforeinstallprompt event was triggered.');
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
