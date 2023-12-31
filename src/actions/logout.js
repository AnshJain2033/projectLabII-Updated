import { redirect } from "react-router-dom";
import { deleteItem } from "../helper";
import { toast } from "react-toastify";

export async function logoutAction() {
  // delete from local storage
  deleteItem({
    key: "userName",
  });
  deleteItem({
    key: "budgets",
  });
  deleteItem({
    key: "expenses",
  });

  toast.success("You've been logged out!");

  // redirect to home page
  return redirect("/");
}
