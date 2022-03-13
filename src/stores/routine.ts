import { defineStore } from "pinia";
import { Exercise, Routine } from "../models";
import { WorkoutTypes } from "../models/index";

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
        workout: WorkoutTypes.WORKOUT,
      },
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
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Reverse Shoulder Rotation",
              time: 15,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Jumping Jacks",
              time: 45,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Butt Kicks",
              time: 45,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Break",
              time: 15,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Leg Raise",
              time: 30,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Break",
              time: 15,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Leg Scissors",
              time: 30,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Break",
              time: 10,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Knee High Crunches",
              time: 30,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Break",
              time: 10,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Plank",
              time: 45,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Break",
              time: 10,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Forward Lunges",
              time: 45,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Break",
              time: 10,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Wall Pushup Bicep",
              time: 30,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Break",
              time: 10,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Wall Pushup Tricep",
              time: 30,
              workout: WorkoutTypes.WORKOUT,
            },
            {
              name: "Break",
              time: 10,
              workout: WorkoutTypes.WORKOUT,
            },
          ],
        },
        {
          name: "🆕 New Routine",
          exercises: [],
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
        )
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
      var timers = Object.values(this.activeRoutine.exercises) as Exercise[];
      timers.splice(index, 1);
      this.activeRoutine.exercises = timers;
      this.setRoutine({ name: this.activeRoutine.name, exercises: timers });
    },

    moveExerciseUp(index: number) {
      var timers = Object.values(this.activeRoutine.exercises) as Exercise[];
      moveExercise(timers, index, index - 1);
      this.setRoutine({ name: this.activeRoutine.name, exercises: timers });
    },

    moveExerciseDown(index: number) {
      var timers = Object.values(this.activeRoutine.exercises) as Exercise[];
      moveExercise(timers, index, index + 1);
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
      this.addExercise(exercise);
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
