var Validator = require("jsonschema").Validator;
const createDBConnection = require('../dbConnection');
var apiRes = require("../apiRes");

// connect to mysql
const dbCon = createDBConnection();

const CREATE_USER_SCHEMA = {
    properties: {
      username: { type: "string", minLength: 1, maxLength: 255 },
      password: { type: "string", minLength: 1, maxLength: 255 },
      inventory: { type: "object" }
    },
    required: ["username", "password"],
  };

// save member
const create = async (req, res) => {
    var v = new Validator();
    resValidate = v.validate(req.body, CREATE_USER_SCHEMA);

    if (resValidate.errors.length > 0) {
        res.send(apiRes.res("400", "Bad request.", resValidate.errors));
        return;
    }

    let username = req.body.username;
    let password = req.body.password;
    let inventory = req.body.inventory;
    
    // Insert into the database
    dbCon.query('INSERT INTO members (username, password, inventory) VALUES (?, ?, ?)', [username, password, JSON.stringify(inventory)], (error, results, fields) => {
        if (error) {
            // Handle the error appropriately
            console.error(error);
            res.send(apiRes.res("500", "Internal Server Error", "An error occurred while saving the member."));
            return;
        }

        res.send(apiRes.res("200", "Success", "Member successfully saved."));
    });
};

// retrieve all members
const find = async (req, res) => {
    dbCon.query('SELECT * FROM members', (error, results, fields) => {
        if (error) throw error;

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "Members table is empty";
        } else {
            message = "Successfully retrieved all members";
        }
        return res.send({ error: false, data: results, message: message});
    })
}

// retrieve member by id
const findOne = async (req, res) => {
    const memberId = req.params.id;

    dbCon.query('SELECT * FROM members WHERE id = ?', [memberId], (error, results, fields) => {
        if (error) {
            console.error(error);
            const response = { ...apiRes.error, message: "An error occurred while fetching the member." };
            res.status(500).json(response);
            return;
        }

        if (results.length === 0) {
            const response = { ...apiRes.error, message: "Member not found." };
            res.status(404).json(response);
        } else {
            const response = { ...apiRes.success, data: results[0] };
            res.status(200).json(response);
        }
    });
};

const findByIdentifier = async (req, res) => {
    const identifier = req.query.identifier; // Get the identifier from the query parameter

    dbCon.query('SELECT * FROM members WHERE username = ? OR password = ?', [identifier, identifier], (error, results, fields) => {
        if (error) {
            console.error(error);
            const response = { ...apiRes.error, message: "An error occurred while fetching the member." };
            res.status(500).json(response);
            return;
        }

        if (results.length === 0) {
            const response = { ...apiRes.error, message: "Member not found." };
            res.status(404).json(response);
        } else {
            const response = { ...apiRes.success, data: results[0] };
            res.status(200).json(response);
        }
    });
};

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

    dbCon.query('UPDATE members SET inventory = ? WHERE id = ?', [JSON.stringify(inventory), id], (error, results, fields) => {
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

module.exports = { create, find, findOne, findByIdentifier, login, saveInventory };