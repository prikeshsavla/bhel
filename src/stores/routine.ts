import { defineStore } from "pinia";
import { Exercise, Routine } from "../models";

interface RoutineState {
  activeTimer: Exercise;
  totalTimeSpent: number;
  activeRoutine: Routine;
  routines: Routine[];
}

function durationString(timer: number): string {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
}
export const useRoutine = defineStore("routine", {
  state: () =>
    ({
      activeTimer: { time: 0, name: "Tap Start to Exercise" },
      activeRoutine: JSON.parse(
        window.localStorage.getItem("bhel-routine") ?? '{"exercises": []}'
      ) ?? { exercises: [] },
      totalTimeSpent: parseInt(
        window.localStorage.getItem("bhel-total-time-spent") ?? "0"
      ),
      routines: [
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
    } as RoutineState),

  getters: {
    activeTimeString(): string {
      return durationString(this.activeTimer.time);
    },

    totalRoutineTime(): string {
      return durationString(
        this.activeRoutine.exercises.reduce(
          (totalTime: number, next: Exercise) => totalTime + next.time,
          0
        )
      );
    },
    readableTotalTimeSpent(): string {
      return durationString(this.totalTimeSpent);
    },
  },

  actions: {
    setActiveTimer(exercise: Exercise) {
      this.activeTimer = { ...exercise };
    },
    setRoutine(routine: Routine) {
      this.activeRoutine = { ...routine };
      window.localStorage.setItem("bhel-routine", JSON.stringify(routine));
    },

    incrementTotalTime() {
      this.totalTimeSpent += 1;
      window.localStorage.setItem(
        "bhel-total-time-spent",
        String(this.totalTimeSpent)
      );
    },

    removeFromRoutine(index: number) {
      var timers = Object.values(this.activeRoutine.exercises) as Exercise[];
      timers.splice(index, 1);
      this.setRoutine({ name: this.activeRoutine.name, exercises: timers });
    },

    addTimerFromForm(event: any) {
      const exercise: Exercise = { name: "", time: 0 };
      new FormData(event.target).forEach((value, key: string) => {
        if (key === "name") {
          exercise.name = value.toString();
        }
        if (key === "time") {
          exercise.time = parseInt(value.toString());
        }
      });
      this.addTimer(exercise.name, exercise.time);
    },
    addTimer(name: string, time: number) {
      const lastExercise =
        this.activeRoutine.exercises[this.activeRoutine.exercises.length - 1];
      if (lastExercise && lastExercise.name === name) {
        this.activeRoutine.exercises[
          this.activeRoutine.exercises.length - 1
        ].time = lastExercise.time + time;
      } else {
        this.activeRoutine.exercises.push({ name, time });
      }

      this.setRoutine(this.activeRoutine);
    },
  },
});
