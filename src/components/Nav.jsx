import React, { useEffect, useState } from "react";
import "../index.css";

// heroicons import
import { TrashIcon, BanknotesIcon } from "@heroicons/react/24/solid";

// assets
import invoice from "../assets/invoice.png";

// rrd imports
import { Form, Link, NavLink, useNavigate } from "react-router-dom";
const Nav = () => {
  const [id, setId] = useState(null);
  const [budgets, setBudgets] = useState(null);
  const [expenses, setExpenses] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await JSON.parse(localStorage.getItem("user_details"));
      const user_id = await user.id;
      const user_budgets = await JSON.parse(localStorage.getItem("budgets"));
      const user_expenses = await JSON.parse(localStorage.getItem("expenses"));

      if (user_id) {
        setId(user_id);
        // console.log(id);
      }
      if (user_budgets) {
        setBudgets(user_budgets);
        // console.log(budgets);
      }
      if (user_expenses) {
        setExpenses(user_expenses);
        // console.log(expenses);
      }
    };

    fetchUserData();
  }, [budgets, expenses, id]);
  const navigate = useNavigate();

  const onSubmitForm = async (e) => {
    try {
      // eslint-disable-next-line no-restricted-globals
      e.preventDefault();
      const body = { id, budgets, expenses };
      const response = await fetch(`http://localhost:5000/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log(body);
      if (response.status === 200) {
        localStorage.removeItem("budgets");
        localStorage.removeItem("user_details");
        localStorage.removeItem("expenses");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav>
      <NavLink to={"/"} aria-label="Go to Home page">
        <img src={invoice} alt="" height={30} />
        <span style={{ color: "#0A3E73" }}>BudgetBook</span>
      </NavLink>
      {id && (
        <>
          <NavLink to={"contribute"}>
            <button className="btn btn--dark">
              <BanknotesIcon width={20} />
              <span>Contribute</span>
            </button>
          </NavLink>
          <form onSubmit={onSubmitForm}>
            <button type="submit" className="btn btn--warning">
              <TrashIcon width={20} />
              <span>Log out user</span>
            </button>
          </form>
        </>
      )}
    </nav>
  );
};

export default Nav;
