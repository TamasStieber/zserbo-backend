import mongoose from "mongoose";
import * as Interfaces from "../interfaces";

export const spendingSchema: mongoose.Schema<Interfaces.Spending> =
  new mongoose.Schema({
    monthId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
  });
