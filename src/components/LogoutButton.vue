<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue'

export default defineComponent({
    name: 'LogoutButton',
    setup() {
        const { logout } = useAuth0()

        return {
            logout
        }
    }
})
</script>

<template>
    <NButton size="small" @click="logout">Logout</NButton>
</template>