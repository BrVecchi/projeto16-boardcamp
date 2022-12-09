import { connectionDB } from "../database/db.js"

export const getCategories = ("/categories", async (req, res) => {
    try {
    const categories = connectionDB.query("SELECT * FROM categories;")
        res.status(200).send(categories)
    } catch (error) {
        res.sendStatus(error.message)
    }
})