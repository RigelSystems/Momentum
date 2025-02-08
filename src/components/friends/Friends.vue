
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

    const updateFriendRequest = async (id: number, status: string) => {
      const apiUrl = `${import.meta.env.VITE_API_URL}friends/${id}`
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.accessToken}`,
        },
        body: JSON.stringify({ status }),
      });
      const updatedFriend = await response.json();
      friends.value = friends.value.map((friend) => {
        if (friend.id === updatedFriend.id) {
          return updatedFriend;
        }
        return friend;
      });
    };

    return {
      loading,
      friends,
      updateFriendRequest,
      user,
    };
  },
});
</script>

<template>
  <div>
    <h2>Friends - {{ friends.length }}</h2>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="friend in friends" :key="friend.id">
          <div v-if="friend.status === 'pending'">
            <span v-if="user?.email === friend.user_two.email">
              <span>{{ friend.user_one.email }} Wants to be friends:</span>
              <button @click="updateFriendRequest(friend.id, `accepted`)">Accept</button>
              <button @click="updateFriendRequest(friend.id, `declined`)">Decline</button>
            </span>
            <span v-else>{{ friend.user_one.email }} - {{ friend.status }}</span>
          </div>
          <div v-else>
            <span v-if="user?.email === friend.user_two.email">
              <span>{{ friend.user_one.email }} - {{ friend.status }}</span>
            </span>
            <span v-else>
              <span>{{ friend.user_two.email }} - {{ friend.status }}</span>
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

