<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Routine from "./components/Routine.vue";
import ExerciseForm from "./components/ExerciseForm.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <section>
    <div class="headings" style="text-align: center">
      <h1>Bhel</h1>
      <h4>Your Light Exercise Timer 💪</h4>
    </div>
    <section>
      <div class="grid" v-cloak>
        <article>
          <Routine />
        </article>
        <article>
          <ExerciseForm />
        </article>
      </div>
    </section>
    <Footer />
  </section>
</template>
