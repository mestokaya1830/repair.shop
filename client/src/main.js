import { createApp } from 'vue'
import App from "./App.vue";
import store from './stores/Index.js'
import "./styles/main.css";
import router from "./router/Index.js";

createApp(App).use(router).use(store).mount("#app");