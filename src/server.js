import express from "express";
import pkg from "pg";

const { Pool } = pkg;


const app = express();

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.listen(port, () => console.log(`Está rodando na porta ${port}!`));
