import mongoose from "mongoose";
import * as Interfaces from "../interfaces";

export const budgetSchema: mongoose.Schema<Interfaces.Budget> =
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    plan: {
      type: Number,
      required: true,
      default: 0,
    },
    actual: {
      type: Number,
      required: true,
      default: 0,
    },
    categoryId: {
      type: Number,
      required: true,
      default: 0,
    },
    date: {
      type: Date,
      required: false,
    },
  });
