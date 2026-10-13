import express from "express";
import morgan from "morgan";
import cors from "cors";

import {
  BasesRouter,
  CarteraRouter,
  SellersRouter,
  recaudoRouter,
} from "./routes";
import { routerResumen } from "./routes/resumen.routes";
import { CARTERA_FRONTEND, PORT, VERSION } from "./config";
import { logger } from "./utils/logger";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://cartera.aplicacionesgane.cloud",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // permitir herramientas como curl o postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app
  .disable("x-powered-by")
  .use(express.json())
  .use(morgan("dev"))
  .use(express.urlencoded({ extended: true }))
  // .use(
  //   cors({
  //     origin: CARTERA_FRONTEND,
  //     credentials: true,
  //   })
  // );

app
  .use(VERSION, CarteraRouter)
  .use(VERSION, BasesRouter)
  .use(VERSION, SellersRouter)
  .use(VERSION, routerResumen)
  .use(VERSION, recaudoRouter);

app.listen(PORT, () => {
  logger.info(`Server is running at http:localhost:${PORT}`);
});
