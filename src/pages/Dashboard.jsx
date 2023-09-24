import React, { useEffect, useState } from "react";
import {
  createBudget,
  createExpense,
  deleteItem,
  fetchData,
  waait,
} from "../helper";

// react router dom imports
import { Link, Navigate, useLoaderData, useNavigate } from "react-router-dom";

// components import
import Register from "../components/Register";
import AddBudgetForm from "../components/AddBudgetForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
import AddExpenseForm from "../components/AddExpenseForm";

// toastify imports
import { toast } from "react-toastify";
import Alert from "../components/Alert";
import Login from "../components/Login";

// loader
export async function dashboardLoader() {
  const budgets = await fetchData("budgets");
  const expenses = await fetchData("expenses");
  return { budgets, expenses };
}

// action
export async function dashboardAction({ request }) {
  await waait();
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "createBudget") {
    try {
      // create budget
      createBudget({
        name: values.newBudget,
        amount: values.newBudgetAmount,
      });

      return toast.success("Your budget is created!");
    } catch (e) {
      throw new Error("There was a problem creating your budget!");
    }
  } else if (_action === "createExpense") {
    try {
      createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
      });

      return toast.success(`${values.newExpense} added!`);
    } catch (e) {
      throw new Error("There was a problem adding your Expense!");
    }
  } else if (_action === "deleteExpense") {
    try {
      deleteItem({
        key: "expenses",
        id: values.expenseId,
      });

      return toast.success(`Expense deleted!`);
    } catch (e) {
      throw new Error("There was a problem deleting your Expense!");
    }
  }
}

const Dashboard = () => {
  const { budgets, expenses } = useLoaderData();
  // const { email } = useLoaderData();

  // const [alert, setAlert] = useState({ type: "", message: "" });

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userDetails = JSON.parse(localStorage.getItem("user_details"));
      const userID = await userDetails.id;
      const userEmail = await userDetails.email;
      // console.log(userID, userEmail);
      if (userID) {
        try {
          const response = await fetch(
            `http://localhost:5000/getuser/${userID}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setUsername(data.user_name);
          setEmail(userEmail);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [username]);

  // if expense exceeds balance amount, then set alert to danger with message = "Exceeding balance.";
  // code here.

  return (
    <>
      {/* <Alert /> */}
      {username ? (
        <div className="dashboard">
          <h1>
            Welcome back, <span className="accent">{username}</span>
          </h1>
          <div className="grid-sm">
            {budgets && budgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm />
                  <AddExpenseForm budgets={budgets} />
                </div>
                <h2>Existing Categories</h2>
                <div className="budgets">
                  {budgets.map((budget) => (
                    <BudgetItem key={budget.id} budget={budget} />
                  ))}
                </div>
                {expenses && expenses.length > 0 && (
                  <div className="grid-md">
                    <h2>Recent Expenses</h2>
                    <Table
                      expenses={expenses
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .slice(0, 8)}
                    />
                    {expenses.length > 8 && (
                      <Link to={"expenses"} className="btn btn--dark">
                        View all expenses
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid-sm">
                <p>Track your expenses by creating a category for expense.</p>
                <AddBudgetForm />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Dashboard;
