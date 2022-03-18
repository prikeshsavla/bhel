<script setup lang="ts">
import { onMounted, watch } from "vue-demi";
import { useRoutine } from "../stores/routine";

const store = useRoutine();
let audioElement: any;

onMounted(() => {
  audioElement = document.getElementById("exercise-audio");
});

watch(
  () => store.playerVolume,
  (volume) => {
    audioElement.volume = volume;
  }
);

watch(
  () => store.player,
  (command: string) => {
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
  }
);

const toggleMusic = () => {
  store.musicEnabled = !store.musicEnabled;
  if (store.musicEnabled && store.activeTimer.time > 0) {
    store.player = "play";
  } else {
    store.player = "pause";
  }
};
</script>
<template>
  <fieldset>
    <label for="switch"
      >🎵 Music: Off
      <input
        type="checkbox"
        @change="toggleMusic"
        id="switch"
        :checked="store.musicEnabled"
        name="switch"
        role="switch"
      />On</label
    >
  </fieldset>
  <audio id="exercise-audio" loop>
    <source
      src="/assets/music/mixkit-rising-forest-471.mp3"
      type="audio/mpeg"
    />
    Your browser does not support the audio element.
  </audio>
</template>
