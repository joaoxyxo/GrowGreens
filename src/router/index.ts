import { createRouter, createWebHistory } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: () => import('@/features/home/HomeView.vue') },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/features/onboarding/OnboardingView.vue'),
      meta: { hideTabBar: true, allowAnon: true },
    },
    {
      path: '/desafio',
      name: 'challenge',
      component: () => import('@/features/microgreens/ChallengeView.vue'),
    },
    { path: '/catalogo', name: 'catalog', component: () => import('@/features/catalog/CatalogView.vue') },
    {
      path: '/planta/:slug',
      name: 'plant',
      component: () => import('@/features/catalog/PlantDetailView.vue'),
    },
    { path: '/jardim', name: 'garden', component: () => import('@/features/garden/GardenView.vue') },
    { path: '/jardim/plano', name: 'planner', component: () => import('@/features/planner/PlannerView.vue') },
    {
      path: '/jardim/plano/:id',
      name: 'bed',
      component: () => import('@/features/planner/BedView.vue'),
    },
    {
      path: '/jardim/:id',
      name: 'planting',
      component: () => import('@/features/garden/PlantingDetailView.vue'),
    },
    { path: '/curso', name: 'course', component: () => import('@/features/course/CourseView.vue') },
    {
      path: '/curso/revisao',
      name: 'review',
      component: () => import('@/features/course/ReviewView.vue'),
      meta: { hideTabBar: true },
    },
    {
      path: '/curso/licao/:id',
      name: 'lesson',
      component: () => import('@/features/course/LessonView.vue'),
      meta: { hideTabBar: true },
    },
    { path: '/saude', name: 'health', component: () => import('@/features/health/HealthView.vue') },
    {
      path: '/saude/:code',
      name: 'health-detail',
      component: () => import('@/features/health/HealthDetailView.vue'),
    },
    { path: '/calendario', name: 'calendar', component: () => import('@/features/calendar/CalendarView.vue') },
    { path: '/perfil', name: 'profile', component: () => import('@/features/profile/ProfileView.vue') },
    {
      path: '/diagnostico',
      name: 'diagnosis',
      component: () => import('@/features/diagnosis/DiagnosisView.vue'),
    },
    { path: '/glossario', name: 'glossary', component: () => import('@/features/glossary/GlossaryView.vue') },
    { path: '/legal', name: 'legal', component: () => import('@/features/legal/LegalView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const settings = useSettingsStore()
  if (!settings.state.onboardingComplete && to.name !== 'onboarding') {
    return { name: 'onboarding' }
  }
  if (settings.state.onboardingComplete && to.name === 'onboarding') {
    return { name: 'home' }
  }
  return true
})
