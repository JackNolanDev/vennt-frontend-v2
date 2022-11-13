import HomeView from "@/views/HomeView.vue";
import { createRouter, createWebHistory } from "vue-router";

export const HOME_ROUTE = "home";
export const SIGNUP_ROUTE = "signup";
export const LOGIN_ROUTE = "login";
export const CREATE_ROUTE = "create";
export const CREDITS_ROUTE = "credits";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: HOME_ROUTE,
      component: HomeView,
    },
    {
      path: "/signup",
      name: SIGNUP_ROUTE,
      component: () => import("../views/SignupView.vue"),
    },
    {
      path: "/login",
      name: LOGIN_ROUTE,
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/create",
      name: CREATE_ROUTE,
      component: () => import("../views/CreateView.vue"),
    },
    {
      path: "/credits",
      name: CREDITS_ROUTE,
      component: () => import("../views/CreditsView.vue"),
    },
    {
      path: "/style",
      name: "style",
      component: () => import("../views/StyleView.vue"),
    },
  ],
});

export default router;
