<script setup lang="ts">
import { reactive, computed, defineEmits } from "vue";

const emit = defineEmits<{
  (e: "music", value: string): void;
  (e: "changeVolume", value: number): void;
}>();
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
  activeTimer: Exercise;
  totalTimeSpent: number;
  activeRoutine: Routine;
  routines: Routine[];
  timeouts: any[];
  music: any;
}
const changeVolume = (volume: number) => {
  emit("changeVolume", volume);
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
const gap = 2;

let interval: any;
let state: State = reactive({
  activeTimer: { time: 0, name: "Tap Start to Exercise" },
  totalTimeSpent: parseInt(
    window.localStorage.getItem("bhel-total-time-spent") ?? "0"
  ),
  activeRoutine: JSON.parse(
    window.localStorage.getItem("bhel-routine") ?? '{"exercises": []}'
  ) ?? { exercises: [] },
  routines: [
    {
      name: "Start Routine",
      exercises: [
        {
          name: "Start",
          time: 7,
        },
      ],
    },
    {
      name: "Default Routine",
      exercises: [
        {
          name: "Forward Shoulder Rotation",
          time: 15,
        },
        {
          name: "Reverse Shoulder Rotation",
          time: 15,
        },
        {
          name: "Jumping Jacks",
          time: 45,
        },
        {
          name: "Butt Kicks",
          time: 45,
        },
        {
          name: "Break",
          time: 15,
        },
        {
          name: "Leg Raise",
          time: 30,
        },
        {
          name: "Break",
          time: 15,
        },
        {
          name: "Leg Scissors",
          time: 30,
        },
        {
          name: "Break",
          time: 10,
        },
        {
          name: "Knee High Crunches",
          time: 30,
        },
        {
          name: "Break",
          time: 10,
        },
        {
          name: "Plank",
          time: 45,
        },
        {
          name: "Break",
          time: 10,
        },
        {
          name: "Forward Lunges",
          time: 45,
        },
        {
          name: "Break",
          time: 10,
        },
        {
          name: "Wall Pushup Bicep",
          time: 30,
        },
        {
          name: "Break",
          time: 10,
        },
        {
          name: "Wall Pushup Tricep",
          time: 30,
        },
        {
          name: "Break",
          time: 10,
        },
      ],
    },
    {
      name: "🆕 New Routine",
      exercises: [],
    },
  ],
  timeouts: [],
  music: false,
});

const musicPlayer = (command: string) => {
  if (command === "pause" || state.music) {
    emit("music", command);
  }
};
const toggleMusic = () => {
  state.music = !state.music;
  if (state.music && state.activeTimer.time > 0) {
    musicPlayer("play");
  } else {
    musicPlayer("pause");
  }
};

const activeTimeString = computed(() => {
  return durationString(state.activeTimer.time);
});

const totalRoutineTime = computed(() =>
  durationString(
    state.activeRoutine.exercises.reduce(
      (totalTime: number, next: Exercise) => totalTime + next.time,
      0
    )
  )
);

const setRoutine = (routine: Routine) => {
  state.activeRoutine = { ...routine };
  window.localStorage.setItem("bhel-routine", JSON.stringify(routine));
};

const startRoutine = () => {
  var lastTimeout = 0;
  state.activeRoutine.exercises.forEach((timer) => {
    state.timeouts.push(
      setTimeout(() => startTimer({ ...timer }), lastTimeout * 1000)
    );
    lastTimeout += timer.time + gap;
  });
  fadeOutAudio(lastTimeout);
  musicPlayer("play");
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
const clearTimeouts = () => {
  state.timeouts.forEach((timeout) => clearTimeout(timeout));
  state.timeouts = [];
};

const startTimer = (exercise: Exercise) => {
  clearInterval(interval);
  state.activeTimer = exercise;
  let duration = state.activeTimer.time;

  speak(exercise.name + " " + `${state.activeTimer.time} seconds`, 1);
  interval = setInterval(() => {
    incrementTotalTime();
    state.activeTimer.time = duration;
    if (duration > 0 && duration < 6) {
      // loud();
      speak(String(duration), 2);
    }
    if (--duration < 0) {
      // flat();
      speak("And Done", 2);
      clearInterval(interval);
    }
  }, 1000);
};

const incrementTotalTime = () => {
  state.totalTimeSpent += 1;
  window.localStorage.setItem(
    "bhel-total-time-spent",
    String(state.totalTimeSpent)
  );
};

const startSingleTimerWithMusic = (timer: Exercise) => {
  musicPlayer("load");
  musicPlayer("play");
  startTimer({ ...timer });
  fadeOutAudio(timer.time);
};

const removeFromRoutine = (index: number) => {
  var timers = Object.values(state.activeRoutine.exercises);
  timers.splice(index, 1);
  state.activeRoutine.exercises = timers;
  setRoutine(state.activeRoutine);
};

const readableTotalTimeSpent = computed(() => {
  return durationString(state.totalTimeSpent);
});

const stop = () => {
  clearInterval(interval);
  state.activeTimer = {
    time: 0,
    name: "Tap Start to Exercise",
  };

  musicPlayer("pause");
  window.speechSynthesis.cancel();
  clearTimeouts();
};
const addTimerFromForm = (event: any) => {
  const exercise: Exercise = { name: "", time: 0 };
  new FormData(event.target).forEach((value, key: string) => {
    if (key === "name") {
      exercise.name = value.toString();
    }
    if (key === "time") {
      exercise.time = parseInt(value.toString());
    }
  });
  addTimer(exercise.name, exercise.time);
};
const addTimer = (name: string, time: number) => {
  const lastExercise =
    state.activeRoutine.exercises[state.activeRoutine.exercises.length - 1];
  if (lastExercise && lastExercise.name === name) {
    state.activeRoutine.exercises[
      state.activeRoutine.exercises.length - 1
    ].time = lastExercise.time + time;
  } else {
    state.activeRoutine.exercises.push({ name, time });
  }

  setRoutine(state.activeRoutine);
};
</script>

<template>
  <section>
    <div class="grid" v-cloak>
      <article>
        <div class="headings" style="text-align: center">
          <h1>{{ activeTimeString }}</h1>
          <h2>{{ state.activeTimer.name }}</h2>
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
            Start Routine (💪 {{ totalRoutineTime }})
          </button>
          <button class="secondary" @click="stop" v-else>Stop</button>

          <details>
            <summary>Routines</summary>
            <br />
            <button
              v-for="(routine, index) in state.routines"
              :key="index + routine.name"
              class="secondary"
              type="button"
              @click="setRoutine(routine)"
            >
              {{ routine.name }}
            </button>
          </details>
          <details v-if="state.activeRoutine.exercises.length">
            <summary>
              Routine Exercises ({{ state.activeRoutine.exercises.length }})
            </summary>
            <br />
            <div
              v-for="(timer, index) in state.activeRoutine.exercises"
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
                @click="removeFromRoutine(index)"
              >
                &times;
              </button>
            </div>
          </details>
          <details>
            <summary>Stats</summary>
            <br />
            <small>Overall Time Spent: {{ readableTotalTimeSpent }}</small>
          </details>
        </footer>
      </article>
      <article>
        <form @submit.prevent="addTimerFromForm">
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
          <button type="button" @click="addTimer('Break', 15)">
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
