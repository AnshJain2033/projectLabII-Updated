import React from "react";

// helper imports
import {
  formatCurrency,
  formatDateToLocaleString,
  getAllMatchingItems,
} from "../helper";

// rrd imports
import { Link, useFetcher } from "react-router-dom";

// heroicons import
import { TrashIcon } from "@heroicons/react/24/solid";

const ExpenseItem = ({ expense, showBudget }) => {
  const fetcher = useFetcher();

  const budget = getAllMatchingItems({
    category: "budgets",
    key: "id",
    value: expense.budgetId,
  })[0];

  return (
    <>
      <td>{expense.name}</td>
      <td>{formatCurrency(parseFloat(expense.amount))}</td>
      <td>{formatDateToLocaleString(expense.createdAt.slice(0, 10))}</td>
      {showBudget && (
        <td>
          {
            <Link
              to={`/budget/${budget.id}`}
              style={{ "--accent": budget.color }}
            >
              {budget.name}
            </Link>
          }
        </td>
      )}
      <td>
        <fetcher.Form method="post">
          <input type="hidden" name="_action" value={"deleteExpense"} />
          <input type="hidden" name="expenseId" value={expense.id} />
          <button
            className="btn btn--warning"
            type="submit"
            aria-label={`Delete ${expense.id} expense`}
          >
            <TrashIcon width={20} />
          </button>
        </fetcher.Form>
      </td>
    </>
  );
};

export default ExpenseItem;