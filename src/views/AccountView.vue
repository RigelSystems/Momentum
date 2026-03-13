<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import Friends from '@/components/friends/Friends.vue'
import { useUser } from '@/composables/useUser'

export default defineComponent({
  name: 'AccountView',
  components: { Friends },
  setup() {
    const { getAccessTokenSilently } = useAuth0()
    const accessToken = ref<string | null>(null)
    const { user, fetchUser } = useUser()

    onMounted(async () => {
      accessToken.value = await getAccessTokenSilently()
      await fetchUser()
    })

    return { accessToken, user }
  }
})
</script>

<template>
  <NAccountPage
    :user="{ name: user?.name, email: user?.email, image: user?.image ?? undefined }"
    :tabs="['Friends', 'Plan', 'Settings']"
    :badge="user?.premium ? 'Premium' : 'Free'"
    :badgePremium="user?.premium ?? false"
  >
    <template #default="{ activeTab }">

      <!-- Friends -->
      <div v-if="activeTab === 0">
        <Friends v-if="accessToken" :accessToken="accessToken" />
      </div>

      <!-- Plan -->
      <div v-else-if="activeTab === 1" class="account-section">
        <h3 class="account-section__title">Your Plan</h3>
        <div v-if="user?.premium" class="account-plan-card account-plan-card--premium">
          <div class="account-plan-card__icon">✦</div>
          <div>
            <p class="account-plan-card__name">Premium</p>
            <p class="account-plan-card__desc">You have access to all premium features including AI-powered habit import.</p>
          </div>
        </div>
        <div v-else class="account-plan-card account-plan-card--free">
          <div class="account-plan-card__icon">◇</div>
          <div>
            <p class="account-plan-card__name">Free Plan</p>
            <p class="account-plan-card__desc">Upgrade to Premium to unlock AI-powered habit import and more.</p>
          </div>
        </div>
      </div>

      <!-- Settings -->
      <div v-else-if="activeTab === 2" class="account-section">
        <h3 class="account-section__title">Helpful Bot</h3>
        <p class="account-section__sub">Get notifications and ask helpful questions about your data via Telegram.</p>

        <div v-if="user?.telegram_chat_id" class="account-info-row">
          <span class="mdi mdi-check-circle account-info-row__icon account-info-row__icon--ok"></span>
          <span>Connected — <a href="https://t.me/momentum_rigelsystems_bot?start=1" class="account-link">open chat</a></span>
        </div>
        <div v-else class="account-bot-setup">
          <p class="account-bot-setup__step">Send this command to your bot once to connect:</p>
          <code class="account-bot-setup__code">/start {{ user?.telegram_link_token }}</code>
          <a href="https://t.me/momentum_rigelsystems_bot?start=1" class="account-link account-link--btn">
            <span class="mdi mdi-send"></span> Connect Bot
          </a>
        </div>
      </div>

    </template>
  </NAccountPage>
</template>

<style scoped>
.account-section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.account-section__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.account-section__sub {
  font-size: 0.83rem;
  color: #6b7280;
  margin: 0;
}

/* Plan card */
.account-plan-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.account-plan-card--premium {
  background: linear-gradient(135deg, #fffbeb, #fef9c3);
  border-color: #fde68a;
}

.account-plan-card--free {
  background: #f9fafb;
}

.account-plan-card__icon {
  font-size: 1.4rem;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.account-plan-card__name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem;
}

.account-plan-card__desc {
  font-size: 0.82rem;
  color: #6b7280;
  margin: 0;
}

/* Info row */
.account-info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #374151;
}

.account-info-row__icon { font-size: 1rem; }
.account-info-row__icon--ok { color: #16a34a !important; }

/* Bot setup */
.account-bot-setup {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.account-bot-setup__step {
  font-size: 0.83rem;
  color: #6b7280;
  margin: 0;
}

.account-bot-setup__code {
  display: inline-block;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  font-size: 0.82rem;
  color: #374151;
  font-family: ui-monospace, monospace;
}

/* Links */
.account-link {
  color: var(--theme-color, #88bdb9);
  text-decoration: none;
  font-size: 0.83rem;
}

.account-link:hover { text-decoration: underline; }

.account-link--btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  background: var(--theme-color, #88bdb9);
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 500;
  width: fit-content;
}

.account-link--btn:hover {
  text-decoration: none;
  filter: brightness(0.93);
}
</style>
