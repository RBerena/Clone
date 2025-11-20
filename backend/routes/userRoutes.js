import express from "express";
import { getUsers,createUser, getUser, updateUser, deleteUser, logInUser} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers); // Get all users
router.get("/:user_id", getUser); // Get 1 user
router.post("/signup", createUser); // Create a user
router.put("/:user_id", updateUser); // Update a user
router.delete("/:user_id", deleteUser); // Delete a user

router.post("/login", logInUser); // Log in handler

export default router;