import { createApp } from "vue";
import { createPinia } from "pinia";
import { Capacitor } from "@capacitor/core";
import router from "./router";
import App from "./App.vue";

// Use 10.0.2.2 for Android emulator (maps to host's 127.0.0.1)
const getServerUrl = () => {
  if (Capacitor.isNativePlatform()) {
    return "http://10.0.2.2:8000";
  }
  return "http://localhost:8000";
};

const SERVER_BASE_URL = getServerUrl();
const API_BASE_URL = SERVER_BASE_URL + "/api";

const app = createApp(App);
app.provide("serverBaseURL", SERVER_BASE_URL);
app.provide("apiBaseURL", API_BASE_URL);
app.use(createPinia());
app.use(router);
app.mount("#app");
