```tsx
// Small shared filter store for the section feature
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { Type_Paged } from "@/shared/model/models";
import type { Type_GradeDetailFilters } from "./model";

type Ctx = Type_GradeDetailFilters & Type_Paged;

type Events = {
  setFilters: (
    filters: Partial<Type_GradeDetailFilters & Type_Paged>,
    cb?: (latest: Type_GradeDetailFilters & Type_Paged) => void,
  ) => void;
  clearFilters: () => void;
};

type State = {
  ctx: Ctx;
  events: Events;
};

const DEFAULT_CTX: Ctx = {
  grade_id: null,
  total: 0,
  page: 1,
  size: 10,
};

export const useGradeDetailFilterStore = create(
  immer<State>((set, get) => ({
    ctx: DEFAULT_CTX,
    events: {
      setFilters: (filters, cb) => {
        set((state) => {
          state.ctx = { ...state.ctx, ...filters };
        });
        cb?.(get().ctx);
      },

      clearFilters: () =>
        set((state) => {
          state.ctx = DEFAULT_CTX;
        }),
    },
  })),
);

```

```tsx
import { Button } from "@/components/ui/button";
import { useGradeDetailStore } from "@/fsd/grade-detail/entities";
import { useGradeDetailFilterStore } from "@/fsd/grade-detail/entities/model/use-grade-detail-filter-store";
import { GradeSelect } from "@/fsd/grade/entities";

export const GradeDetailFilters = () => {
  const filters = useGradeDetailFilterStore((state) => state.ctx);
  const { setFilters } = useGradeDetailFilterStore((state) => state.events);
  const { fetch } = useGradeDetailStore((state) => state.events);

  const handleApply = () => {
    fetch(filters);
  };
  return (
    <div className="flex items-center  space-x-2">
      <GradeSelect
        value={filters.grade_id}
        onChange={(value) => {
          setFilters({
            grade_id: value,
          });
        }}
      />

      <Button variant="outline" size="sm" onClick={handleApply}>
        Apply
      </Button>
    </div>
  );
};

```