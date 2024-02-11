import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, InputLabel } from "@mui/material";

const BASE_URL = "http://localhost:3002";

// TODO: handle this later
const isValidAmount = (amount) => {
  if (typeof amount !== "number") {
    return false;
  }

  if (amount < 1 || amount > 100) {
    return false;
  }

  return true;
};

export default function ManageExpenses() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  // Check if the URL path matches the bulk edit route
  const isBulkEditing = pathname === "/expenses/edit";

  const [expenses, setExpenses] = useState({
    coffee: "",
    food: "",
    alcohol: "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(isBulkEditing ? true : false);

  // If user is editing bulk expenses, we need to get the expenses for current date
  // and pre-populate the form
  useEffect(() => {
    if (isBulkEditing) {
      async function fetchExpenses() {
        try {
          const date = new Date().toISOString();

          const res = await fetch(BASE_URL + `/api/expenses?date=${date}`);

          if (!res.ok) {
            throw new Error(
              "Error occured while fetching list of expenses for today"
            );
          }

          const data = await res.json();
          const coffee =
            data.find((e) => e.type_name === "coffee")?.amount || "";
          const food = data.find((e) => e.type_name === "food")?.amount || "";
          const alcohol =
            data.find((e) => e.type_name === "alcohol")?.amount || "";

          setExpenses({
            coffee,
            food,
            alcohol,
          });
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      fetchExpenses();
    }
  }, [isBulkEditing]);

  function handleExpenseChange(e) {
    const { name, value } = e.target;
    setExpenses((prevExpenses) => ({ ...prevExpenses, [name]: value }));
  }

  async function handleExpenses(e) {
    e.preventDefault();

    // Resetting the error state
    setError(null);

    const { coffee, food, alcohol } = expenses;

    // date at which expense was added
    const date = new Date().toISOString();

    const payload = {
      expenses: [
        { type_name: "coffee", amount: coffee },
        { type_name: "food", amount: food },
        { type_name: "alcohol", amount: alcohol },
      ],
      date,
    };

    const requestMethod = isBulkEditing ? "PUT" : "POST";

    try {
      const res = await fetch(BASE_URL + "/api/expenses", {
        method: requestMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate("/");
      } else {
        throw new Error("Error occured while adding expense");
      }
    } catch (error) {
      setError(error.message);
    }
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Box sx={{ maxWidth: 600, p: 4 }}>
      <h1>How much did I spend today?</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleExpenses}>
        <label htmlFor="coffee">Coffee</label>
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

        <label htmlFor="food">Food</label>
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

        <label htmlFor="alcohol">Alcohol</label>
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

        <button type="submit">Add expenses</button>
      </form>
      <a href="/">Back</a>

      <Link to="/" underline="hover" color="secondary">
        Back
      </Link>
    </Box>
  );
}
