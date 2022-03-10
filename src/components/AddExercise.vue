<script setup lang="ts">
import { Exercise } from "../models";
import { useRoutine } from "../stores/routine";
import ExerciseForm from "./ExerciseForm.vue";

const store = useRoutine();

const addShortBreak = () => {
  store.addExercise({ name: "Break", time: 15 });
};

const addExercise = (exercise: Exercise) => {
  store.addExercise(exercise);
};
</script>

<template>
  <ExerciseForm @save="addExercise" />

  <div class="grid">
    <button type="button" @click="addShortBreak">Add Break (15s)</button>
  </div>
</template>
