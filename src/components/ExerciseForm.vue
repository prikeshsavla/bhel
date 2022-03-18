<script setup lang="ts">
import { Exercise } from "../models";
defineProps({
  name: {
    type: String,
    default: "",
  },
  time: {
    type: Number,
    default: 15,
  },
});
const emit = defineEmits<{
  (e: "save", exercise: Exercise): void;
}>();

const addTimerFromForm = (event: any) => {
  const exercise: Exercise = {
    name: "",
    time: 0,
  };
  const formData = new FormData(event.target);
  exercise.name = formData.get("name") as string;
  exercise.time = parseInt(formData.get("time") as string);
  emit("save", exercise);
};
</script>

<template>
  <form @submit.prevent="addTimerFromForm">
    <label for="name">
      Name
      <input
        type="text"
        id="name"
        name="name"
        :value="name"
        placeholder="Exercise Name or Break"
        required
      />
    </label>
    <label for="time">
      Seconds

      <input
        type="number"
        id="time"
        name="time"
        :value="time"
        step="5"
        placeholder="time"
        required
      />
    </label>
    <button>Save Exercise</button>
  </form>
</template>
