<script lang="ts">
import { defineComponent, watchEffect } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const { user, loginWithRedirect, isAuthenticated } = useAuth0()

    // Reactively watch for `user` changes
    watchEffect(() => {
      if (isAuthenticated.value && user?.value?.email) {
        // window.location.href = '/#/dashboard'
      }
    })

    return {
      loginWithRedirect,
      user
    }
  },
})
</script>

<template>
  <NHeroSection
    layout="center"
    title="Momentum"
    subtitle="Your productivity hub"
    content="Log in or sign up to unlock your personalized dashboard and stay on top of your goals."
    :actionButtons="[{
      label: 'Log in / Sign up',
      primary: true,
      onClick: () => {
        loginWithRedirect()
      }
    }]"
  />

  <NHeroSection
    layout="left"
    title="Habits"
    subtitle="Build better habits, effortlessly"
    content="Create and manage habit groups with ease. Track your progress and stay motivated over time."
  >
    <template #image>
      <img src="/habits.png" alt="Hero Image" class="hero-image"/>
    </template>
  </NHeroSection>

  <NHeroSection
    layout="right"
    title="Checklists"
    subtitle="Stay organized with powerful checklists"
    content="Break down projects into actionable tasks and sub-tasks to keep everything on track."
  >
    <template #image>
      <img src="/checklists.png" alt="Hero Image" class="hero-image"/>
    </template>
  </NHeroSection>

  <NHeroSection
    layout="left"
    title="Friends"
    subtitle="Connect with friends and family"
    content="Share your progress and support each other in achieving your goals. Stay motivated together."
  >
    <template #image>
      <img src="/friends.png" alt="Hero Image" class="hero-image"/>
    </template>
  </NHeroSection>

  <NHeroSection
    layout="right"
    title="Helpful AI Chatbot"
    subtitle="Your personal productivity assistant"
    content="Get personalized tips and reminders to help you stay on track. Ask questions about your data and get instant answers."
  >
    <template #image>
      <img src="/chatbot.png" alt="Hero Image" class="hero-image"/>
    </template>
  </NHeroSection>

  <div class="atlas-section">
  <NHeroSection
    layout="left"
    title="Atlas"
    subtitle="RigelSystems"
    content="Checkout our other products and services at RigelSystems. We are dedicated to providing you with the best tools for productivity and organization."
    :actionButtons="[{label: 'Visit Atlas', href: 'https://atlas.rigelsystems.co.uk/'}]"
  >
    <template #image>
      <img src="/atlas.png" alt="Hero Image" class="hero-image"/>
    </template>
  </NHeroSection>
  </div>
</template>
