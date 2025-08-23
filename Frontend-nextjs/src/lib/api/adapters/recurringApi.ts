import { url } from "../endpoints";
import { api } from "../http";
import { RecurringItemSchema, RecurringListSchema } from "../../../schema/recurring";

export async function listRecurring() {
  const data = await api<unknown>(url("recurring"));
  return RecurringListSchema.parse(data);
}

export async function getRecurring(id: number) {
  const data = await api<unknown>(url("recurring", id));
  return RecurringItemSchema.parse(data);
}
