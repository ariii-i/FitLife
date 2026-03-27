---

kanban-plugin: board

---

## Backlog

- [ ] task-8 add file-update field on client features make exercise request fields.tsx file, that field is file upload field where user will select image and upload to server
- [ ] [[task-9 use rechart to create line-chart]]
- [ ] [[task-10 add rpc on server workout use-cases to fetch workout histtory chart data]]
- [ ] task-11 update each rpc on server use-cases to have user_id attached which will have string signature


## In Progress

- [ ] task-7 implement file upload mechanism in server for create_exercise rpc in exercise's use-cases, it should add column on table as image_path, rpc should take babse64  image string save to uploads folder and link the folder path to image_path column


## Done

- [ ] task-6 use this doc to add file uploader component `https://shadcn-dropzone.vercel.app/docs`
- [ ] task-5 implement exercise filter, add store for filter in entities exercise as use-exercise-filter-store, add filter dropdown component as exercise-filter in features and use it in exercise page
- [ ] task-4 in exercise form in make-exercise-request, change the muscle group from input to select, hardcode the values as enum in entities/exercise config,
- [ ] task-2 in client's entities folder add use-streak-store that should call "get_streak_based_on_dates", create widget named streak-view in clients widget and use the use-streak-store to render data
- [ ] task-1 add new rpc named "get_streak_based_on_dates" in workout's use-cases that should take in start and end date and based on that date it should return array of date with exercise performed
- [ ] task-3 install shadcn select component




%% kanban:settings
```
{"kanban-plugin":"board"}
```
%%