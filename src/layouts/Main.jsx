import React, { useEffect, useState } from "react";
import { fetchData } from "../helper";

// assets
import wave from "../assets/wave.svg";

// react router dom imports
import { Outlet, useLoaderData } from "react-router-dom";
import Nav from "../components/Nav";

// export async function mainLoader() {
//   const user_id = await localStorage.getItem("user_details").id;
//   const budgets = await fetchData("budgets");
//   const expenses = await fetchData("expenses");
//   console.log(user_id, budgets, expenses);
//   return { user_id, budgets, expenses };
// }
const Main = () => {
  // const { user_id, budgets, expenses } = useLoaderData();

  return (
    <div className="layout">
      <Nav />
      <main>
        <Outlet />
      </main>
      <img src={wave} alt="" />
    </div>
  );
};

export default Main;
