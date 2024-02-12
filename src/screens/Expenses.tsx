import { useEffect, useState } from "react";
import { ExpenseItem, WeeklyExpenseItem } from "../types";
import PercAverageDiff from "../components/PercAverageDiff";
import ManageExpensesLink from "../components/ManageExpensesLink";
import { BASE_URL } from "../constants";
import { expenseIconMap } from "../utils";

export default function Expenses() {
  const [weeklyExpenses, setWeeklyExpenses] = useState<WeeklyExpenseItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasCurrentDayExpenses, setHasCurrentDayExpenses] =
    useState<boolean>(false);

  useEffect(() => {
    async function fetchWeeklyExpenses() {
      try {
        const res = await fetch(BASE_URL + "/api/weekly-expenses");

        if (!res.ok) {
          throw new Error(
            "Error occurred while fetching weekly expenses report."
          );
        }
        const data: WeeklyExpenseItem[] = await res.json();
        setWeeklyExpenses(data);
      } catch (err: any) {
        setError(err?.message);
      }
    }

    fetchWeeklyExpenses();
  }, []);

  useEffect(() => {
    async function fetchCurrentDayExpenses() {
      try {
        const date = new Date().toISOString();

        const res = await fetch(BASE_URL + `/api/expenses?date=${date}`);

        if (!res.ok) {
          throw new Error(
            "Error occurred while fetching list of expenses for today"
          );
        }

        const data: ExpenseItem[] = await res.json();
        if (data.length > 0) {
          setHasCurrentDayExpenses(true);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCurrentDayExpenses();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="page_wrapper">
      <div className="header">
        <h1>Am I spending too much?</h1>
        <ManageExpensesLink hasCurrentDayExpenses={hasCurrentDayExpenses} />
      </div>
      {error && <p className="error">{error}</p>}
      {weeklyExpenses.length > 0 ? (
        <ul className="expenses">
          {weeklyExpenses.map((expense, index) => (
            <li key={index}>
              <div className="expense_item--wrapper">
                <span>
                  {expense.type_name} {expenseIconMap[expense.type_name]}
                </span>
                <div className="expense_item--amount">
                  <strong>
                    ${parseFloat(expense.current_week_avg_amount).toFixed(2)} /
                    week
                  </strong>
                  <PercAverageDiff percentageDiff={expense.percentage_diff} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <h2>No expenses found. Please add some expenses to track.</h2>
      )}
    </main>
  );
}
