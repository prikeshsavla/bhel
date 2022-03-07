<script setup lang="ts">
import { Exercise } from "../models";
import { useRoutine } from "../stores/routine";

const store = useRoutine();
const emit = defineEmits<{
  (e: "startSingleTimerWithMusic", timer: Exercise): void;
}>();

const startSingleTimerWithMusic = (timer: Exercise) => {
  emit("startSingleTimerWithMusic", timer);
};
</script>

<template>
  <details v-if="store.activeRoutine.exercises.length">
    <summary>Exercises ({{ store.activeRoutine.exercises.length }})</summary>
    <br />
    <div
      v-for="(timer, index) in store.activeRoutine.exercises"
      :key="timer.name"
    >
      <button
        class="exercise contrast"
        @click="startSingleTimerWithMusic(timer)"
      >
        <small>{{ timer.name }} {{ timer.time }}s</small>
      </button>
      <button
        class="remove-exercise secondary"
        @click="store.removeFromRoutine(index)"
      >
        &times;
      </button>
    </div>
  </details>
</template>

<style scoped>
.exercise {
  width: 80%;
  margin-right: 5px;
  display: inline-block;
}
.remove-exercise {
  width: calc(15% - 5px);
  display: inline-block;
}
</style>
