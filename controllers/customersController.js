import { connectionDB } from "../database/db.js"

export async function findAllCustomers(req, res) {
    try {
    const customers = await connectionDB.query("SELECT * FROM customers;")
        res.status(200).send(customers.rows)
    } catch (error) {
        res.sendStatus(error.message)
    }
}