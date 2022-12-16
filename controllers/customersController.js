import { connectionDB } from "../database/db.js";

export async function findAllCustomers(req, res) {
  const { cpf } = req.query;
  let where = "";

  if (cpf) {
    where = ` WHERE cpf LIKE '${cpf}%'`;
  }

  try {
    const customers = (
      await connectionDB.query(`SELECT * FROM customers ${where};`)
    ).rows;
    res.status(200).send(customers);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function findCustmerById(req, res) {
  const { cpf } = req.body;
  const { id } = req.params;

  if (cpf.toString().length !== 11) {
    res.sendStatus(400)
    return
  }

  try {
    const customer = (
      await connectionDB.query("SELECT * FROM customers WHERE id=$1;", [id])
    ).rows;
    if (customer.length === 0) {
      res.sendStatus(404);
    }
    res.status(200).send(customer);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function createCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  console.log(cpf)

  if (cpf.toString().length !== 11) {
    res.sendStatus(400)
    return
  }

  try {
    const customers = (await connectionDB.query("SELECT * FROM customers;"))
      .rows;
    const customersCPF = customers.map((customer) => customer.cpf);
    if (customersCPF.includes(cpf)) {
      res.sendStatus(409);
      return;
    }

    await connectionDB.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);",
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function updateCustomer(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  if (cpf.toString().length !== 11) {
    res.sendStatus(400)
    return
  }

  try {
    await connectionDB.query(
      "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5",
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
