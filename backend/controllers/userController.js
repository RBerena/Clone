import { sql } from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
// CRUD Operations

// Get all users function
export const getUsers = async (req, res) => {
    try {
        const users = await sql`
            SELECT * FROM Users
            ORDER BY date_created DESC
        `;
        console.log("fetched users");
      res.status(200).json({success: true, data: users})
    } catch (error) {
        console.log("Error in getUsers function", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
};

// Create a user function
export const createUser = async (req, res) => {
    console.log("Incoming signup request:", req.body);
    const {username, firstName, lastName, email, password, phoneNumber, countryCode} = req.body
    const hashedPass = await bcrypt.hash(password, 10);

    if(!username || !firstName || !lastName || !password || !phoneNumber ){
        return res.status(400).json({success:false,message:`All fields required! ${username},${firstName},${lastName},${password},${phoneNumber}`})
    }
    
    try {
        const newUser = await sql`
        INSERT INTO Users (
            Username, 
            First_Name, 
            Last_Name, 
            Email, 
            Password, 
            Phone_Number,
            Country_Code
            
        )
        VALUES (
            ${username}, 
            ${firstName}, 
            ${lastName},
            ${email},
            ${hashedPass},
            ${phoneNumber},
            ${countryCode}
         )
        RETURNING *
        `
        console.log("New user added!", newUser[0])
        res.status(201).json({success: true, data: newUser[0]})
    } catch (error) {
        console.log("Error in createUser function", error);
        res.status(500).json({success:false, message:"Internal Server Error", error});
    }
};

// Get a single user function
export const getUser = async (req, res) => {
    const { user_id } = req.params

    try {
        const user = await sql`
        SELECT * FROM users
        WHERE user_id=${user_id}
        `
        res.status(201).json({success: true, data: user[0]});
    } catch (error) {
        console.log("Error in getUser function", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
};

// Update user function
export const updateUser = async (req, res) => {
    const { user_id } = req.params;
    const {firstName, lastName, email, password, phoneNumber, countryCode} = req.body;
    const hashedPass = await bcrypt.hash(password, 10);

    try {
        const updatedUser = await sql`
        UPDATE users
        SET 
            First_Name=${firstName}, 
            Last_Name=${lastName}, 
            Email=${email},
            Password=${hashedPass}, 
            Phone_Number=${phoneNumber}, 
            Country_Code=${countryCode}
        WHERE 
            user_id=${user_id}  
        RETURNING *
        `
        if(updatedUser.length === 0){
            return res.status(404).json({success: false, message: "User not found"});
        }
        res.status(200).json({success: true, data: updatedUser[0]});
    } catch (error) {
        console.log("Error in updateUser function", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
};

// Delete user function
export const deleteUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const deletedUser = await sql`
        DELETE FROM users
        WHERE user_id=${user_id}
        RETURNING *
        `
        if(deletedUser === 0){
            return res.status(404).json({success: false, message: "User not found"});
        }
        res.status(200).json({success: true, message: deletedUser[0]});
    } catch (error) {
        console.log("Error in deleteUser function", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
};

// User Log in function
export const logInUser = async (req, res) => {
    const {email, password} = req.body;
    console.log(email, password);

    if(!email || !password){
        return res.status(400).json({success: false, message: "Email and password required."});
    }

    try {
        const user = await sql`SELECT * FROM users WHERE Email = ${email}`;
        if(user.length === 0){
            return res.status(404).json({success:false, message:"Email not found."});
        }

        const dbPassword = user[0].Password || user[0].password;
        console.log(password, dbPassword);

        const isValidPassword = await bcrypt.compare(password.trim(),dbPassword.trim());
        console.log(isValidPassword);

        if(!isValidPassword){
            return res.status(401).json({success:false, message:"Password is incorrect."});
        }

        const sessionToken = jwt.sign(
            {id: user[0].user_id, email: user[0].email, role: user[0].role},
            JWT_SECRET,
            {expiresIn:"30m"}
        );
        res.status(200).json({success:true, sessionToken, user: user[0]});
    } catch (error) {
        console.error("Error in logInUser", error);
        res.status(500).json({success:false, message:"Internal Server Error."})
    }
};