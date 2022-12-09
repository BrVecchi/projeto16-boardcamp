import { connectionDB } from "../database/db.js"

export async function findAllRentals(req, res) {
    try {
    const rentals = await connectionDB.query("SELECT * FROM rentals;")
        res.status(200).send(rentals.rows)
    } catch (error) {
        res.sendStatus(error.message)
    }
}