<script setup lang="ts">
import { useRoutine } from "../stores/routine";

const store = useRoutine();
</script>

<template>
  
    <form @submit.prevent="store.addTimerFromForm">
      <label for="name">
        Name
        <input
          type="text"
          id="name"
          name="name"
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
          value="15"
          step="5"
          placeholder="time"
          required
        />
      </label>
      <button>Add Timer</button>
    </form>

    <div class="grid">
      <button type="button" @click="store.addTimer('Break', 15)">
        Add Break (15s)
      </button>
    </div>
</template>
