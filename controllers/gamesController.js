import { connectionDB } from "../database/db.js"

export async function findAllGames(req, res) {
    try {
    const games = await connectionDB.query("SELECT * FROM games;")
        res.status(200).send(games.rows)
    } catch (error) {
        res.sendStatus(error.message)
    }
}