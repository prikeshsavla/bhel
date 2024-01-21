<script setup lang="ts">
import { reactive } from "vue";
import { Exercise } from "../models";
import { durationString,useRoutine } from "../stores/routine";
import ExerciseList from "./ExerciseList.vue";
import RoutineList from "./RoutineList.vue";
import RoutineTimer from "./RoutineTimer.vue";
import MusicPlayer from "./MusicPlayer.vue";
import AddExercise from "./AddExercise.vue";

interface State {
  timeouts: any[];
}

const store = useRoutine();
const gap = 2;
let state: State = reactive({
  timeouts: [],
});


const startTimer = (exercise: Exercise) => {
  store.activeTimer = exercise;
};

const clearTimeouts = () => {
  state.timeouts.forEach((timeout) => clearTimeout(timeout));
  state.timeouts = [];
};

const startSingleTimer = (timer: Exercise) => {
  stop();
  musicPlayer("load");
  musicPlayer("play");
  startTimer({ ...timer });
  fadeOutAudio(timer.time);
};
const startRoutine = () => {
  stop();
  var lastTimeout = 0;
  for (let i = 0; i < store.activeRoutine.sets; i++) {
    store.activeRoutine.exercises.forEach((timer) => {
      state.timeouts.push(
        setTimeout(() => startTimer({ ...timer }), lastTimeout * 1000)
      );
      lastTimeout += timer.time + gap;
    });
  }
  fadeOutAudio(lastTimeout);
  musicPlayer("play");
};
const stop = () => {
  store.activeTimer = {
    time: 0,
    name: "Tap Start to Exercise",
  };
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
  store.playerVolume = volume;
};

const musicPlayer = (command: string) => {
  if (command === "pause" || store.musicEnabled) {
    store.player = command;
  }
};
</script>

<template>
  <section>
    <RoutineTimer />
    <div>
      <MusicPlayer />
    </div>
  </section>
  <footer>
    <div>
      <label for="sets"
        >Routine Sets
        <select
          name="sets"
          id="sets"
          v-model="store.activeRoutine.sets"
          @change="store.setRoutine(store.activeRoutine)"
        >
          <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
        </select>
      </label>
    </div>

    <p class="center">{{ store.activeRoutine.name }}</p>

    <button
      @click="startRoutine"
      v-if="state.timeouts.length === 0"
      :disabled="store.activeRoutine.exercises.length === 0"
    >
      ▶ Start ({{ store.activeRoutine.name }} {{ durationString(store.totalRoutineTime) }})
    </button>
    <button class="secondary" @click="stop" v-else>
      Stop 
    </button>

    <ExerciseList @start-single-timer="startSingleTimer" />
    <RoutineList />
    <details>
      <summary>New Exercise / Break</summary>
      <article>
        <AddExercise />
      </article>
    </details>
  </footer>
</template>
