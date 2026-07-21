import { createRouter, createWebHistory } from "vue-router";
import WebLayout from "@/layouts/WebLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: WebLayout,
      children: [
        {
          path: "",
          name: "home",
          component: () => import("../views/web/Index.vue"),
        },

        {
          path: "device-sending",
          name: "device-sending",
          component: () => import("../views/web/DeviceSending.vue"),
        },

        {
          path: "device-tracking",
          name: "device-tracking",
          component: () => import("../views/web/DeviceTracking.vue"),
        },

        {
          path: "device-reviewing",
          name: "device-reviewing",
          component: () => import("../views/web/DeviceReviewing.vue"),
        },

        {
          path: "contact",
          name: "contact",
          component: () => import("../views/web/Contact.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/admin",
      component: AdminLayout,
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("../views/admin/Index.vue"),
        },
        {
          path: "settings",
          name: "settings",
          component: () => import("../views/admin/Settings.vue"),
        },
        {
          path: "profile",
          name: "profile",
          component: () => import("../views/admin/Profile.vue"),
        },
        {
          path: "customers",
          children: [
            {
              path: "",
              name: "customers-index",
              component: () => import("../views/admin/customers/Index.vue"),
            },

            {
              path: ":id/details",
              name: "customers-details",
              component: () => import("../views/admin/customers/Details.vue"),
            },

            {
              path: ":id/edit",
              name: "customers-edit",
              component: () => import("../views/admin/customers/Edit.vue"),
            },

            // Customer Devices

            {
              path: ":id/devices",
              name: "customers-devices",
              component: () =>
                import("../views/admin/customers/devices/Index.vue"),
            },

            {
              path: ":id/devices/:deviceId/details",
              name: "customers-device-details",
              component: () =>
                import("../views/admin/customers/devices/Details.vue"),
            },

            // Customer Repairs

            {
              path: ":id/repairs",
              name: "customers-repairs",
              component: () =>
                import("../views/admin/customers/repairs/Index.vue"),
            },

            {
              path: ":id/repairs/:repairId/details",
              name: "customers-repair-details",
              component: () =>
                import("../views/admin/customers/repairs/Details.vue"),
            },
          ],
        },
        {
          path: "devices",
          children: [
            {
              path: "",
              name: "devices-index",
              component: () => import("../views/admin/devices/Index.vue"),
            },
            {
              path: ":id/details",
              name: "devices-details",
              component: () => import("../views/admin/devices/Details.vue"),
            },
            {
              path: ":id/edit",
              name: "devices-edit",
              component: () => import("../views/admin/devices/Edit.vue"),
            },
          ],
        },
        {
          path: "repairs",
          children: [
            {
              path: "",
              name: "repairs-index",
              component: () => import("../views/admin/repairs/Index.vue"),
            },
            {
              path: ":id/details",
              name: "repairs-details",
              component: () => import("../views/admin/repairs/Details.vue"),
            },
            {
              path: ":id/edit",
              name: "repairs-edit",
              component: () => import("../views/admin/repairs/Edit.vue"),
            },
          ],
        },
        {
          path: "users",
          children: [
            {
              path: "",
              name: "users-index",
              component: () => import("../views/admin/users/Index.vue"),
            },
            {
              path: ":id/detail",
              name: "users-details",
              component: () => import("../views/admin/users/Details.vue"),
            },
            {
              path: ":id/edit",
              name: "users-edit",
              component: () => import("../views/admin/users/Edit.vue"),
            },
          ],
        },
      ],
    },
  ],
});

export default router;
