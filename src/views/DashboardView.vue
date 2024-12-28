<template>
  <div class="page-wrapper">
    <h1>Dashboard</h1>
    <button @click="installApp">Install App</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deferredPrompt: null, // To save the beforeinstallprompt event
    };
  },
  mounted() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event) => {
      // Prevent the default mini-infobar from showing
      event.preventDefault();
      // Save the event for triggering the install prompt
      this.deferredPrompt = event;
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
};
</script>
