import mongoose from 'mongoose';
import * as Interfaces from '../interfaces'
import { incomeSchema } from './income';
import { budgetSchema } from './budget';

const defaultSchema: mongoose.Schema<Interfaces.Default> = new mongoose.Schema(
  {
    income: [incomeSchema],
    budget: [budgetSchema],
  }
);

const Default = mongoose.model<Interfaces.Default & mongoose.Document>('Default', defaultSchema);

export default Default;