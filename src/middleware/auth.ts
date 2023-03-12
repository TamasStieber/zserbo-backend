import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as config from "../config/default";

const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;

  const authorizationType = header?.split(" ")[0];
  const authorizationToken = header?.split(" ")[1];

  if (authorizationType === "Bearer" && authorizationToken) {
    try {
      jwt.verify(authorizationToken, config.TOKEN_SECRET);
      next();
    } catch {
      res.status(401).json({ error: "invalid token" });
    }
  } else {
    res.status(401).json({ error: "unauthorized access" });
  }
};

export default authorization;
