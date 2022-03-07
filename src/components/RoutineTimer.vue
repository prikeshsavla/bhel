<script setup lang="ts">
import { reactive } from "vue";
import { useRoutine } from "../stores/routine";

const emit = defineEmits<{
  (e: "music", value: string): void;
  (e: "changeVolume", value: number): void;
}>();

const store = useRoutine();
function durationString(timer: number) {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
}

interface Exercise {
  name: string;
  time: number;
}
interface Routine {
  name: string;
  exercises: Exercise[];
}

interface State {
  timeouts: any[];
  music: any;
}

const gap = 2;

let singleSecondInterval: any;
let state: State = reactive({
  timeouts: [],
  music: false,
});
const changeVolume = (volume: number) => {
  emit("changeVolume", volume);
};
const musicPlayer = (command: string) => {
  if (command === "pause" || state.music) {
    emit("music", command);
  }
};
const startTimer = (exercise: Exercise) => {
  speak(exercise.name + " " + `${exercise.time} seconds`, 1);
  clearInterval(singleSecondInterval);
  store.setActiveTimer(exercise);
  let duration = exercise.time;
  singleSecondInterval = setInterval(() => {
    store.incrementTotalTime();
    store.setActiveTimer({ name: store.activeTimer.name, time: duration });
    if (duration > 0 && duration < 6) {
      speak(String(duration), 2);
    }
    if (--duration < 0) {
      speak("And Done", 2);
      clearInterval(singleSecondInterval);
    }
  }, 1000);
};

const speak = (text: string, rate: number) => {
  let msg = new SpeechSynthesisUtterance();
  msg.lang = navigator.language;

  changeVolume(0.1);
  msg.rate = rate;
  msg.text = text;
  window.speechSynthesis.speak(msg);
  setTimeout(() => {
    changeVolume(0.4);
  }, 1000);
};
const clearTimeouts = () => {
  state.timeouts.forEach((timeout) => clearTimeout(timeout));
  state.timeouts = [];
};

const toggleMusic = () => {
  state.music = !state.music;
  if (state.music && store.activeTimer.time > 0) {
    musicPlayer("play");
  } else {
    musicPlayer("pause");
  }
};
const startSingleTimerWithMusic = (timer: Exercise) => {
  musicPlayer("load");
  musicPlayer("play");
  startTimer({ ...timer });
  fadeOutAudio(timer.time);
};
const startRoutine = () => {
  var lastTimeout = 0;
  store.activeRoutine.exercises.forEach((timer) => {
    state.timeouts.push(
      setTimeout(() => startTimer({ ...timer }), lastTimeout * 1000)
    );
    lastTimeout += timer.time + gap;
  });
  fadeOutAudio(lastTimeout);
  musicPlayer("play");
};
const stop = () => {
  clearInterval(singleSecondInterval);
  store.setActiveTimer({
    time: 0,
    name: "Tap Start to Exercise",
  });
  musicPlayer("pause");
  window.speechSynthesis.cancel();
  clearTimeouts();
};

const fadeOutAudio = (lastTimeout: number) => {
  state.timeouts.push(setTimeout(() => changeVolume(0.4), lastTimeout * 1000));
  state.timeouts.push(
    setTimeout(() => changeVolume(0.2), (lastTimeout + gap / 2) * 1000)
  );
  state.timeouts.push(
    setTimeout(() => {
      musicPlayer("pause");
      clearTimeouts();
    }, (lastTimeout + gap) * 1000)
  );
};
</script>

<template>
  <section>
    <div class="grid" v-cloak>
      <article>
        <div class="headings" style="text-align: center">
          <h1>{{ store.activeTimeString }}</h1>
          <h2>{{ store.activeTimer.name }}</h2>
        </div>
        <fieldset>
          🎵 Music: Off
          <input
            type="checkbox"
            @change="toggleMusic"
            id="switch"
            :checked="state.music"
            name="switch"
            role="switch"
          />On
        </fieldset>
        <footer>
          <button @click="startRoutine" v-if="state.timeouts.length === 0">
            Start Routine (💪 {{ store.totalRoutineTime }})
          </button>
          <button class="secondary" @click="stop" v-else>Stop</button>

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
          <details v-if="store.activeRoutine.exercises.length">
            <summary>
              Routine Exercises ({{ store.activeRoutine.exercises.length }})
            </summary>
            <br />
            <div
              v-for="(timer, index) in store.activeRoutine.exercises"
              :key="timer.name"
            >
              <button
                class="exercise contrast"
                @click="startSingleTimerWithMusic(timer)"
              >
                <small>{{ timer.name }} {{ timer.time }}s</small>
              </button>
              <button
                class="remove-exercise secondary"
                @click="store.removeFromRoutine(index)"
              >
                &times;
              </button>
            </div>
          </details>
          <details>
            <summary>Stats</summary>
            <br />
            <small
              >Overall Time Spent: {{ store.readableTotalTimeSpent }}</small
            >
          </details>
        </footer>
      </article>
      <article>
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
      </article>
    </div>
  </section>
</template>

<style scoped>
.exercise {
  width: 80%;
  margin-right: 5px;
  display: inline-block;
}
.remove-exercise {
  width: calc(15% - 5px);
  display: inline-block;
}
</style>
