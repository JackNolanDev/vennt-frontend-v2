import { useCampaignStore } from "@/stores/campaign";
import HomeView from "@/views/HomeView.vue";
import { createRouter, createWebHistory } from "vue-router";

export const HOME_ROUTE = "home";
export const SIGNUP_ROUTE = "signup";
export const LOGIN_ROUTE = "login";
export const CREATE_ROUTE = "create";
export const CREATE_NEW_ROUTE = "createNew";
export const CREATE_UPLOAD_ROUTE = "createUpload";
export const CREATE_COG_ROUTE = "createCog";
export const CREATE_NEW_COG_ROUTE = "createNewCog";
export const CREDITS_ROUTE = "credits";
export const ADMIN_ROUTE = "admin";
export const ENTITY_ROUTE = "entity";
export const ENTITY_ABILITIES_ROUTE = "entityAbilities";
export const ENTITY_COMBAT_ROUTE = "entityCombat";
export const ENTITY_DESCRIPTION_ROUTE = "entityDescription";
export const ENTITY_ITEM_SHOP_ROUTE = "entityItemShop";
export const ENTITY_ITEMS_ROUTE = "entityItems";
export const ENTITY_STATS_ROUTE = "entityStats";
export const ENTITY_NOTES_ROUTE = "entityNotes";
export const ENTITY_CAMPAIGN_CHAT_ROUTE = "entityCampaignChat";
export const ENTITY_WEAPON_SHOP_ROUTE = "entityWeaponShop";
export const ENTITY_SETTINGS_ROUTE = "entitySettings";
export const WIKI_ROUTE = "wiki";
export const WIKI_PATHS_ROUTE = "wikiPaths";
export const WIKI_PATHS_SPECIFIC_ROUTE = "wikiPathsSpecific";
export const CAMPAIGN_ROUTE = "campaign";
export const CAMPAIGN_SETTINGS_ROUTE = "campaignSettings";
export const CAMPAIGN_CREATE_ROUTE = "campaignCreate";
export const CAMPAIGN_TEST_ROUTE = "campaignTest";
export const INVITE_ROUTE = "invite";

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
      meta: { loggedInOnly: true },
      component: () => import("../views/CreateView.vue"),
    },
    {
      path: "/create/new",
      name: CREATE_NEW_ROUTE,
      meta: { loggedInOnly: true },
      component: () => import("../views/CreateNewView.vue"),
    },
    {
      path: "/create/upload",
      name: CREATE_UPLOAD_ROUTE,
      meta: { loggedInOnly: true },
      component: () => import("../views/CreateNewUploadView.vue"),
    },
    {
      path: "/create/cog",
      name: CREATE_COG_ROUTE,
      meta: { loggedInOnly: true },
      component: () => import("../views/CreateCogView.vue"),
    },
    {
      path: "/create/cog/new",
      name: CREATE_NEW_COG_ROUTE,
      meta: { loggedInOnly: true },
      component: () => import("../views/CreateNewCogView.vue"),
    },
    {
      path: "/entity/:id",
      component: () => import("../views/EntityView.vue"),
      meta: { ws: true },
      children: [
        {
          path: "",
          name: ENTITY_ROUTE,
          meta: { replaceName: ENTITY_DESCRIPTION_ROUTE },
          component: () => import("../views/EntityDescriptionView.vue"),
        },
        {
          path: "flux/:detail?",
          name: ENTITY_DESCRIPTION_ROUTE,
          component: () => import("../views/EntityDescriptionView.vue"),
        },
        {
          path: "abilities/:detail?",
          name: ENTITY_ABILITIES_ROUTE,
          component: () => import("../views/EntityAbilitiesView.vue"),
        },
        {
          path: "combat/:detail?",
          name: ENTITY_COMBAT_ROUTE,
          component: () => import("../views/EntityCombatView.vue"),
        },
        {
          path: "shop/:detail?",
          name: ENTITY_ITEM_SHOP_ROUTE,
          component: () => import("../views/EntityItemShopView.vue"),
        },
        {
          path: "items/:detail?",
          name: ENTITY_ITEMS_ROUTE,
          component: () => import("../views/EntityItemsView.vue"),
        },
        {
          path: "stats",
          name: ENTITY_STATS_ROUTE,
          component: () => import("../views/EntityMobileStatsView.vue"),
        },
        {
          path: "notes",
          name: ENTITY_NOTES_ROUTE,
          component: () => import("../views/EntityNotesView.vue"),
        },
        {
          path: "chat",
          name: ENTITY_CAMPAIGN_CHAT_ROUTE,
          component: () => import("../views/EntityCampaignChatView.vue"),
        },
        {
          path: "weaponry/:detail?",
          name: ENTITY_WEAPON_SHOP_ROUTE,
          component: () => import("../views/EntityWeaponShopView.vue"),
        },
        {
          path: "settings",
          name: ENTITY_SETTINGS_ROUTE,
          component: () => import("../views/EntitySettingsView.vue"),
        },
      ],
    },
    {
      path: "/wiki",
      name: WIKI_ROUTE,
      component: () => import("../views/WikiView.vue"),
    },
    {
      path: "/wiki/paths",
      component: () => import("../views/WikiPathsContainerView.vue"),
      meta: { ws: true },
      children: [
        {
          path: "",
          name: WIKI_PATHS_ROUTE,
          component: () => import("../views/WikiPathsView.vue"),
        },
        {
          path: ":path",
          name: WIKI_PATHS_SPECIFIC_ROUTE,
          component: () => import("../views/WikiPathsSpecificView.vue"),
        },
      ],
    },
    {
      path: "/campaign/create",
      name: CAMPAIGN_CREATE_ROUTE,
      meta: { loggedInOnly: true },
      component: () => import("../views/CampaignCreateView.vue"),
    },
    {
      path: "/campaign/test",
      name: CAMPAIGN_TEST_ROUTE,
      meta: { loggedInOnly: true },
      component: () => import("../views/CampaignTestView.vue"),
    },
    {
      path: "/campaign/:campaignId",
      name: CAMPAIGN_ROUTE,
      meta: { loggedInOnly: true, ws: true },
      component: () => import("../views/CampaignView.vue"),
    },
    {
      path: "/campaign/:campaignId/settings",
      name: CAMPAIGN_SETTINGS_ROUTE,
      meta: { loggedInOnly: true, ws: true },
      component: () => import("../views/CampaignSettingsView.vue"),
    },
    {
      path: "/invite/:hash",
      name: INVITE_ROUTE,
      meta: { loggedInOnly: true },
      component: () => import("../views/InviteLinkView.vue"),
    },
    {
      path: "/credits",
      name: CREDITS_ROUTE,
      component: () => import("../views/CreditsView.vue"),
    },
    {
      path: "/admin",
      name: ADMIN_ROUTE,
      meta: { loggedInOnly: true },
      component: () => import("../views/AdminView.vue"),
    },
    {
      path: "/style",
      name: "style",
      component: () => import("../views/StyleView.vue"),
    },
    {
      path: "/:pathMatch(.*)",
      name: "notFound",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (from.meta.ws && !to.meta.ws) {
      useCampaignStore().disconnectWebsocket();
    }
    if (savedPosition) {
      return savedPosition; // default behavior when using forward & backward buttons
    }
    if (to.hash) {
      setTimeout(() => {
        const elId = to.hash.substring(1);
        const el = document.getElementById(elId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
    }
  },
});

export default router;
