<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Routine from "./components/Routine.vue";
import Footer from "./components/Footer.vue";
import SaveRoutineModal from "./components/SaveRoutineModal.vue";
import SaveExerciseModal from "./components/SaveExerciseModal.vue";
</script>

<template>
  <section>
    <SaveRoutineModal />
    <SaveExerciseModal />
    <div class="headings" style="text-align: center">
      <h1>Bhel</h1>
      <p>Your Light Exercise Timer 💪</p>
    </div>
    <section>
      <article>
        <Routine />
      </article>
    </section>
    <Footer />
  </section>
</template>
