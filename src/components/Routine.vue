<script setup lang="ts">
import { onMounted } from "vue";
import RoutineTimer from "./RoutineTimer.vue";
let audioElement: any;

onMounted(() => {
  audioElement = document.getElementById("exercise-audio");
});
const changeVolume = (volume: number) => {
  audioElement.volume = volume;
};
const musicPlayer = (command: String) => {
  switch (command) {
    case "load":
      audioElement.load();
      break;
    case "play":
      audioElement.play();
      break;
    case "pause":
      audioElement.pause();
      break;
  }
};
</script>

<template>
  <section>
    <RoutineTimer @music="musicPlayer" @changeVolume="changeVolume" />
    <audio id="exercise-audio" loop>
      <source
        src="/assets/music/mixkit-rising-forest-471.mp3"
        type="audio/mpeg"
      />
      Your browser does not support the audio element.
    </audio>
  </section>
</template>
