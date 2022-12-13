import { connectionDB } from "../database/db.js";

export async function findAllGames(req, res) {
  try {
    const games = (
      await connectionDB.query(
        `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id;`
      )
    ).rows;
    res.status(200).send(games);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function createGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  if (!name) {
    res.sendStatus(400);
    return;
  }

  if (Number(stockTotal) <= 0 || Number(pricePerDay) <= 0) {
    res.sendStatus(400);
    return;
  }

  try {
    const categories = (await connectionDB.query("SELECT * FROM categories;"))
      .rows;
    const categoriesId = categories.map((category) => category.id);
    if (!categoriesId.includes(categoryId)) {
      res.sendStatus(400);
      return;
    }

    await connectionDB.query(
      'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);',
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
