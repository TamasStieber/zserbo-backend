import { Router } from "express";
import jwt from "jsonwebtoken";
import * as config from "../config/default";

const router = Router();

type loginData = {
  username: string;
  password: string;
};

router.post("/", (req, res): void => {
  const login = req.body as loginData;

  console.log(login);

  if (
    login.username === config.VALID_USERNAME &&
    login.password === config.VALID_PASSWORD
  ) {
    const token = jwt.sign({ username: login.username }, config.TOKEN_SECRET);
    res.status(200).json({ token: token });
  } else {
    res.status(401).json({ error: "invalid login credential" });
  }
});

export default router;
