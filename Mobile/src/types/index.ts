export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  color?: string;
}

export interface Transaction {
  id: number;
  amount: number;
  date: string; // YYYY-MM-DD
  categoryId: number;
  note?: string;
}
