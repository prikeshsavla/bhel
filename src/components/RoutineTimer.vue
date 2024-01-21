<script setup lang="ts">
import { durationString, useRoutine } from "../stores/routine";
import { Exercise } from "../models/index";
import { computed, ref, watch } from "vue-demi";
import { CountDown } from "../modules/countdown";

const store = useRoutine();
let duration = ref(0);
let countdown = new CountDown(0, ()=>{});

watch(
  () => store.activeTimer,
  (exercise: Exercise) => {
    countdown.stop();
    if (exercise.time == 0) {
      return;
    }
    speak(exercise.name + " " + `${exercise.time} seconds`, 1);
    countdown = new CountDown(exercise.time, (secondsLeft: number, event: String) => {
      duration.value = secondsLeft;
      store.incrementTotalTime();
      if (secondsLeft > 0 && secondsLeft < 6) {
        speak(String(secondsLeft), 2);
      }
      if (secondsLeft == 0 && event != 'stop') {
        speak("And Done", 2);
      }
    })
    countdown.start();
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
