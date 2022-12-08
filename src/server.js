import express from "express";
import { connectionDB } from "../database/db";

const app = express();
app.use(express.json())





app.listen(port, () => console.log(`Está rodando na porta ${port}!`));
