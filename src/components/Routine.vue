<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { Exercise } from "../models";
import { useRoutine } from "../stores/routine";

import ExerciseList from "./ExerciseList.vue";

import RoutineList from "./RoutineList.vue";
import RoutineTimer from "./RoutineTimer.vue";
interface State {
  timeouts: any[];
  music: any;
}

const store = useRoutine();
const gap = 2;
let singleSecondInterval: any;
let state: State = reactive({
  timeouts: [],
  music: false,
});
let audioElement: any;

onMounted(() => {
  audioElement = document.getElementById("exercise-audio");
});

const startTimer = (exercise: Exercise) => {
  speak(exercise.name + " " + `${exercise.time} seconds`, 1);
  clearInterval(singleSecondInterval);
  store.setActiveTimer(exercise);
  let duration = exercise.time;
  singleSecondInterval = setInterval(() => {
    store.incrementTotalTime();
    store.setActiveTimer({ name: store.activeTimer.name, time: duration });
    if (duration > 0 && duration < 6) {
      speak(String(duration), 2);
    }
    if (--duration < 0) {
      speak("And Done", 2);
      clearInterval(singleSecondInterval);
    }
  }, 1000);
};

const speak = (text: string, rate: number) => {
  let msg = new SpeechSynthesisUtterance();
  msg.lang = navigator.language;

  changeVolume(0.1);
  msg.rate = rate;
  msg.text = text;
  window.speechSynthesis.speak(msg);
  setTimeout(() => {
    changeVolume(0.4);
  }, 1000);
};
const clearTimeouts = () => {
  state.timeouts.forEach((timeout) => clearTimeout(timeout));
  state.timeouts = [];
};

const toggleMusic = () => {
  state.music = !state.music;
  if (state.music && store.activeTimer.time > 0) {
    musicPlayer("play");
  } else {
    musicPlayer("pause");
  }
};
const startSingleTimerWithMusic = (timer: Exercise) => {
  musicPlayer("load");
  musicPlayer("play");
  startTimer({ ...timer });
  fadeOutAudio(timer.time);
};
const startRoutine = () => {
  var lastTimeout = 0;
  store.activeRoutine.exercises.forEach((timer) => {
    state.timeouts.push(
      setTimeout(() => startTimer({ ...timer }), lastTimeout * 1000)
    );
    lastTimeout += timer.time + gap;
  });
  fadeOutAudio(lastTimeout);
  musicPlayer("play");
};
const stop = () => {
  clearInterval(singleSecondInterval);
  store.setActiveTimer({
    time: 0,
    name: "Tap Start to Exercise",
  });
  musicPlayer("pause");
  window.speechSynthesis.cancel();
  clearTimeouts();
};

const fadeOutAudio = (lastTimeout: number) => {
  state.timeouts.push(setTimeout(() => changeVolume(0.4), lastTimeout * 1000));
  state.timeouts.push(
    setTimeout(() => changeVolume(0.2), (lastTimeout + gap / 2) * 1000)
  );
  state.timeouts.push(
    setTimeout(() => {
      musicPlayer("pause");
      clearTimeouts();
    }, (lastTimeout + gap) * 1000)
  );
};

const changeVolume = (volume: number) => {
  audioElement.volume = volume;
};
const musicPlayer = (command: String) => {
  if (command === "pause" || state.music) {
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
};
</script>

<template>
  <section>
    <RoutineTimer />
    <fieldset>
      🎵 Music: Off
      <input
        type="checkbox"
        @change="toggleMusic"
        id="switch"
        :checked="state.music"
        name="switch"
        role="switch"
      />On
    </fieldset>
  </section>
  <audio id="exercise-audio" loop>
    <source
      src="/assets/music/mixkit-rising-forest-471.mp3"
      type="audio/mpeg"
    />
    Your browser does not support the audio element.
  </audio>

  <footer>
    <button @click="startRoutine" v-if="state.timeouts.length === 0">
      Start {{ store.activeRoutine.name }} (💪 {{ store.totalRoutineTime }})
    </button>
    <button class="secondary" @click="stop" v-else>Stop</button>
    <ExerciseList @start-single-timer-with-music="startSingleTimerWithMusic" />
    <RoutineList />
  </footer>
</template>
