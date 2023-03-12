import mongoose from "mongoose";
import * as Interfaces from "../interfaces";

export const predecessorSchema: mongoose.Schema<Interfaces.Predecessor> =
  new mongoose.Schema({
    monthId: {
      type: String,
      required: false,
    },
  });
