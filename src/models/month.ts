import mongoose from "mongoose";
import * as Interfaces from "../interfaces";
import { incomeSchema } from "./income";
import { budgetSchema } from "./budget";
import { predecessorSchema } from "./predecessor";

const monthSchema: mongoose.Schema<Interfaces.Month> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  url: {
    type: String,
    required: true,
  },
  default: {
    type: Boolean,
    required: true,
  },
  closed: {
    type: Boolean,
    required: true,
    default: false,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  opening: {
    type: Number,
    required: true,
    default: 0,
  },
  predecessor: [predecessorSchema],
  income: [incomeSchema],
  budget: [budgetSchema],
  sumAllSavings: {
    type: Number,
    required: true,
    default: 0,
  },
  comment: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    required: false,
  },
  closedAt: {
    type: Date,
    required: false,
  },
});

const Month = mongoose.model<Interfaces.Month & mongoose.Document>(
  "Month",
  monthSchema
);

export default Month;
