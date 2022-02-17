<script setup lang="ts">
import { ref, onMounted, reactive, computed } from "vue";
function durationString(timer: number) {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
}
let audioElement: any;
let interval;
const gap = 2;
const speak = (text, rate) => {
  let msg = new SpeechSynthesisUtterance();
  msg.lang = navigator.language;
  audioElement.volume = 0.1;
  msg.rate = rate;
  msg.text = text;
  window.speechSynthesis.speak(msg);
  setTimeout(() => {
    audioElement.volume = 0.4;
  }, 500);
};
const lastTotalTimeout = parseInt(
  window.localStorage.getItem("bhel-total-time-spent")
);
let state = reactive({
  activeTimer: { time: 0, name: "Tap Start to Exercise" },
  totalTimeSpent: lastTotalTimeout != NaN ? lastTotalTimeout : 0,
  activeExercises:
    JSON.parse(window.localStorage.getItem("bhel-routine")) ?? [],
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
  music: true,
});

onMounted(() => {
  audioElement = document.getElementById("exercise-audio");
});

const musicPlayer = (command: String) => {
  const audioElement: any = document.getElementById("exercise-audio");
  if (command === "pause") {
    audioElement.pause();
  } else if (state.music) {
    switch (command) {
      case "load":
        audioElement.load();
        break;
      case "play":
        audioElement.play();
        break;
    }
  }
};
const toggleMusic = () => {
  if (state.music.value && state.activeTimer.time > 0) {
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
    state.activeExercises.reduce((prev, next) => prev + next.time, 0)
  )
);

const setRoutine = (exercises) => {
  state.activeExercises = exercises;
  console.log(state.activeExercises);
  window.localStorage.setItem(
    "bhel-routine",
    JSON.stringify(state.activeExercises)
  );
};

const startRoutine = () => {
  var lastTimeout = 0;
  state.activeExercises.forEach((timer) => {
    state.timeouts.push(
      setTimeout(() => startTimer({ ...timer }), lastTimeout * 1000)
    );
    lastTimeout += timer.time + gap;
  });
  fadeOutAudio(lastTimeout);
  musicPlayer("play");
};

const fadeOutAudio = (lastTimeout) => {
  state.timeouts.push(
    setTimeout(
      () => (audioElement.volume = audioElement.volume / 2),
      lastTimeout * 1000
    )
  );
  state.timeouts.push(
    setTimeout(
      () => (audioElement.volume = audioElement.volume / 2),
      (lastTimeout + gap / 2) * 1000
    )
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

const startTimer = (exercise) => {
  clearInterval(interval);
  state.activeTimer = exercise;
  var duration = state.activeTimer.time;

  speak(exercise.name + " " + `${state.activeTimer.time} seconds`, 1);
  interval = setInterval(() => {
    incrementTotalTime();
    state.activeTimer.time = duration;
    if (duration > 0 && duration < 6) {
      // loud();
      speak(duration, 2);
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

const startSingleTimerWithMusic = (timer) => {
  musicPlayer("load");
  musicPlayer("play");
  startTimer({ ...timer });
  fadeOutAudio(timer.time);
};

const removeFromRoutine = (index) => {
  var timers = Object.values(state.activeExercises);
  timers.splice(index, 1);
  setRoutine(timers);
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
</script>

<template>
  <section>
    <div class="grid" v-cloak>
      <article>
        <hgroup style="text-align: center">
          <h1>{{ activeTimeString }}</h1>
          <h2>{{ state.activeTimer.name }}</h2>
        </hgroup>
        <fieldset>
          🎵 Music: Off
          <input
            type="checkbox"
            @change="toggleMusic"
            id="switch"
            v-model="state.music"
            name="switch"
            role="switch"
          />On
        </fieldset>
        <footer>
          <button @click="startRoutine" v-if="state.timeouts.length === 0">
            Start Routine (💪 {{ totalRoutineTime }})
          </button>
          <button class="secondary" @click="stop" v-else>Stop</button>
          <audio id="exercise-audio" loop>
            <source
              src="assets/music/mixkit-rising-forest-471.mp3"
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </audio>

          <details>
            <summary>Routines</summary>
            <br />
            <button
              v-for="routine in state.routines"
              :key="routine.name"
              class="secondary"
              type="button"
              @click="setRoutine(routine.exercises)"
            >
              {{ routine.name }}
            </button>
          </details>
          <details v-if="state.activeExercises.length">
            <summary>
              Routine Exercises ({{ state.activeExercises.length }})
            </summary>
            <br />
            <div v-for="(timer, index) in state.activeExercises" :key="timer">
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
    </div>

    <audio id="exercise-audio" loop>
      <source
        src="assets/music/mixkit-rising-forest-471.mp3"
        type="audio/mpeg"
      />
      Your browser does not support the audio element.
    </audio>
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
