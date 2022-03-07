<script setup lang="ts">
import { useRoutine } from "../stores/routine";

const store = useRoutine();
</script>

<template>
  <details>
    <summary>Routines</summary>
    <br />
    <button
      v-for="(routine, index) in store.routines"
      :key="index + routine.name"
      class="secondary"
      type="button"
      @click="store.setRoutine(routine)"
    >
      {{ routine.name }}
    </button>
  </details>
  <details>
    <summary>Stats</summary>
    <br />
    <small>Overall Time Spent: {{ store.readableTotalTimeSpent }}</small>
  </details>
</template>
