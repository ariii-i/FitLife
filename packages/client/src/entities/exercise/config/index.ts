import { MuscleGroupEnum } from "server/src/orpc-server/packages/exericse/domain/schema-exercise";

export const MUSCLE_GROUP_OPTIONS = MuscleGroupEnum.options;

export type MuscleGroup = (typeof MUSCLE_GROUP_OPTIONS)[number];
