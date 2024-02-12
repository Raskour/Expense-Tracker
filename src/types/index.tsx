export interface WeeklyExpenseItem {
  type_name: string;
  current_week_avg_amount: string;
  percentage_diff: number;
}

export enum ExpenseType {
  Coffee = "coffee",
  Food = "food",
  Alcohol = "alcohol",
}

export interface ExpenseItem {
  expense_id: number;
  type_name: ExpenseType;
  amount: number;
}
