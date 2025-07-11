// types.ts
import { Transaction } from "@/types/types/transaction";

// Estende Transaction con campo di raggruppamento
export type TransactionWithGroup = Transaction & { monthGroup: string };
