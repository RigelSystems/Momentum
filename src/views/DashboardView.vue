<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { useAuthToken } from '@/composables/useAuthToken'
import NCircleProgress from '@rigelsystems/novaui/src/stories/NCircleProgress/NCircleProgress.vue'

interface HabitCard { name: string; count: number; colour: string }

interface DashboardData {
  today:  { completed: number; total: number; date: string }
  week:   { total_completions: number; days_with_entries: number; days_elapsed: number }
  month:  { total_completions: number; daily_average: number; days_elapsed: number }
  streak: { current: number; longest: number }
  habits: { total: number; most_completed: HabitCard | null; least_completed: HabitCard | null }
}

export default defineComponent({
  name: 'DashboardView',
  components: { NCircleProgress },
  setup() {
    const { accessToken } = useAuthToken()
    const data = ref<DashboardData | null>(null)

    const fetchDashboard = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}dashboard`, {
        headers: { Authorization: `Bearer ${accessToken.value}` },
      })
      if (res.ok) data.value = await res.json()
    }

    watch(accessToken, v => { if (v) fetchDashboard() }, { immediate: true })

    const todayPct = computed(() => data.value
      ? Math.round((data.value.today.completed / Math.max(data.value.today.total, 1)) * 100)
      : 0)

    const weekPct = computed(() => data.value
      ? Math.round((data.value.week.days_with_entries / Math.max(data.value.week.days_elapsed, 1)) * 100)
      : 0)

    return { data, todayPct, weekPct }
  }
})
</script>

<template>
  <div v-if="data" class="dashboard">

    <!-- Greeting -->
    <div class="dashboard__greeting">
      <div>
        <h2 class="dashboard__greeting-title">Good day 👋</h2>
        <p class="dashboard__greeting-date">{{ data.today.date }}</p>
      </div>
      <div v-if="data.streak.current > 0" class="dashboard__streak-pill">
        <span>🔥</span>
        <span class="streak-count">{{ data.streak.current }}</span>
        <span class="streak-label">day streak</span>
      </div>
    </div>

    <!-- Top row -->
    <div class="dashboard__grid dashboard__grid--top">

      <div class="dash-card dash-card--today">
        <div class="dash-card__label">Today's Goals</div>
        <div class="dash-card__body">
          <NCircleProgress
            :current="data.today.completed"
            :total="Math.max(data.today.total, 1)"
            :size="88"
            :strokeWidth="9"
            progressColor="#42b883"
            fontSize="14px"
          />
          <div class="dash-card__side">
            <div class="dash-card__big">{{ data.today.completed }}<span class="dash-card__denom">/{{ data.today.total }}</span></div>
            <div class="dash-card__sub">{{ todayPct }}% complete</div>
          </div>
        </div>
      </div>

      <div class="dash-card">
        <div class="dash-card__label">This Week</div>
        <div class="dash-card__big">{{ data.week.total_completions }}</div>
        <div class="dash-card__sub">completions</div>
        <div class="dash-card__progress-bar">
          <div class="dash-card__progress-fill" :style="{ width: weekPct + '%' }"></div>
        </div>
        <div class="dash-card__sub">{{ data.week.days_with_entries }}/{{ data.week.days_elapsed }} days active</div>
      </div>

      <div class="dash-card">
        <div class="dash-card__label">This Month</div>
        <div class="dash-card__big">{{ data.month.total_completions }}</div>
        <div class="dash-card__sub">completions</div>
        <div class="dash-card__divider"></div>
        <div class="dash-card__stat-row">
          <span>Daily avg</span><strong>{{ data.month.daily_average }}</strong>
        </div>
        <div class="dash-card__stat-row">
          <span>Days tracked</span><strong>{{ data.month.days_elapsed }}</strong>
        </div>
      </div>

      <div class="dash-card dash-card--streak">
        <div class="dash-card__label">Streak</div>
        <div class="dash-card__streak-icon">🔥</div>
        <div class="dash-card__big">{{ data.streak.current }}<span class="dash-card__unit">d</span></div>
        <div class="dash-card__sub">current</div>
        <div class="dash-card__divider"></div>
        <div class="dash-card__stat-row">
          <span>Best ever</span><strong>{{ data.streak.longest }}d</strong>
        </div>
      </div>

    </div>

    <!-- Bottom row -->
    <div class="dashboard__grid dashboard__grid--bottom">

      <div class="dash-card">
        <div class="dash-card__label">Active Habits</div>
        <div class="dash-card__big">{{ data.habits.total }}</div>
        <div class="dash-card__sub">habits tracked</div>
      </div>

      <div class="dash-card" v-if="data.habits.most_completed">
        <div class="dash-card__label">Most Consistent</div>
        <div class="dash-card__habit-dot" :style="{ background: data.habits.most_completed.colour || '#42b883' }"></div>
        <div class="dash-card__big dash-card__big--name">{{ data.habits.most_completed.name }}</div>
        <div class="dash-card__sub">{{ data.habits.most_completed.count }} total entries</div>
      </div>

      <div class="dash-card dash-card--warn" v-if="data.habits.least_completed">
        <div class="dash-card__label">Needs Attention</div>
        <div class="dash-card__habit-dot" :style="{ background: data.habits.least_completed.colour || '#ff6e6e' }"></div>
        <div class="dash-card__big dash-card__big--name">{{ data.habits.least_completed.name }}</div>
        <div class="dash-card__sub">{{ data.habits.least_completed.count }} total entries</div>
      </div>

    </div>

  </div>

  <div v-else class="dashboard__loading">
    <p>Loading dashboard…</p>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1100px;
  margin: 0 auto;
}

.dashboard__greeting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.25rem;
}
.dashboard__greeting-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
}
.dashboard__greeting-date {
  font-size: 0.85rem;
  color: #888;
  margin: 0.1rem 0 0;
}
.dashboard__streak-pill {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  font-size: 0.85rem;
}
.streak-count { font-weight: 700; color: #ea580c; }
.streak-label { color: #9a3412; }

.dashboard__grid {
  display: grid;
  gap: 1rem;
}
.dashboard__grid--top    { grid-template-columns: repeat(4, 1fr); }
.dashboard__grid--bottom { grid-template-columns: repeat(3, 1fr); }

.dash-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.1rem 1.2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.dash-card--streak { background: linear-gradient(135deg, #fff7ed, #ffedd5); }
.dash-card--warn   { background: linear-gradient(135deg, #fff5f5, #ffe4e6); }

.dash-card__label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
  margin-bottom: 0.1rem;
}
.dash-card__big {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.1;
}
.dash-card__big--name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dash-card__denom {
  font-size: 1rem;
  font-weight: 400;
  color: #9ca3af;
}
.dash-card__unit {
  font-size: 1rem;
  color: #9ca3af;
}
.dash-card__sub {
  font-size: 0.78rem;
  color: #6b7280;
}
.dash-card__body {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}
.dash-card__side {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.dash-card__divider {
  border-top: 1px solid #f3f4f6;
  margin: 0.2rem 0;
}
.dash-card__stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.79rem;
  color: #6b7280;
}
.dash-card__stat-row strong {
  color: #374151;
  font-weight: 600;
}
.dash-card__progress-bar {
  height: 5px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
  margin: 0.2rem 0;
}
.dash-card__progress-fill {
  height: 100%;
  background: #42b883;
  border-radius: 99px;
  transition: width 0.5s ease;
}
.dash-card__habit-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dash-card__streak-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.dashboard__loading {
  padding: 2rem;
  color: #9ca3af;
  text-align: center;
}

@media (max-width: 900px) {
  .dashboard__grid--top    { grid-template-columns: repeat(2, 1fr); }
  .dashboard__grid--bottom { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 540px) {
  .dashboard__grid--top    { grid-template-columns: 1fr; }
  .dashboard__grid--bottom { grid-template-columns: 1fr; }
}
</style>
