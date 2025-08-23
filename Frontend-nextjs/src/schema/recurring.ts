import { z } from "zod";

export const RecurringItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.number(),
  frequency: z.string(),
  next_run_at: z.string(),
  category_id: z.number(),
  notes: z.string().optional().nullable(),
  type: z.enum(["entrata", "spesa"]),
  active: z.boolean(),
  interval: z.number(),
});

export const RecurringListSchema = z.array(RecurringItemSchema);

export type RecurringItem = z.infer<typeof RecurringItemSchema>;
