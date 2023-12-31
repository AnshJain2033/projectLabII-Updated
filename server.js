import express from "express";
import cors from "cors";
import session from "express-session";
// import authRoutes from "./routes/authRoutes.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
import {
  deleteUserController,
  fetchBudgets,
  loginController,
  logout,
  registerController,
  userDetails,
} from "./controllers/authController.js";
import { createCategoryController } from "./controllers/categoryController.js";
import {
  contributeAmount,
  contributor,
} from "./controllers/ContributeController.js";
import { createTransactionController } from "./controllers/transactionController.js";
import { addMemberGroup, allGroups, amountPaidByAUserInAGroup, averageOfTheGroup, checkStatusOfBalance, memberInAGroup } from "./controllers/groupsController.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/category", categoryRoutes);

app.post("/register", registerController);

app.post("/login", loginController);

app.post("/delete", deleteUserController);

app.get("/getuser/:id", userDetails);

app.post("/logout", logout);

app.post("/createcategory", createCategoryController);

app.post("/contribute/email", contributor);
app.post("/contribute/amount", contributeAmount);

app.post("/createTransaction", createTransactionController);

app.post("/fetchBudgets", fetchBudgets);
app.post("/addMemberToGroup", addMemberGroup);
app.post("/getAllGroups", allGroups);
app.post("/getMemberOfGroup", memberInAGroup)
app.post("/EachContribution", amountPaidByAUserInAGroup)
app.post("/checkStatus", checkStatusOfBalance);
app.post("/GroupAverage", averageOfTheGroup);
