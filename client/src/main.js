import { createApp } from "vue";
import { createPinia } from "pinia";
import "./styles/main.css";
import router from "./router/Index.js";
import App from "./App.vue";

createApp(App).use(router).use(createPinia()).mount("#app");