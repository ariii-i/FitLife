following should be data shape 
```ts
  cosnt data = Array<{
	  workout_id:number, 
	  workout_name: string,
	  exercises_data: Array<{
		  planned_sets: number,
		  planned_reps: number,
		  actual_sets:number,
		  actual_repss:number,
		  exercise_name:string
	  }>
  }>
```
tables involved are
- wrokout
- workout_session
- exercise