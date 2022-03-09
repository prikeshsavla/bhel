import { createApp } from "vue";
import App from "./App.vue";
import NoSleep from "nosleep.js";
import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";
const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

const noSleep = new NoSleep();
const store = createPinia();
// Enable wake lock.
// (must be wrapped in a user input event handler e.g. a mouse or touch handler)
document.addEventListener(
  "click",
  function enableNoSleep() {
    document.removeEventListener("click", enableNoSleep, false);
    noSleep.enable();
  },
  false
);
document.addEventListener(
  "touchstart",
  function enableNoSleep() {
    document.removeEventListener("touchstart", enableNoSleep, false);
    noSleep.enable();
  },
  false
);

createApp(App).use(store).mount("#app");
