import pg from "pg";
import crypto from "crypto";

const Pool = pg.Pool;
const pool = new Pool({
    user: "postgres",
    password: "9848",
    host: "localhost",
    database: "budgetbook",
    port: 5432, // Default PostgreSQL port
});
//------------------------------Creating a controller to all groups of the person---------------------------------------------------------------
export const allGroups = async (req, res) => {
    try {
        const userID = req.body.user_id;
        const getAllGroupsQuery = `SELECT * FROM "group" WHERE user_id=$1;`;
        const groupIDs = [];
        const getAllGroupsResult = await pool.query(getAllGroupsQuery, [userID])
        if (getAllGroupsResult.rows.length > 0) {

            getAllGroupsResult.rows.map((group) => (groupIDs.push(group.group_id)))

            res.status(200).send({
                success: true,
                message: "Groups Fetched Successfully",
                groupIDs: groupIDs
            })

        }
        else {
            res.status(400).send({
                message: "Error in loading the groups of the user"
            })
        }


    } catch (error) {
        res.status(500).send({
            error,
            message: "Internal Server Error Error in getting the user groups",

        })
    }
};
//--------------------------------Controller for getting the members of a particular group--------------------------------------------------------
export const memberInAGroup = async (req, res) => {
    try {
        const groupID = req.body.group_id;

        const getAllMembersQuery = `SELECT * FROM "group" WHERE group_id=$1;`;
        const memberIDs = [];
        const getAllMembersResult = await pool.query(getAllMembersQuery, [groupID])
        if (getAllMembersResult.rows.length > 0) {

            getAllMembersResult.rows.map((member) => (memberIDs.push(member.user_id)))

            res.status(200).send({
                success: true,
                message: "Members of a group Fetched Successfully",
                groupID: groupID,
                memberIDs: memberIDs
            })

        }
        else {
            res.status(400).send({
                message: "Error in loading the members of the group"
            })
        }
    } catch (error) {
        res.status(500).send({
            error,
            message: "Internal Server Error ,Error in getting the members of a group",

        })
    }
};
//-------------------------------Controller for assigning amount paid by a particular user ----------------------------------------------
export const amountPaidByAUserInAGroup = async (req, res) => {
    try {
        const groupID = req.body.group_id;
        const paymentDetails = [...req.body.details];

        const getAllMembersQuery = `SELECT * FROM "group" WHERE group_id=$1;`;
        const insertAmountQuery = `UPDATE "group" SET pool_amount=$1 WHERE group_id=$2 AND user_id=$3;`;

        const getAllMembersResult = await pool.query(getAllMembersQuery, [groupID]);

        if (getAllMembersResult.rows.length > 0) {
            const response = await Promise.all(paymentDetails.map(async (member) => {
                try {
                    console.log(member.user_id)
                    return await pool.query(insertAmountQuery, [member.pool_amount, groupID, member.user_id]);
                } catch (error) {
                    // Handle the query error here, you might want to log it or take appropriate action
                    console.error("Error updating pool amount:", error);
                    throw error; // Rethrow the error to propagate it back
                }
            }));

            if (response) {
                res.status(200).send({
                    success: true,
                    message: "Pool Amount Added For All Members Successfully",
                });
            }
        } else {
            res.status(400).send({
                message: "Error in Setting the Pool Amount of the Members",
            });
        }
    } catch (error) {
        res.status(500).send({
            error,
            message: "Internal Server Error, Error in setting the amount of each member in a group",
        });
    }
};
//------------------------------------Controller to check the Average of the group-----------------------------------------
export const averageOfTheGroup = async (req, res) => {
    try {
        const groupID = req.body.group_id;
        const groupAverageQuery = `SELECT AVG(pool_amount) FROM "group" WHERE group_id=$1 AND balance!=-1;`;
        const groupAverageResult = await pool.query(groupAverageQuery, [groupID]);
        const averageValue = groupAverageResult.rows[0];
        if (groupAverageResult.rows.length > 0) {
            res.status(200).send({
                success: true,
                message: "Average of the group is calculated successfully",
                averageValue: averageValue
            })
        }
    } catch (error) {
        res.status(500).send({
            error,
            message: "Internal Server Error, Error in Calculating the average of the average",
        });
    }
};
//------------------------------------Controller for changing status of payment and amount left -------------------------------------------------------
export const changeRemainingBalanceAndStatus = async (req, res) => {
    try {
        const averageValue = req.body.average;
        const groupID = req.body.group_id;
        const userID = req.body.user_id;
        const enterBalance = req.body.balance_amount;
        const checkBalanceQuery = `SELECT * FROM "group" WHERE user_id=$1 AND group_id=$2;`;
        const setStatusQuery = `UPDATE TABLE "group" SET status=$1 WHERE user_id=$2 AND group_id=$3;`;
        const checkBalanceResult = await pool.query(checkBalanceQuery, [userID, groupID]);
        const setBalanceQuery = `UPDATE TABLE "group" SET balance_amount=$1 WHERE user_id=$2 AND group_id=$3;`;
        if (checkBalanceResult.rows.length > 0) {
            const balance = checkBalanceResult.rows[0].balance_amount;
            const status = checkBalanceResult.rows[0].status;
            const poolAmount = checkBalanceResult.rows[0].pool_amount;
            const diff = poolAmount - averageValue;
            if (poolAmount >= averageValue) {
                await pool.query(setStatusQuery, [0, userID, groupID]);
                res.status(200).send({
                    success: true,
                    message: "No Amount need to be paid"
                })
            }
            else if (poolAmount < averageValue) {
                await pool.query(setStatusQuery, [1, userID, groupID]);
                await pool.query(setBalanceQuery, [diff, userID, groupID]);
                res.status(200).send({
                    success: true,
                    message: "Difference amount need to be paid",
                    diff: diff
                })
            }

        }


    } catch (error) {
        res.status(500).send({
            error,
            message: "Internal Server Error, Error in changing the remaining balance and status",
        });
    }







};
//----------------------------Controller to check status of the Balance of a person in all the groups--------------------
export const checkStatusOfBalance = async (req, res) => {
    try {
        const userID = req.body.user_id;
        const groupIDs = [...req.body.groupIDs]
        const checkStatusQuery = `SELECT * FROM "group" WHERE user_id=$1 AND group_id=$2;`;
        const alertOnGroups = []

        if (groupIDs) {
            for (const group of groupIDs) {
                const checkStatusResult = await pool.query(checkStatusQuery, [userID, group.group_id]);
                if (checkStatusResult.rows[0].status == 1) {
                    alertOnGroups.push(group);
                }
            }
            res.status(200).send({
                success: true,
                message: "The groups to be alerted are sent",
                alertOnGroups: alertOnGroups
            })
        }
        else {
            res.status(400).send({
                message: "Error in checking the status",
            });
        }
    } catch (error) {
        res.status(500).send({
            error,
            message: "Internal Server Error, Error in checking status of each member in each group",
        });
    }
};














