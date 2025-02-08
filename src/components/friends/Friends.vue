
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

export default defineComponent({
  name: 'Friends',
  props: {
    accessToken: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    let loading = false;
    let friends = ref<Array<any>>([]);
    const { user } = useAuth0();

    onMounted(async () => {
      loading = true;
      const apiUrl = `${import.meta.env.VITE_API_URL}friends`
      console.log('apiUrl', apiUrl)
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.accessToken}`,
        },
      });
      friends.value = await response.json();
      loading = false;
    });

    return {
      loading,
      friends,
      user
    };
  },
});
</script>

<template>
  <div>
    <h2>Friends</h2>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="friend in friends" :key="friend.id">
          <span v-if="user?.email === friend.user_two.email">{{ friend.user_one.email }} Wants to be friends: <button>Accept</button> <button>Decline</button></span>
          <span v-else>{{ friend.user_two.email }} - {{ friend.status }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

