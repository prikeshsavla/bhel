export interface Exercise {
  name: string;
  time: number;
}
export interface Routine {
  name: string;
  exercises: Exercise[];
  sets: number;
}
