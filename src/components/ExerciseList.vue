<script setup lang="ts">
import { Exercise } from "../models";
import { useRoutine } from "../stores/routine";
import { toggleModal } from "../modules/modal";

const store = useRoutine();
const emit = defineEmits<{
  (e: "startSingleTimer", timer: Exercise): void;
}>();

const startSingleTimer = (timer: Exercise) => {
  emit("startSingleTimer", timer);
};
</script>

<template>
  <details v-if="store.activeRoutine.exercises.length">
    <summary>Exercises ({{ store.activeRoutine.exercises.length }})</summary>
    <br />
    <div
      v-for="(timer, index) in store.activeRoutine.exercises"
      :key="timer.name"
    >
      <div class="move-wrapper">
        <button
          title="Move Up"
          class="up secondary"
          :disabled="store.activeTimer.time > 0 || index == 0"
          @click="store.moveExerciseUp(index)"
        ></button>
        <button
          title="Move Up"
          class="down secondary"
          :disabled="
            store.activeTimer.time > 0 ||
            index == store.activeRoutine.exercises.length - 1
          "
          @click="store.moveExerciseDown(index)"
        ></button>
      </div>
      <button
        class="removable-row-action-button contrast"
        @click="startSingleTimer(timer)"
      >
        <small>{{ timer.name }} {{ timer.time }}s</small>
      </button>

      <button
        class="removable-row-remove-button secondary"
        :disabled="store.activeTimer.time > 0"
        @click="store.removeFromRoutine(index)"
      >
        &times;
      </button>
    </div>
    <button class="contrast" data-target="save-routine" @click="toggleModal">
      🗃 Save Routine...
    </button>
  </details>
</template>

<style scoped lang="scss">
.removable-row-action-button {
  width: 64%;
  margin-right: 5px;
  text-align: center;
  padding-left: 0;
  padding-right: 0;
  display: inline-block;
}
.removable-row-remove-button {
  width: calc(15% - 5px);
  display: inline-block;
}
.move-wrapper {
  display: inline-block;
  vertical-align: middle;
  padding: 0 10px;

  .up,
  .down {
    position: relative; /* added */
    width: 25px;
    height: 22px;
    cursor: pointer;
    margin: 0;
    padding: 10px 19px;
  }

  .down {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .up:before {
    content: "";
    /* added */
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    /* end added */
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 5px 7px 5px;
    border-color: transparent transparent #fff transparent;
  }
  .down:before {
    content: "";
    /* added */
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    /* end added */
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 5px 0 5px;
    border-color: #fff transparent transparent transparent;
  }
}
</style>
