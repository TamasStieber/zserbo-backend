import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import monthsRouter from "./routes/months";
import defaultsRouter from "./routes/defaults";
import savingsRouter from "./routes/savings";
import loginRouter from "./routes/login";
import * as config from "./config/default";
import authorization from "./middleware/auth";
import cors from "cors";

if (!config.TOKEN_SECRET) {
  console.error("TOKEN_SECRET is not set!");
  process.exit(1);
}

// const allowCrossDomain = (req: Request, res: Response, next: NextFunction) => {
//   res.header(`Access-Control-Allow-Origin`, `*`);
//   res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
//   res.header(`Access-Control-Allow-Headers`, `Content-Type`);
//   next();
// };

const server = express();

server.use(cors());
server.use(morgan("tiny"));
server.use(express.json());
server.use("/months", authorization, monthsRouter);
server.use("/defaults", authorization, defaultsRouter);
server.use("/savings", authorization, savingsRouter);
server.use("/login", loginRouter);
// server.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

server.use((req, res) => {
  res.status(404).json({ error: "not found" }).end();
});

const main = async (): Promise<void> => {
  await mongoose
    .connect(config.MONGO_PATH)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err));
  server.listen(config.PORT, () =>
    console.log(`Server is listening on port ${config.PORT}.`)
  );
};

main().catch(console.error);
