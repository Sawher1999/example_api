var Validator = require("jsonschema").Validator;
const createDBConnection = require('../dbConnection');
var apiRes = require("../apiRes");

// connect to mysql
const dbCon = createDBConnection();

const login = async (req, res) => {
    const { username, password } = req.query;

    dbCon.query('SELECT * FROM members WHERE username = ?', [username], (error, results, fields) => {
        if (error) {
            console.error(error);
            const response = { ...apiRes.error, message: "An error occurred while logging in." };
            res.status(500).json(response);
            return;
        }

        if (results.length === 0) {
            // User doesn't exist, insert new record
            dbCon.query('INSERT INTO members (username, password) VALUES (?, ?)', [username, password], (insertError, insertResults, insertFields) => {
                if (insertError) {
                    console.error(insertError);
                    const response = { ...apiRes.error, message: "An error occurred while creating a new user." };
                    res.status(500).json(response);
                    return;
                }

                const response = { ...apiRes.success, message: "New user created." };
                res.status(201).json(response);
            });
        } else {
            // User exists, check password
            if (results[0].password !== password) {
                const response = { ...apiRes.error, message: "Incorrect password." };
                res.status(401).json(response);
            } else {
                const response = { ...apiRes.success, data: results[0], message: "Login successful." };
                res.status(200).json(response);
            }
        }
    });
};

const saveInventory = async (req, res) => {
    const { id, inventory } = req.body;

    dbCon.query('UPDATE members SET inventory = ? WHERE id = ?', [inventory, id], (error, results, fields) => {
        if (error) {
            console.error(error);
            const response = { ...apiRes.error, message: "An error occurred while saving inventory." };
            res.status(500).json(response);
            return;
        }

        if (results.affectedRows === 0) {
            const response = { ...apiRes.error, message: "User not found." };
            res.status(404).json(response);
        } else {
            const response = { ...apiRes.success, message: "Inventory saved successfully." };
            res.status(200).json(response);
        }
    });
};

module.exports = { login, saveInventory };