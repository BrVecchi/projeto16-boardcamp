import { Router } from "express";
import { findAllCategories, createCategory } from "../controllers/categoriesController.js";
import { findAllCustomers } from "../controllers/customersController.js";
import { findAllGames } from "../controllers/gamesController.js";
import { findAllRentals } from "../controllers/rentalsController.js";

const router = Router();

router.get("/rentals", findAllRentals);
router.get("/games", findAllGames);
router.get("/customers", findAllCustomers);
router.get("/categories", findAllCategories);
router.post("/categories", createCategory);

export default router;
