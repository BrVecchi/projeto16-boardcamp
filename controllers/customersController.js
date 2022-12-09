import { connectionDB } from "../database/db.js"

export const getCustomers = ("/customers", async (req, res) => {
    try {
    const customers = connectionDB.query("SELECT * FROM customers;")
        res.status(200).send(customers)
    } catch (error) {
        res.sendStatus(error.message)
    }
})