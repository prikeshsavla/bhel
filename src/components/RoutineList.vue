<script setup lang="ts">
import { useRoutine } from "../stores/routine";

const store = useRoutine();
</script>

<template>
  <details :open="store.activeRoutine.exercises.length == 0">
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
    <div
      v-for="(routine, index) in store.customRoutines"
      :key="index + routine.name"
    >
      <button
        class="removable-row-action-button contrast"
        @click="store.setRoutine(routine)"
      >
        <small> {{ routine.name }}</small>
      </button>

      <button
        class="removable-row-remove-button secondary"
        @click="store.removeFromCustomRoutines(index)"
      >
        &times;
      </button>
    </div>
  </details>

  <details>
    <summary>Stats</summary>
    <br />
    <small>Overall Time Spent: {{ store.readableTotalTimeSpent }}</small>
  </details>
</template>

<style scoped>
.removable-row-action-button {
  width: 80%;
  margin-right: 5px;
  text-align: center;
  padding-left: 0;
  padding-right: 0;
  display: inline-block;
}
.removable-row-remove-button {
  width: calc(20% - 5px);
  display: inline-block;
}
</style>
