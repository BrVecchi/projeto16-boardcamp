import express from "express";
import router from "../routes/routes.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);
const port = 4000;

app.listen(port, () => console.log(`Está rodando na porta ${port}!`));
