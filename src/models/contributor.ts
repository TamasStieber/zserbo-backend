import mongoose from "mongoose";
import * as Interfaces from "../interfaces";

export const contributorSchema: mongoose.Schema<Interfaces.Contributor> =
  new mongoose.Schema({
    monthId: {
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
    date: {
      type: Date,
      required: false,
    },
  });
