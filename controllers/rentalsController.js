import { connectionDB } from "../database/db.js"

export async function findAllRentals(req, res) {
    try {
    const rentals = await connectionDB.query(`
    SELECT rentals.*, games.name AS "gameName", games."categoryId" AS "gameCategoryId", categories.name AS "gameCategoryName",  customers.id, customers.name AS "customerName"  FROM rentals 
    JOIN games ON rentals."gameId" = games.id
    JOIN customers ON rentals."customerId" = customers.id
    JOIN categories ON games."categoryId" = categories.id
    ;`)
    const result = rentals.rows.map(rental => {
        return (
            {
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
                 name: rental.customerName
                },
                game: {
                  id: rental.gameId,
                  name: rental.gameName,
                  categoryId: rental.gameCategoryId,
                  categoryName: rental.gameCategoryName
                }
              }
        )
    })
        res.status(200).send(result)
    } catch (error) {
        res.sendStatus(error.message)
    }
}

export async function createRental(req, res) {
    const {customerId, gameId, daysRented} = req.body;
    const rentDate = new Date();
    try {
        const originalPrice = (await (await connectionDB.query('SELECT "pricePerDay" FROM games WHERE id=$1;', [gameId])).rows[0].pricePerDay) * daysRented;
        await connectionDB.query('INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice") VALUES ($1, $2, $3, $4, $5);', [customerId, gameId, daysRented, rentDate, originalPrice])
        res.sendStatus(201)
    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
}
