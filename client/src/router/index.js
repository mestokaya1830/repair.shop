import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "../layouts/DefaultLayout.vue";
import AdminLayout from "../layouts/AdminLayout.vue";

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
          component: () => import("../views/CustomerRepair.vue"),
        },

        {
          path: "repair-review",
          name: "repair-review",
          component: () => import("../views/CustomerRepairReview.vue"),
        },

        {
          path: "track",
          name: "track",
          component: () => import("../views/CustomerTrackRepair.vue"),
        },

        {
          path: "contact",
          name: "contact",
          component: () => import("../views/Contact.vue"),
        },
      ],
    },
    {
      path: "/admin/login",
      name: "admin-login",
      component: () => import("@/views/admin/AdminLogin.vue"),
    },

    {
      path: "/admin",
      component: AdminLayout,

      children: [
        {
          path: "/admin",
          redirect: "dashboard",
        },

        {
          path: "dashboard",
          component: () => import("@/views/admin/Dashboard.vue"),
        },

        {
          path: "repairs",
          component: () => import("@/views/admin/Repairs.vue"),
        },

        {
          path: "repair/:id",
          component: () => import("@/views/admin/RepairDetail.vue"),
        },

        {
          path: "customers",
          component: () => import("@/views/admin/Customers.vue"),
        },

        {
          path: "customer/:id",
          component: () => import("@/views/admin/CustomerDetail.vue"),
        },

        {
          path: "users",
          component: () => import("@/views/admin/users/Index.vue"),
        },
        {
          path: "users/:id/edit",
          component: () => import("@/views/admin/users/Edit.vue"),
        },
        {
          path: "users/:id/detail",
          component: () => import("@/views/admin/users/Detail.vue"),
        },

        {
          path: "users/create",
          component: () => import("@/views/admin/users/Create.vue"),
        },

        {
          path: "settings",
          component: () => import("@/views/admin/Settings.vue"),
        },
      ],
    },
  ],
});

export default router;
