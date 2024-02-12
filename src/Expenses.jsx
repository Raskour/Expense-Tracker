import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:3002";

export default function FirstPage() {
  const [weeklyExpenses, setWeeklyExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // To identify is user has current day expenses
  // Based on this logic, we will either show Add expeneses or Edit expenses button
  const [hasCurrentDayExpenses, setHasCurrentDayExpenses] = useState(false);

  useEffect(() => {
    async function fetchWeeklyExpenses() {
      try {
        const res = await fetch(BASE_URL + "/api/weekly-expenses");

        if (!res.ok) {
          throw new Error(
            "Error occured while fetching weekly expenses report."
          );
        }
        const data = await res.json();
        setWeeklyExpenses(data);
      } catch (err) {
        setError(err.message);
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
            "Error occured while fetching list of expenses for today"
          );
        }

        const data = await res.json();
        if (data.length > 0) {
          setHasCurrentDayExpenses(true);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCurrentDayExpenses();
  });

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
      <ul className="expenses">
        {weeklyExpenses.map((expense) => (
          <li>
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
    </main>
  );
}

function ManageExpensesLink({ hasCurrentDayExpenses }) {
  if (hasCurrentDayExpenses) {
    return (
      <Link to="/expenses/edit" className="button link">
        Edit expenses
      </Link>
    );
  }
  return (
    <Link to="/expenses/add" className="button link">
      Add expenses
    </Link>
  );
}

const expenseIconMap = {
  coffee: "☕",
  food: "🍔",
  alcohol: "🍺",
};

// given a percentage difference
// return the appropriate emoji
function PercAverageDiff({ percentageDiff }) {
  if (percentageDiff > 0) {
    return (
      <small className="avg_up">
        ↑ ${Math.abs(Math.round(percentageDiff))}% above average
      </small>
    );
  } else if (percentageDiff < 0) {
    return (
      <small className="avg_down">
        ↓ ${Math.abs(Math.round(percentageDiff))}% below average
      </small>
    );
  } else {
    return <small> → </small>;
  }
}
