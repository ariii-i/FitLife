import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useForm, useFieldArray } from "react-hook-form"
import { useWorkoutLogStore } from "../../store/workoutLogStore"
import { useEffect } from "react"

export const SessionForm = ({ sessionId, workoutExerciseId }) => {

  const { fetchWorkoutLog, addWorkoutLog } = useWorkoutLogStore()

  useEffect(() => {
    fetchWorkoutLog(sessionId)
  }, [sessionId])

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      workoutLog: [
        {
          sets: "",
          reps: "",
          weight: "",
          start_time: "",
          end_time: "",
          date: "",
        },
      ],
    },
  })

  const { fields } = useFieldArray({
    control,
    name: "workoutLog",
  })

  const getDuration = (start, end) => {
    if (!start || !end) return 0

    const s = new Date(`1970-01-01T${start}:00`)
    const e = new Date(`1970-01-01T${end}:00`)

    return Math.round((e - s) / 60000)
  }

  const onSubmit = async (data) => {
    for (const log of data.workoutLog) {
      const duration = getDuration(
        log.start_time,
        log.end_time
      )

      await addWorkoutLog({
        sessionId,
        workoutExerciseId,

        sets: Number(log.sets),
        reps: Number(log.reps),
        weight: Number(log.weight),

        start_time: log.start_time,
        end_time: log.end_time,
        date: log.date,

        duration,
      })
    }
    console.log("data", data)

    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 border rounded-xl"
    >
      <h3 className="font-bold text-lg">
        Log Workout Session
      </h3>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-2 border p-3 rounded-lg"
        >
          <Input
            type="number"
            placeholder="Sets"
            {...register(`workoutLog.${index}.sets`, {
              required: true,
            })}
          />

          <Input
            type="number"
            placeholder="Reps"
            {...register(`workoutLog.${index}.reps`, {
              required: true,
            })}
          />

          <Input
            type="number"
            placeholder="Weight (kg)"
            {...register(`workoutLog.${index}.weight`)}
          />

          <Input
            type="time"
            {...register(`workoutLog.${index}.start_time`)}
          />

          <Input
            type="time"
            {...register(`workoutLog.${index}.end_time`)}
          />

          <Input
            type="date"
            {...register(`workoutLog.${index}.date`)}
          />

        </div>
      ))}

      <Button type="submit" className="w-full">
        Log Session
      </Button>
    </form>
  )
}
