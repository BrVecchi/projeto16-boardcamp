import { connectionDB } from "../database/db.js";

export async function findAllRentals(req, res) {
  const rentalCustomerId = req.query.customerId;
  const rentalGameId = req.query.gameId;
  let where = "";
  let value = null;

  if (rentalCustomerId) {
    where = ' WHERE "customerId" = $1';
    value = rentalCustomerId;
  }

  if (rentalGameId) {
    where = ' WHERE "gameId" = $1';
    value = rentalGameId;
  }

  try {
    const rentals = await connectionDB.query(
      `
    SELECT rentals.*, games.name AS "gameName", games."categoryId" AS "gameCategoryId", categories.name AS "gameCategoryName",  customers.id AS "customerId", customers.name AS "customerName"  FROM rentals 
    JOIN games ON rentals."gameId" = games.id
    JOIN customers ON rentals."customerId" = customers.id
    JOIN categories ON games."categoryId" = categories.id
    ${where}
    ;`,
      where ? [value] : null
    );
    const result = rentals.rows.map((rental) => {
      return {
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer: {
          id: rental.customerId,
          name: rental.customerName,
        },
        game: {
          id: rental.gameId,
          name: rental.gameName,
          categoryId: rental.gameCategoryId,
          categoryName: rental.gameCategoryName,
        },
      };
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function createRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const rentDate = new Date();
  try {
    const originalPrice =
      (await (
        await connectionDB.query(
          'SELECT "pricePerDay" FROM games WHERE id=$1;',
          [gameId]
        )
      ).rows[0].pricePerDay) * daysRented;
    await connectionDB.query(
      'INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice") VALUES ($1, $2, $3, $4, $5);',
      [customerId, gameId, daysRented, rentDate, originalPrice]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message)
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;
  try {
    const existId = (
      await connectionDB.query("SELECT * FROM rentals WHERE id=$1;", [id])
    ).rows;
    if (!existId.length) {
      res.sendStatus(404);
      return;
    }
    const isFinished = (
      await connectionDB.query(
        `SELECT "returnDate" FROM rentals WHERE id=$1;`,
        [id]
      )
    ).rows[0];
    if (!isFinished.returnDate) {
      res.status(400).send("Este aluguel não foi finalizado!");
      return;
    }

    await connectionDB.query(`DELETE FROM rentals WHERE id=$1;`, [id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message)
  }
}

export async function finishRental(req, res) {
  const { id } = req.params;
  const date = new Date();

  try {
    const existId = (
      await connectionDB.query("SELECT * FROM rentals WHERE id=$1;", [id])
    ).rows;
    if (!existId.length) {
      res.sendStatus(404);
      return;
    }

    const isFinished = (
      await connectionDB.query(
        `SELECT "returnDate" FROM rentals WHERE id=$1;`,
        [id]
      )
    ).rows[0].returnDate;
    if (isFinished) {
      res.status(400).send("Este aluguel já foi finalizado!");
      return;
    }

    const rentDate = (
      await connectionDB.query(`SELECT "rentDate" FROM rentals WHERE id=$1;`, [
        id,
      ])
    ).rows[0].rentDate;
    const delay = Math.trunc((date - rentDate) / 1000 / 60 / 60 / 24);
    const gameId = (
      await connectionDB.query(`SELECT "gameId" FROM rentals WHERE id=$1;`, [
        id,
      ])
    ).rows[0].gameId;
    const pricePerDay = (
      await connectionDB.query(`SELECT "pricePerDay" FROM games WHERE id=$1;`, [
        gameId,
      ])
    ).rows[0].pricePerDay;
    const delayFee = delay * pricePerDay;
    await connectionDB.query(
      `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`,
      [date, delayFee, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message)
  }
}
