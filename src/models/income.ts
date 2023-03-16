import mongoose from "mongoose";
import * as Interfaces from "../interfaces";

export const incomeSchema: mongoose.Schema<Interfaces.Income> =
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    date: {
      type: Date,
      required: false,
    },
  });
