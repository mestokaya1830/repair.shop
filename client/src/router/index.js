import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "../layouts/DefaultLayout.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      component: DefaultLayout,

      children: [
        {
          path: "",
          name: "home",
          component: () => import("../views/Home.vue"),
        },

        {
          path: "repair",
          name: "repair",
          component: () => import("../views/Repair.vue"),
        },

        {
          path: "repair-review",
          name: "repair-review",
          component: () => import("../views/RepairReview.vue"),
        },

        {
          path: "track",
          name: "track",
          component: () => import("../views/TrackRepair.vue"),
        },

        {
          path: "contact",
          name: "contact",
          component: () => import("../views/Contact.vue"),
        },
      ],
    },
  ],
});

export default router;
