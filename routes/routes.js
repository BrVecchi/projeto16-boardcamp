import { Router } from "express";
import { getCategories } from "../controllers/categoriesController.js";
import { getCustomers } from "../controllers/customersController.js";
import { getGames } from "../controllers/gamesController.js";
import { getRentals } from "../controllers/rentalsController.js";

const router = Router();

router.get("/rentals", getRentals);
router.get("/games", getGames);
router.get("/customers", getCustomers);
router.get("/categories", getCategories);

export default router;
