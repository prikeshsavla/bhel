<script setup lang="ts">
import { ref } from "vue-demi";
import { toggleModal } from "../modules/modal";
import { useRoutine } from "../stores/routine";
const store = useRoutine();
let name = ref("");
let routineIndex = ref(-1);
const saveRoutine = (event: any) => {
  store.saveCustomRoutine(name.value, routineIndex.value);
  toggleModal(event);
};
</script>
<template>
  <dialog id="save-routine">
    <article>
      <a
        href="#close"
        aria-label="Close"
        class="close"
        data-target="save-routine"
        @click="toggleModal"
      >
      </a>
      <h3>Save Routine</h3>
      <fieldset>
        <label
          v-for="(routine, index) in store.customRoutines"
          :key="routine.name + index"
          :for="routine.name + index"
        >
          <input
            type="radio"
            :id="routine.name + index"
            name="routine"
            :value="index"
            v-model="routineIndex"
          />
          {{ routine.name }}
        </label>
        <label for="new-routine">
          <input
            type="radio"
            id="new-routine"
            name="routine"
            :value="-1"
            v-model="routineIndex"
          />
          🆕 Save Routine As
          <input type="text" placeholder="New Routine" v-model="name" />
        </label>
      </fieldset>
      <footer>
        <a
          href="#cancel"
          role="button"
          class="secondary"
          data-target="save-routine"
          @click="toggleModal"
        >
          Cancel
        </a>
        <a
          href="#confirm"
          role="button"
          data-target="save-routine"
          @click="saveRoutine"
        >
          ☑ Save / ✍ Overwrite
        </a>
      </footer>
    </article>
  </dialog>
</template>
