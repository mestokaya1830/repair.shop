import { createRouter, createWebHistory } from "vue-router";

import PublicLayout from "../layouts/PublicLayout.vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import TechnicianLayout from '../layouts/TechnicianLayout.vue'


const router = createRouter({
  history: createWebHistory(),

  routes: [
    //public
    {
      path: "/",
      component: PublicLayout,

      children: [
        {
          path: "",
          name: "home",
          component: () => import("../views/Home.vue"),
        },

        {
          path: "repair",
          name: "repair",
          component: () => import("../views/RepairPublic.vue"),
        },

        {
          path: "repair-review",
          name: "repair-review",
          component: () => import("../views/RepairPublicReview.vue"),
        },

        {
          path: "track",
          name: "track",
          component: () => import("../views/RepairTrack.vue"),
        },

        {
          path: "contact",
          name: "contact",
          component: () => import("../views/Contact.vue"),
        },
      ],
    },

    //login
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login.vue"),
    },

    //admin
    {
      path: "/admin",
      component: AdminLayout,

      children: [
        {
          path: "",
          component: () => import("@/views/admin/Index.vue"),
        },

        //user
        {
          path: "users",
          children: [
            {
              path: "",
              component: () => import("@/views/admin/users/Index.vue"),
            },
            {
              path: "profile",
              component: () => import("@/views/admin/users/Profile.vue"),
            },
            {
              path: "create",
              component: () => import("@/views/admin/users/Create.vue"),
            },
            {
              path: ":id/edit",
              component: () => import("@/views/admin/users/Edit.vue"),
            },
            {
              path: ":id/details",
              component: () => import("@/views/admin/users/Details.vue"),
            },
          ],
        },

        //customer
        {
          path: "customers",
          children: [
            {
              path: "",
              component: () => import("@/views/admin/customers/Index.vue"),
            },
            {
              path: "create",
              component: () => import("@/views/admin/customers/Create.vue"),
            },
            {
              path: ":id/edit",
              component: () => import("@/views/admin/customers/Edit.vue"),
            },
            {
              path: ":id/details",
              component: () => import("@/views/admin/customers/Details.vue"),
            },
          ],
        },
        //devices
        {
          path: "devices",
          children: [
            {
              path: "",
              component: () => import("@/views/admin/devices/Index.vue"),
            },
            {
              path: "create",
              component: () => import("@/views/admin/devices/Create.vue"),
            },
            {
              path: ":id/edit",
              component: () => import("@/views/admin/devices/Edit.vue"),
            },
            {
              path: ":id/details",
              component: () => import("@/views/admin/devices/Details.vue"),
            },
          ],
        },
        //repair admin site
        {
          path: "repairs",
          children: [
            {
              path: "",
              component: () => import("@/views/admin/repairs/Index.vue"),
            },
            {
              path: "create",
              component: () => import("@/views/admin/repairs/Create.vue"),
            },
            {
              path: ":id/edit",
              component: () => import("@/views/admin/repairs/Edit.vue"),
            },
            {
              path: ":id/details",
              component: () => import("@/views/admin/repairs/Details.vue"),
            },
          ],
        },
        {
          path: "settings",
          component: () => import("@/views/admin/Settings.vue"),
        },
      ],
    },

    //technician
    {
      path: "/technician",
      component: TechnicianLayout,

      children: [
        {
          path: "",
          name: "technician",
          component: () => import("@/views/technician/Index.vue"),
        },
        {
          path: "repairs",
          name: "technician-repairs",
          component: () => import("@/views/technician/Repairs.vue"),
        },

        {
          path: "repairs/:id",
          name: "technician-repair-details",
          component: () => import("@/views/technician/Details.vue"),
        },

        {
          path: "profile",
          name: "technician-profile",
          component: () => import("@/views/technician/Profile.vue"),
        },
      ],
    },
  ],
});

export default router;
