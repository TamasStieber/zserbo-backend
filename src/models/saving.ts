import mongoose from "mongoose";
import * as Interfaces from "../interfaces";
import { spendingSchema } from "./spending";
import { contributorSchema } from "./contributor";

export const savingSchema: mongoose.Schema<Interfaces.Saving> =
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    planned: {
      type: Number,
      required: true,
      default: 0,
    },
    actual: {
      type: Number,
      required: true,
      default: 0,
    },
    goal: {
      type: Number,
      required: true,
      default: 0,
    },
    initial: {
      type: Number,
      required: true,
      default: 0,
    },
    comment: {
      type: String,
      required: false,
      default: "",
    },
    contributors: [contributorSchema],
    spendings: [spendingSchema],
  });

const Saving = mongoose.model<Interfaces.Saving & mongoose.Document>(
  "Saving",
  savingSchema
);

export default Saving;
