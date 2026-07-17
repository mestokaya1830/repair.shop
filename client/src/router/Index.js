import {createRouter, createWebHistory} from 'vue-router'
import WebLayout from '@/layouts/WebLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'


const router =  createRouter({
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
   }
  ]
})

export default router