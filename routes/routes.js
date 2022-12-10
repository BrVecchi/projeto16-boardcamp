import { Router } from "express";
import { findAllCategories, createCategory } from "../controllers/categoriesController.js";
import { createCustomer, findAllCustomers, findCustmerById } from "../controllers/customersController.js";
import { createGame, findAllGames } from "../controllers/gamesController.js";
import { findAllRentals } from "../controllers/rentalsController.js";

const router = Router();

router.get("/rentals", findAllRentals);
router.get("/games", findAllGames);
router.post("/games", createGame);
router.get("/customers", findAllCustomers);
router.get("/customers/:id", findCustmerById);
router.post("/customers", createCustomer);
router.get("/categories", findAllCategories);
router.post("/categories", createCategory);

export default router;
