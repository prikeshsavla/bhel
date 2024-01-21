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
noSleep.enable();

// Enable wake lock.
document.addEventListener(
  "touchstart",
  function enableNoSleep() {
    noSleep.enable();
  },
  false
);

document.addEventListener("visibilitychange", () =>  {
  if (document.hidden){
    noSleep.disable();
  } else {
      noSleep.enable();
  }
});


createApp(App).use(store).mount("#app");
