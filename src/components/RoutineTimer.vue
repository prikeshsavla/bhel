<script setup lang="ts">
import { useRoutine } from "../stores/routine";

const store = useRoutine();
</script>

<template>
  <div class="headings center">
    <h1>{{ store.activeTimeString }}</h1>
    <h2>{{ store.activeTimer.name }}</h2>
  </div>
</template>

<style scoped>
.center {
  text-align: center;
}
</style>
