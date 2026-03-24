import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/MainPage/HomePage.vue";
import DashboardPage from "@/pages/Dashboard/DashboardPage.vue";
import CustomizationPage from "@/pages/Customization/CustomizationPage.vue";
import GamePage from "@/pages/Game/GamePage.vue";
import LoginPage from "@/pages/Login/LoginPage.vue";
import StatsPage from "@/pages/Stats/StatsPage.vue";
import StorePage from "@/pages/Store/StorePage.vue";
import ScoreboardPage from "@/pages/Scoreboard/ScoreboardPage.vue";
import MatchHistoryPage from "@/pages/History/MatchHistoryPage.vue";
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue-sonner";
import MatchGamesPage from "@/pages/History/MatchGamesPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardPage,
    },
    {
      path: "/customization",
      name: "customization",
      component: CustomizationPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/game",
      name: "game",
      component: GamePage,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/stats",
      name: "stats",
      component: StatsPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/store",
      name: "store",
      component: StorePage,
      meta: { requiresAuth: true },
    },
    {
      path: "/scoreboard",
      name: "scoreboard",
      component: ScoreboardPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/matches",
      name: "matches",
      component: MatchHistoryPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/history/matches/:matchId',
      name: 'match-games',
      component: MatchGamesPage,
    }
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth === true;
  const allowsGuest = to.meta.allowsGuest === true;

  if (requiresAuth) {
    // Must be fully logged in (guest not allowed)
    if (!authStore.isLoggedIn) {
      toast.error("This navigation requires authentication");
      return next({ name: "login", query: { redirect: to.fullPath } });
    }
    return next();
  }

  if (allowsGuest) {
    // Either logged in OR in guest mode
    if (authStore.isLoggedIn || authStore.isGuest) {
      return next();
    }
    // Not logged in and not guest -> send to home/login to choose
    return next({ name: "home" });
  }

  return next();
});

export default router;
