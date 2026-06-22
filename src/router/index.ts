import { createRouter, createWebHistory } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: () => import('@/features/home/HomeView.vue'), meta: { title: 'Início' } },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/features/onboarding/OnboardingView.vue'),
      meta: { hideTabBar: true, allowAnon: true, title: 'Bem-vindo' },
    },
    {
      path: '/desafio',
      name: 'challenge',
      component: () => import('@/features/microgreens/ChallengeView.vue'),
      meta: { title: 'Desafio dos microgreens' },
    },
    { path: '/catalogo', name: 'catalog', component: () => import('@/features/catalog/CatalogView.vue'), meta: { title: 'Catálogo de plantas' } },
    {
      path: '/planta/:slug',
      name: 'plant',
      component: () => import('@/features/catalog/PlantDetailView.vue'),
      meta: { title: 'Planta' },
    },
    { path: '/jardim', name: 'garden', component: () => import('@/features/garden/GardenView.vue'), meta: { title: 'A minha horta' } },
    { path: '/jardim/plano', name: 'planner', component: () => import('@/features/planner/PlannerView.vue'), meta: { title: 'Plano da horta' } },
    {
      path: '/jardim/plano/:id',
      name: 'bed',
      component: () => import('@/features/planner/BedView.vue'),
      meta: { title: 'Espaço da horta' },
    },
    {
      path: '/jardim/:id',
      name: 'planting',
      component: () => import('@/features/garden/PlantingDetailView.vue'),
      meta: { title: 'A minha planta' },
    },
    { path: '/curso', name: 'course', component: () => import('@/features/course/CourseView.vue'), meta: { title: 'Curso' } },
    {
      path: '/curso/revisao',
      name: 'review',
      component: () => import('@/features/course/ReviewView.vue'),
      meta: { hideTabBar: true, title: 'Revisão' },
    },
    {
      path: '/curso/licao/:id',
      name: 'lesson',
      component: () => import('@/features/course/LessonView.vue'),
      meta: { hideTabBar: true, title: 'Lição' },
    },
    { path: '/saude', name: 'health', component: () => import('@/features/health/HealthView.vue'), meta: { title: 'Saúde & Nutrição' } },
    {
      path: '/saude/:code',
      name: 'health-detail',
      component: () => import('@/features/health/HealthDetailView.vue'),
      meta: { title: 'Saúde & Nutrição' },
    },
    { path: '/calendario', name: 'calendar', component: () => import('@/features/calendar/CalendarView.vue'), meta: { title: 'Calendário' } },
    { path: '/perfil', name: 'profile', component: () => import('@/features/profile/ProfileView.vue'), meta: { title: 'Perfil' } },
    {
      path: '/diagnostico',
      name: 'diagnosis',
      component: () => import('@/features/diagnosis/DiagnosisView.vue'),
      meta: { title: 'A minha planta não está bem' },
    },
    { path: '/glossario', name: 'glossary', component: () => import('@/features/glossary/GlossaryView.vue'), meta: { title: 'Glossário' } },
    { path: '/legal', name: 'legal', component: () => import('@/features/legal/LegalView.vue'), meta: { title: 'Privacidade e termos' } },
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

// Título do documento por rota (acessibilidade, histórico e partilha).
const BASE_TITLE = 'GrowGreens'
router.afterEach((to) => {
  const t = to.meta.title as string | undefined
  document.title = t ? `${t} · ${BASE_TITLE}` : BASE_TITLE
})
