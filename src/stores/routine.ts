import { defineStore } from "pinia";
import { Exercise, Routine } from "../models";

interface RoutineState {
  activeTimer: Exercise;
  totalTimeSpent: number;
  activeRoutine: Routine;
  routines: Routine[];
  customRoutines: Routine[];
  musicEnabled: any;
  player: string;
  playerVolume: number;
  editExerciseIndex: number;
}

export function durationString(timer: number): string {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
}

function moveExercise(
  array: Array<Exercise>,
  fromIndex: number,
  toIndex: number
) {
  var element = array[fromIndex];
  var otherElement = array[toIndex];
  array.splice(fromIndex, 1, otherElement);
  array.splice(toIndex, 1, element);
}
export const useRoutine = defineStore("routine", {
  state: () =>
    ({
      activeTimer: {
        time: 0,
        name: "Tap Start to Exercise",
      },
      activeRoutine: {
        name: "Routine",
        exercises: [],
        sets: 1,
        ...(JSON.parse(
          window.localStorage.getItem("bhel-routine") ??
            '{"exercises": [], "sets": 1}'
        ) ?? { exercises: [], sets: 1 }),
      },
      totalTimeSpent: parseInt(
        window.localStorage.getItem("bhel-total-time-spent") ?? "0"
      ),
      routines: [
        {
          name: "Default Routine",
          sets: 1,
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
          sets: 1,
        },
      ],
      customRoutines:
        JSON.parse(
          window.localStorage.getItem("bhel-custom-routines") ?? "[]"
        ) ?? [],
      musicEnabled: false,
      player: "pause",
      playerVolume: 1,
      editExerciseIndex: -1,
    } as RoutineState),

  getters: {
    activeTimeString(): string {
      return durationString(this.activeTimer.time);
    },

    totalRoutineTime(): string {
      return durationString(
        this.activeRoutine.exercises.reduce(
          (totalTime: number, next: Exercise) => totalTime + next?.time || 0,
          0
        ) * parseInt(this.activeRoutine.sets.toString())
      );
    },
    readableTotalTimeSpent(): string {
      return durationString(this.totalTimeSpent);
    },
  },

  actions: {
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
      var exercises = Object.values(this.activeRoutine.exercises) as Exercise[];
      exercises.splice(index, 1);
      this.activeRoutine.exercises = exercises;
      this.setRoutine(this.activeRoutine);
    },

    moveExerciseUp(index: number) {
      var exercises = Object.values(this.activeRoutine.exercises) as Exercise[];
      moveExercise(exercises, index, index - 1);
      this.setRoutine({ ...this.activeRoutine, exercises });
    },

    moveExerciseDown(index: number) {
      var exercises = Object.values(this.activeRoutine.exercises) as Exercise[];
      moveExercise(exercises, index, index + 1);
      this.setRoutine({ ...this.activeRoutine, exercises });
    },
    addExercise(exercise: Exercise) {
      const lastExercise =
        this.activeRoutine.exercises[this.activeRoutine.exercises.length - 1];
      if (lastExercise && lastExercise.name === exercise.name) {
        lastExercise.time = lastExercise.time + exercise.time;
      } else {
        this.activeRoutine.exercises.push(exercise);
      }

      this.setRoutine(this.activeRoutine);
    },
    saveCustomRoutine(name: string, routineIndex: number) {
      if (routineIndex === -1) {
        this.customRoutines.push({ ...this.activeRoutine, name });
        this.setRoutine({ ...this.activeRoutine, name });
      } else {
        this.customRoutines.splice(routineIndex, 1, { ...this.activeRoutine });
      }
      window.localStorage.setItem(
        "bhel-custom-routines",
        JSON.stringify(this.customRoutines)
      );
    },
    removeFromCustomRoutines(routineIndex: number) {
      this.customRoutines.splice(routineIndex, 1);
      window.localStorage.setItem(
        "bhel-custom-routines",
        JSON.stringify(this.customRoutines)
      );
    },
  },
});
