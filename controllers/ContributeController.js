import pg from "pg";

const Pool = pg.Pool;
const pool = new Pool({
  user: "postgres",
  password: "9848",
  host: "localhost",
  database: "budgetbook",
  port: 5432, // Default PostgreSQL port
});

export const contributor = async (req, res) => {
  const email = await req.body.email;

  try {
    // Check if the user_email is already registered
    const emailCheckQuery = "SELECT * FROM account WHERE user_email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      const username = emailCheckResult.rows[0].user_name;
      return res
        .status(200)
        .json({ success: true, message: "User found!", username: username });
    }

    res.status(400).json({ success: false, message: "User not found!" });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const contributeAmount = async (req, res) => {
  const email = await req.body.email;
  const amount = parseFloat(await req.body.amount);

  try {
    const emailCheckQuery = "SELECT * FROM account WHERE user_email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      const id = await emailCheckResult.rows[0].user_id;
      const getUserBalanceQuery = "SELECT * FROM balance WHERE user_id = $1";
      const getUserBalanceResult = await pool.query(getUserBalanceQuery, [id]);

      if (getUserBalanceResult.rows.length > 0) {
        const currentBalance = parseFloat(
          await getUserBalanceResult.rows[0].amount
        );
        const newBalance = currentBalance + amount;
        const updateBalanceQuery =
          "UPDATE balance SET amount = $1 WHERE user_id = $2";
        const updateBalanceResult = await pool.query(updateBalanceQuery, [
          newBalance,
          id,
        ]);
      } else {
        const insertBalanceQuery =
          "INSERT INTO balance (user_id, amount) VALUES ($1, $2)";
        const insertBalanceResult = await pool.query(insertBalanceQuery, [
          id,
          amount,
        ]);
      }

      return res
        .status(200)
        .json({ success: true, message: "Balance updated!" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};
