import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import GoogleSignInPlugin from "vue3-google-signin";

import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";
import { definePreset } from "@primevue/themes";
import { useAppStore } from "./stores/appStore";

import ConfirmationService from "primevue/confirmationservice";
import { useAuthStore } from "./stores/authStore";
import formatDate from "./directives/formatDate";

const app = createApp(App);
const pinia = createPinia();

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{emerald.50}",
      100: "{emerald.100}",
      200: "{emerald.200}",
      300: "{emerald.300}",
      400: "{emerald.400}",
      500: "{emerald.500}",
      600: "{emerald.600}",
      700: "{emerald.700}",
      800: "{emerald.800}",
      900: "{emerald.900}",
      950: "{emerald.950}",
    },
  },
});

app.use(pinia);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
  },
});
app.use(ToastService);
app.use(GoogleSignInPlugin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});
app.use(ConfirmationService); //confirm dialog

// Register the directive globally
app.directive("format-date", formatDate);

const authStore = useAuthStore();
authStore.initialize(); //initialize user if exists
//	Initialize data
const appStore = useAppStore();
appStore.initializeApp().then(() => {
  app.mount("#app");
});

// Stop SignalR connections when the user leaves the application or navigates to another website
window.addEventListener("beforeunload", () => {
  const authStore = useAuthStore();
  authStore.stopSignalRConnection();
});
