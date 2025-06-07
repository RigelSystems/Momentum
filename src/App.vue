<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import Navigation from './components/Navigation.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import User from './components/User.vue'
import LogoutButton from './components/LogoutButton.vue'
import { useFeatureFlag } from './composables/useFeatureFlag'

export default defineComponent({
  name: 'App',
  components: {
    Navigation,
    User,
    LogoutButton
  },
  setup() {
    const { isFeatureEnabled } = useFeatureFlag()
    const { user, loginWithRedirect } = useAuth0()

    const currentPath = ref(window.location.hash.replace(/^#/, '') || '/')
    const updatePath = () => {
      currentPath.value = "/#" + window.location.hash.replace(/^#/, '') || '/'
      if (currentPath.value === '/#/') {
        currentPath.value = '/'
      }
    }
    window.addEventListener('hashchange', updatePath)
    onMounted(() => {
      updatePath()
    })
    onBeforeUnmount(() => {
      window.removeEventListener('hashchange', updatePath)
    })

    const isLoggedIn = computed(() => !!user.value?.email)

    const links = computed(() => [
      { label: 'Home',       url: '/' },
      { label: 'Dashboard',  url: '/#/dashboard', visible: isLoggedIn.value },
      { label: 'Habits',     url: '/#/habits',    visible: isLoggedIn.value },
      { label: 'Timeline',   url: '/#/timeline',  visible: isFeatureEnabled() },
      { 
        label: 'Lists', 
        url: '/#/lists',
        visible: isFeatureEnabled(),
        dropdown: [
          { label: 'Workouts', url: '/#/workouts' },
          { label: 'Checklists', url: '/#/checklists' }
        ]
      },
      { label: 'Admin',    url: '/#/admin',   visible: isFeatureEnabled() },
      { label: 'Account',    url: '/#/account',   visible: isLoggedIn.value },
    ])

    const mobileBottomLinks = computed(() => [
      { icon: 'mdi-view-dashboard-outline', url: '/#/dashboard', visible: isLoggedIn.value, label: 'Dashboard' },
      { icon: 'mdi-check-circle-outline',   url: '/#/habits',    visible: isLoggedIn.value, label: 'Habits' },
      { icon: 'mdi-timeline-text',          url: '/#/timeline',  visible: isFeatureEnabled(), label: 'Timeline' },
      { icon: 'mdi-cog',                    url: '/#/admin',   visible: isLoggedIn.value, label: 'Admin' },
      { icon: 'mdi-account-outline',        url: '/#/account',   visible: isLoggedIn.value, label: 'Account' },
    ])

    return {
      links,
      mobileBottomLinks,
      currentPath,
      user,
      loginWithRedirect
    }
  },
})
</script>

<template>
  <NNavigationBar :links="links" :mobile-bottom-links="mobileBottomLinks" :current-path="currentPath" :show-mobile-bottom-links="true">
    <template #logo>
      <img class="logo" src="./assets/images/momentum-favicon.png" alt="Logo" />
    </template>

    <template #user>
      <NButton
        v-if="!user"
        class="login-button"
        size="small"
        text
        @click="loginWithRedirect"
      >Log in / Sign up</NButton>
      <LogoutButton v-else />
    </template>
  </NNavigationBar>

  <router-view />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
