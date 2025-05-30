<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import RequestButton from '@/components/shared/RequestButton.vue';
import FriendForm from '@/components/friends/FriendForm.vue';
import NButton from '@rigelsystems/novaui/src/stories/NButton/NButton.vue';

export default defineComponent({
  name: 'Friends',
  props: {
    accessToken: {
      type: String,
      required: false,
    },
  },
  components: {
    RequestButton,
    FriendForm,
    NButton,
  },
  setup(props) {
    let loading = false;
    let friends = ref<Array<any>>([]);
    const { user } = useAuth0();

    onMounted(async () => {
      fetchFriends();
    });

    const fetchFriends = async () => {
      loading = true;
      const apiUrl = `${import.meta.env.VITE_API_URL}friends`
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.accessToken}`,
        },
      });
      friends.value = await response.json();
      loading = false;
    };

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

    const deleteFriendRequestUrl = (id: number) => {
      return `${import.meta.env.VITE_API_URL}friends/${id}`;
    };

    return {
      loading,
      friends,
      fetchFriends,
      updateFriendRequest,
      deleteFriendRequestUrl,
      user,
    };
  },
});
</script>

<template>
  <h2>Friends</h2>

  <FriendForm
    @requestSent="fetchFriends"
  >
    <template #trigger="{ openDialog }">
      <NButton
        label="Find Friend"
        class="mr-2 my-4"
        @click="openDialog"
      />
    </template>
  </FriendForm>

  <div class="d-flex flex-column gap-1">
    <p v-if="friends.length == 0">You don't have any friends :(</p>
    <NCard :title="friend.user_two.email" v-for="friend in friends" :key="friend.id">
      <template #content>
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

        <RequestButton
          @requestCompleted="fetchFriends"
          label="Delete Friend"
          :url="deleteFriendRequestUrl(friend.id)"
          method="delete"
        ></RequestButton>
      </template>
    </NCard>
  </div>
</template>

