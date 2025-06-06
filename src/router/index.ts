import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import AccountView from '@/views/AccountView.vue'
import { authGuard } from '@auth0/auth0-vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      beforeEnter: authGuard,
    },
    {
      path: '/habits',
      name: 'habits',
      component: () => import('../views/HabitsView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('../views/TimelineView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/habits/:id',
      name: 'habit',
      component: () => import('../views/HabitView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/checklists',
      name: 'checklists',
      component: () => import('../views/ChecklistsView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/checklists/:id',
      name: 'checklist',
      component: () => import('../views/ChecklistView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/workouts',
      name: 'workouts',
      component: () => import('../views/WorkoutsView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/workouts/:id',
      name: 'workout',
      component: () => import('../views/WorkoutView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      beforeEnter: authGuard,
    }
  ],
})

export default router
