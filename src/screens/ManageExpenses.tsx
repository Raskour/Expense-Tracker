import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ExpenseItem, ExpenseType } from "../types";
import { BASE_URL } from "../constants";

const ManageExpenses = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const isBulkEditing = pathname === "/expenses/edit";

  const [expenses, setExpenses] = useState<Record<ExpenseType, number>>({
    [ExpenseType.Coffee]: 0,
    [ExpenseType.Food]: 0,
    [ExpenseType.Alcohol]: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(
    isBulkEditing ? true : false
  );

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const date = new Date().toISOString();

        const res = await fetch(`${BASE_URL}/api/expenses?date=${date}`);

        if (!res.ok) {
          throw new Error(
            "Error occurred while fetching list of expenses for today"
          );
        }

        const data: ExpenseItem[] = await res.json();
        const expenseMap: Record<ExpenseType, number> = {
          [ExpenseType.Coffee]: 0,
          [ExpenseType.Food]: 0,
          [ExpenseType.Alcohol]: 0,
        };

        // Map the response data to the expense state
        data.forEach((expense) => {
          expenseMap[expense.type_name] = expense.amount;
        });

        setExpenses(expenseMap);

        setExpenses(expenseMap);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (isBulkEditing) {
      fetchExpenses();
    }
  }, [isBulkEditing]);

  function handleExpenseChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setExpenses((prevExpenses) => ({ ...prevExpenses, [name]: value }));
  }

  async function handleExpenses(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);

    const { coffee, food, alcohol } = expenses;

    const date = new Date().toISOString();

    const payload = {
      expenses: [
        { type_name: "coffee", amount: Number(coffee) },
        { type_name: "food", amount: Number(food) },
        { type_name: "alcohol", amount: Number(alcohol) },
      ],
      date,
    };

    const requestMethod = isBulkEditing ? "PUT" : "POST";

    try {
      const res = await fetch(`${BASE_URL}/api/expenses`, {
        method: requestMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate("/");
      } else {
        throw new Error("Error occurred while adding expense");
      }
    } catch (error: any) {
      setError(error?.message);
    }
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="page_wrapper">
      <div className="header">
        <h1>How much did I spend today?</h1>
      </div>
      {error && <p className="error">{error}</p>}
      <form className="expense-form" onSubmit={handleExpenses}>
        <div className="form-group">
          <label htmlFor="alcohol">Alcohol 🍺</label>
          <input
            name="alcohol"
            type="number"
            id="alcohol"
            value={expenses.alcohol}
            onChange={handleExpenseChange}
            required
            min="1"
            max="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="coffee">Coffee ☕</label>
          <input
            name="coffee"
            type="number"
            id="coffee"
            value={expenses.coffee}
            onChange={handleExpenseChange}
            required
            min="1"
            max="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="food">Food 🍔</label>
          <input
            name="food"
            type="number"
            id="food"
            value={expenses.food}
            onChange={handleExpenseChange}
            required
            min="1"
            max="100"
          />
        </div>

        <div className="expense-form__actions">
          <Link to="/" className="button link">
            Back
          </Link>
          <button type="submit" className="button">
            {isBulkEditing ? "Update expenses" : "Add expenses"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default ManageExpenses;
