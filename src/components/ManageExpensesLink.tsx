import { Link } from "react-router-dom";

interface ManageExpensesLinkProps {
  hasCurrentDayExpenses: boolean;
}

export default function ManageExpensesLink({
  hasCurrentDayExpenses,
}: ManageExpensesLinkProps) {
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
