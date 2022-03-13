<script setup lang="ts">
import { Exercise, WorkoutTypes } from "../models";
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
    workout: WorkoutTypes.WORKOUT,
  };
  const formData = new FormData(event.target);
  exercise.name = formData.get("name") as string;
  exercise.time = parseInt(formData.get("time") as string);
  exercise.workout = formData.get("workout") as WorkoutTypes;
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
    <fieldset>
      <legend>Size</legend>
      <label :for="WorkoutTypes.WORKOUT">
        <input
          type="radio"
          :id="WorkoutTypes.WORKOUT"
          name="workout"
          :value="WorkoutTypes.WORKOUT"
          checked
        />
        {{ WorkoutTypes.WORKOUT }}
      </label>
      <label :for="WorkoutTypes.STRETCH">
        <input
          type="radio"
          :id="WorkoutTypes.STRETCH"
          name="workout"
          :value="WorkoutTypes.STRETCH"
        />
        {{ WorkoutTypes.STRETCH }}
      </label>
      <label :for="WorkoutTypes.COOLDOWN">
        <input
          type="radio"
          :id="WorkoutTypes.COOLDOWN"
          name="workout"
          :value="WorkoutTypes.COOLDOWN"
        />
        {{ WorkoutTypes.COOLDOWN }}
      </label>
    </fieldset>
    <button>Save Exercise</button>
  </form>
</template>
