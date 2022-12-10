import { Router } from "express";
import { findAllCategories, createCategory } from "../controllers/categoriesController.js";
import { createCustomer, findAllCustomers, findCustmerById, updateCustomer } from "../controllers/customersController.js";
import { createGame, findAllGames } from "../controllers/gamesController.js";
import { findAllRentals } from "../controllers/rentalsController.js";

const router = Router();
// RENTALS
router.get("/rentals", findAllRentals);

//GAMES
router.get("/games", findAllGames);
router.post("/games", createGame);

//CUSTOMERS
router.get("/customers", findAllCustomers);
router.get("/customers/:id", findCustmerById);
router.post("/customers", createCustomer);
router.put("/customers/:id", updateCustomer);

//CATEGORIES
router.get("/categories", findAllCategories);
router.post("/categories", createCategory);

export default router;
