export enum WorkoutTypes {
  STRETCH = "stretch",
  WORKOUT = "workout",
  COOLDOWN = "cooldown",
}
export interface Exercise {
  name: string;
  time: number;
  workout: WorkoutTypes;
}
export interface Routine {
  name: string;
  exercises: Exercise[];
}
