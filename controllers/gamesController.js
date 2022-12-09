import { connectionDB } from "../database/db.js"

export const getGames = ("/games", async (req, res) => {
    try {
    const games = connectionDB.query("SELECT * FROM games;")
        res.status(200).send(games)
    } catch (error) {
        res.sendStatus(error.message)
    }
})