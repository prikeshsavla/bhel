<script setup lang="ts">
import { closeModal, toggleModal } from "../modules/modal";
import { useRoutine } from "../stores/routine";
import ExerciseForm from "./ExerciseForm.vue";
import { Exercise } from "../models/index";
import { ref, watch } from "vue-demi";
const store = useRoutine();
const modalId = "save-exercise";
let name = ref("");
let time = ref(15);
const saveExercise = (exercise: Exercise) => {
  store.activeRoutine.exercises[store.editExerciseIndex] = exercise;
  store.setRoutine(store.activeRoutine);
  closeModal(document.getElementById(modalId));
};

const deleteExercise = () => {
  store.removeFromRoutine(store.editExerciseIndex);
  store.setRoutine(store.activeRoutine);
  closeModal(document.getElementById(modalId));
};

watch(
  () => store.editExerciseIndex,
  (newValue: number) => {
    const exercise = store.activeRoutine.exercises[newValue];
    name.value = exercise.name;
    time.value = exercise.time;
  }
);
</script>
<template>
  <dialog :id="modalId">
    <article>
      <h5>
        Edit Exercise
        <a
          href="#close"
          aria-label="Close"
          class="close"
          data-target="save-exercise"
          @click="toggleModal"
        >
        </a>
      </h5>
      <ExerciseForm :name="name" :time="time" @save="saveExercise" />
      <button
        data-target="save-exercise"
        @click="deleteExercise"
        class="secondary"
      >
        Delete
      </button>
    </article>
  </dialog>
</template>
