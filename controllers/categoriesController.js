import { connectionDB } from "../database/db.js"

export async function findAllCategories(req, res) {
    try {
    const categories = (await connectionDB.query("SELECT * FROM categories;")).rows
        res.status(200).send(categories)
    } catch (error) {
        res.sendStatus(error.message)
    }
}

export async function createCategory(req, res) {
    const {name} = req.body;

    if (!name) {
        res.sendStatus(400)
        return
    }

    try {
        const categories = (await connectionDB.query("SELECT * FROM categories;")).rows

        categories.forEach(category => {
            if(category.name === name) {
                res.sendStatus(409)
                return
            }
        });

        await connectionDB.query("INSERT INTO categories (name) VALUES ($1);", [name])
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(error.message)
    }
}