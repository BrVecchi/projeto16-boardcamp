import { connectionDB } from "../database/db.js"

export const getRentals = ("/rentals", async (req, res) => {
    try {
    const rentals = connectionDB.query("SELECT * FROM rentals;")
        res.status(200).send(rentals)
    } catch (error) {
        res.sendStatus(error.message)
    }
})