//-----------Creating A Group and adding member to It---------------------------------------------------------------------
export const addMemberGroup = async (req, res) => {
    const AllMembersEmail = [...req.body.members];

    try {
        const group_id = crypto.randomUUID();
        if (AllMembersEmail) {
            // Check if the user_email is already registered
            const emailCheckQuery = "SELECT * FROM account WHERE user_email = $1;";
            const insertIntoGroupQuery = `INSERT INTO "group" (group_id,user_id) VALUES($1,$2);`;
            const allUserId = [];

            async function processMembers(AllMembersEmail, pool, group_id, emailCheckQuery, insertIntoGroupQuery, allUserId) {
                for (const memberEmail of AllMembersEmail) {
                    try {
                        const emailCheckResult = await pool.query(emailCheckQuery, [memberEmail]);
                        if (emailCheckResult.rows.length > 0) {
                            const user_id = emailCheckResult.rows[0].user_id;
                            await pool.query(insertIntoGroupQuery, [group_id, user_id]);
                            allUserId.push(user_id);
                            // Handle the result of the insert query if needed
                        }
                    } catch (error) {
                        console.log(error);
                        throw error; // Rethrow the error to propagate it back
                    }
                }
            }

            await processMembers(AllMembersEmail, pool, group_id, emailCheckQuery, insertIntoGroupQuery, allUserId);

            res.status(200).send({
                success: true,
                message: "Added To group",
                groupID: group_id,
                UserIDs: allUserId
            });
        } else {
            res.status(400).send({
                success: false,
                message: "Error in getting the members"
            });
        }
    } catch (error) {
        console.error("Error in adding the user to the group", error);
        res.status(500).send({ error: "Error in adding the member" });
    }
};
