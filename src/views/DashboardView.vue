<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      deferredPrompt: null as BeforeInstallPromptEvent | null,
      installStatus: '', // Debug info for install process
    };
  },
  mounted() {
    console.log('Mounted: Setting up beforeinstallprompt listener');

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      console.log('beforeinstallprompt event triggered:', event);

      // Save the event for triggering the install prompt
      this.deferredPrompt = event as BeforeInstallPromptEvent;
      this.installStatus = 'Ready to install!';
    });

    // Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
      console.log('App successfully installed!');
      this.installStatus = 'App successfully installed!';
    });
  },
  methods: {
    async installApp() {
      console.log('Install button clicked.');

      if (this.deferredPrompt) {
        console.log('Showing the install prompt.');

        // Show the install prompt
        this.deferredPrompt.prompt();

        // Wait for the user's choice
        const userChoice = await this.deferredPrompt.userChoice;
        console.log('User choice from install prompt:', userChoice);

        if (userChoice.outcome === 'accepted') {
          this.installStatus = 'User accepted the install prompt.';
        } else {
          this.installStatus = 'User dismissed the install prompt.';
        }

        // Clear the deferredPrompt
        this.deferredPrompt = null;
      } else {
        console.error('Install prompt not available.');
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
    <v-btn :disabled="!deferredPrompt" @click="installApp">Install App</v-btn>
    <div class="debug-info">
      <p><strong>Install Status:</strong> {{ installStatus }}</p>
    </div>
    <div class="instructions">
      <h2>iOS Users</h2>
      <p>To install on iPhone or iPad:</p>
      <ol>
        <li>Open this page in Safari.</li>
        <li>Tap the Share button (box with an arrow).</li>
        <li>Select "Add to Home Screen".</li>
      </ol>
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
.instructions {
  margin-top: 20px;
  background: #fff8dc;
  padding: 10px;
  border: 1px solid #f0c36d;
  border-radius: 4px;
}
.instructions ol {
  padding-left: 20px;
}
</style>
