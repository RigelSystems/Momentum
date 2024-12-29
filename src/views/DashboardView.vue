<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      deferredPrompt: null as BeforeInstallPromptEvent | null,
      isBeforeInstallPromptFired: false, // Tracks if beforeinstallprompt event fired
      isAppInstalled: false, // Tracks if the app was installed
      serviceWorkerStatus: '', // Debug info for service worker
      installStatus: '', // Debug info for install process
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
      this.isBeforeInstallPromptFired = true;
      this.installStatus = 'beforeinstallprompt event fired. Ready for install.';
    });

    // Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
      console.log('appinstalled event triggered: PWA successfully installed');
      this.isAppInstalled = true;
      this.installStatus = 'App successfully installed!';
    });

    // Debugging service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistration()
        .then((registration) => {
          if (registration) {
            console.log('Service Worker registered:', registration);
            this.serviceWorkerStatus = 'Service Worker registered and active.';
          } else {
            console.error('No Service Worker registered.');
            this.serviceWorkerStatus = 'No Service Worker registered.';
          }
        })
        .catch((error) => {
          console.error('Error checking Service Worker registration:', error);
          this.serviceWorkerStatus = `Error checking Service Worker registration: ${error.message}`;
        });
    } else {
      console.error('Service Workers are not supported in this browser.');
      this.serviceWorkerStatus = 'Service Workers are not supported in this browser.';
    }
  },
  methods: {
    async installApp() {
      console.log('Install button clicked.');

      if (this.deferredPrompt) {
        console.log('deferredPrompt available, showing install prompt.');
        this.installStatus = 'Install prompt triggered.';

        // Show the install prompt
        this.deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const userChoice = await this.deferredPrompt.userChoice;
        console.log('User choice from install prompt:', userChoice);

        if (userChoice.outcome === 'accepted') {
          this.installStatus = 'User accepted the install prompt.';
        } else {
          this.installStatus = 'User dismissed the install prompt.';
        }

        // Clear the deferredPrompt
        this.deferredPrompt = null;
        console.log('deferredPrompt cleared.');
      } else {
        console.error('Install prompt not available. Check if beforeinstallprompt event was triggered.');
        this.installStatus = 'Install prompt not available.';
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
    <v-btn @click="installApp" :disabled="!isBeforeInstallPromptFired">Install App</v-btn>
    <div class="debug-info">
      <p><strong>Install Status:</strong> {{ installStatus }}</p>
      <p><strong>Service Worker Status:</strong> {{ serviceWorkerStatus }}</p>
      <p><strong>App Installed:</strong> {{ isAppInstalled ? 'Yes' : 'No' }}</p>
    </div>
  </div>
</template>

<style>
.debug-info {
  margin-top: 20px;
  background: #f9f9f9;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.debug-info p {
  margin: 5px 0;
}
</style>
