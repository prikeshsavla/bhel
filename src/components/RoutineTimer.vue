<script setup lang="ts">
import { durationString, useRoutine } from "../stores/routine";
import { Exercise } from "../models/index";
import { computed, ref, watch } from "vue-demi";

const store = useRoutine();
let singleSecondInterval: any;
let duration = ref(0);

watch(
  () => store.activeTimer,
  (exercise: Exercise) => {
    clearInterval(singleSecondInterval);
    duration.value = exercise.time;
    if (exercise.time == 0) {
      return;
    }
    speak(exercise.name + " " + `${exercise.time} seconds`, 1);
    singleSecondInterval = setInterval(() => {
      store.incrementTotalTime();
      --duration.value;
      if (duration.value > 0 && duration.value < 6) {
        speak(String(duration.value), 2);
      }
      if (duration.value == 0) {
        speak("And Done", 2);
        clearInterval(singleSecondInterval);
      }
    }, 1000);
  }
);

const speak = (text: string, rate: number) => {
  let msg = new SpeechSynthesisUtterance();
  msg.lang = navigator.language;
  store.playerVolume = 0.1;
  msg.rate = rate;
  msg.text = text;
  window.speechSynthesis.speak(msg);
  setTimeout(() => {
    store.playerVolume = 0.4;
  }, 1000);
};

const countdownTimer = computed(() => durationString(duration.value));
</script>

<template>
  <div class="headings center">
    <h1>{{ countdownTimer }}</h1>
    <h2>{{ store.activeTimer.name }}</h2>
  </div>
</template>

<style scoped>
.center {
  text-align: center;
}
</style>
