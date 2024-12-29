<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import User from './User.vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'

export default defineComponent({
  name: 'Navigation',
  data() {
    return {
      drawer: false as boolean,
    }
  },
  components: {
    User,
  },
  setup() {
    const { logout, user, isAuthenticated } = useAuth0()
    const navigationLinks = [
      {
        icon: '',
        title: 'Home',
        value: 'Home',
        to: '/',
        requireAuth: false,
      },
      {
        icon: 'mdi-view-dashboard',
        title: 'Dashboard',
        value: 'Dashboard',
        to: '/dashboard',
        requireAuth: true,
      },
      {
        icon: 'mdi-list-status',
        title: 'Habits',
        value: 'Habits',
        to: '/habits',
        requireAuth: true,
      },
      {
        icon: '',
        title: 'Check Lists',
        value: 'Check Lists',
        to: '/check-lists',
        requireAuth: true,
      },
      {
        icon: 'mdi-logout',
        title: 'Account',
        value: 'Account',
        to: '/account',
        requireAuth: true,
      }
    ]
    const accessTokenStore = useAccessTokenStore()
    const logoutAndClearState = async () => {
      accessTokenStore.$reset()
      accessTokenStore.clearState()
      localStorage.clear()
      sessionStorage.clear()
      await logout()
    }
    const usingPwa = window.matchMedia('(display-mode: standalone)').matches
    // const usingPwa = true
    const usingMobile = ref(window.innerWidth <= 960)

    const updateMobileStatus = () => {
      usingMobile.value = window.innerWidth <= 960
    }

    onMounted(() => {
      window.addEventListener('resize', updateMobileStatus)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateMobileStatus)
    })

    return {
      logout,
      user,
      logoutAndClearState,
      isAuthenticated,
      usingPwa,
      usingMobile
    }
  },
})
</script>

<template>
  <v-app>
    <v-card>
      <v-layout>
        <v-navigation-drawer expand-on-hover rail>
          <v-list v-if="isAuthenticated && user">
            <v-list-item
              :prepend-avatar="user.picture"
              :subtitle="user.email"
              :title="user?.name"
            ></v-list-item>
          </v-list>

          <v-divider v-if="isAuthenticated && user"></v-divider>

          <v-list v-if="isAuthenticated && user">
            <v-list-item
              prepend-icon="mdi-view-dashboard"
              title="Dashboard"
              value="Dashboard"
              router
              to="/dashboard"
            ></v-list-item>
          </v-list>

          <v-divider v-if="isAuthenticated && user"></v-divider>

          <v-list>
            <v-list-item
              prepend-icon="mdi-list-status"
              title="Habits"
              value="Habits"
              router
              to="/habits"
            ></v-list-item>

          </v-list>
          <v-divider></v-divider>
          <v-list>

            <v-list-item
              prepend-icon="mdi-invoice-text-plus"
              title="Create List"
              value="Create List"
              router
              to="/create-list"
            ></v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item
              prepend-icon="mdi-logout"
              title="Logout"
              value="Logout"
              @click="logoutAndClearState"
            ></v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-main class="bg-light-grey page-container">
          <div class="d-flex d-lg-none"><br /><br /><br /></div>
          <router-view />
        </v-main>
      </v-layout>
    </v-card>

    <!-- App Bar -->
    <v-app-bar app v-if="usingMobile && !usingPwa">
      <v-btn icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Mobile Drawer -->
    <v-navigation-drawer v-if="!usingPwa" v-model="drawer" app class="d-flex d-lg-none">
      <template v-slot:prepend>
        <v-list-item
          lines="two"
          :prepend-avatar="user?.picture"
          subtitle="Logged in"
          :title="user?.name"
        ></v-list-item>
      </template>

      <v-divider></v-divider>
      <v-list>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          router
          to="/dashboard"
          @click="drawer = false"
        >
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-card-account-details"
          router
          to="/companies"
          @click="drawer = false"
        >
          <v-list-item-title>Companies</v-list-item-title>
        </v-list-item>
        <v-list-item prepend-icon="mdi-watermark" router to="/brands" @click="drawer = false">
          <v-list-item-title>Brands</v-list-item-title>
        </v-list-item>
        <v-list-item prepend-icon="mdi-factory" router to="/distilleries" @click="drawer = false">
          <v-list-item-title>Distilleries</v-list-item-title>
        </v-list-item>
        <v-list-item prepend-icon="mdi-liquor" router to="/spirits" @click="drawer = false">
          <v-list-item-title>Spirits</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- PWA Mobile App Bar -->
    <v-bottom-navigation v-if="usingPwa">
      <v-btn value="recent">
        <v-icon>mdi-history</v-icon>

        <span>Recent</span>
      </v-btn>

      <v-btn value="favorites">
        <v-icon>mdi-heart</v-icon>

        <span>Favorites</span>
      </v-btn>

      <v-btn value="nearby">
        <v-icon>mdi-map-marker</v-icon>

        <span>Nearby</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>
