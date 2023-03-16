import { Router } from "express";
import * as Interfaces from "../interfaces";
import Default from "../models/default";
import Joi from "joi";
import * as _ from "lodash";

const router = Router();

const validateIncomeEntry = (
  incomeEntry: Interfaces.Income
): Joi.ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    value: Joi.number().min(0).required(),
    categoryId: Joi.number().min(0).required(),
  });
  return schema.validate(incomeEntry);
};

const validateBudgeteEntry = (
  budgetEntry: Interfaces.Budget
): Joi.ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    plan: Joi.number().min(0).required(),
    actual: Joi.number().min(0).required(),
    categoryId: Joi.number().min(0).required(),
  });
  return schema.validate(budgetEntry);
};

router.get("/", async (req, res, next): Promise<void> => {
  try {
    const defaults = await Default.findOne({});
    res.status(200).json({ defaults });
  } catch {
    next(res.status(500).json({ error: "internal server error" }));
  }
});

router.post("/", async (req, res, next): Promise<void> => {
  const newDefault = req.body as Interfaces.NewDefaultEntry;

  const { error } = newDefault.value
    ? validateIncomeEntry(newDefault as Interfaces.Income)
    : validateBudgeteEntry(newDefault as Interfaces.Budget);

  if (error) {
    res.status(400).send(error.details[0].message);
    console.log(error);
  } else {
    try {
      // newDefault.date = new Date();

      const query = newDefault.value
        ? { $push: { income: newDefault } }
        : { $push: { budget: newDefault } };

      const collectionContent = await Default.findOne({});

      if (!collectionContent) await Default.create({ income: [], budget: [] });

      await Default.findOneAndUpdate({}, query);

      res.status(201).json({ default: newDefault });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
});

router.put("/:id", async (req, res, next): Promise<void> => {
  const newDefault = req.body as Interfaces.NewDefaultEntry;

  const { error } = newDefault.value
    ? validateIncomeEntry(newDefault as Interfaces.Income)
    : validateBudgeteEntry(newDefault as Interfaces.Budget);

  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    try {
      const filter = newDefault.value
        ? { income: { $elemMatch: { _id: req.params.id } } }
        : { budget: { $elemMatch: { _id: req.params.id } } };
      const query = newDefault.value
        ? {
            $set: {
              "income.$.name": newDefault.name,
              "income.$.value": newDefault.value,
              // "income.$.date": new Date(),
            },
          }
        : {
            $set: {
              "budget.$.name": newDefault.name,
              "budget.$.plan": newDefault.plan,
              "budget.$.actual": newDefault.actual,
              "budget.$.categoryId": newDefault.categoryId,
              // "budget.$.date": new Date(),
            },
          };

      await Default.findOneAndUpdate(filter, query);

      res.status(200).json({ default: newDefault });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
});

router.delete("/income/:id", async (req, res, next): Promise<void> => {
  try {
    await Default.findOneAndUpdate(
      {},
      { $pull: { income: { _id: req.params.id } } }
    );

    res.status(200).json({ id: req.params.id });
  } catch {
    next(res.status(500).json({ error: "internal server error" }));
  }
});

router.delete("/expense/:id", async (req, res, next): Promise<void> => {
  try {
    await Default.findOneAndUpdate(
      {},
      { $pull: { budget: { _id: req.params.id } } }
    );

    res.status(200).json({ id: req.params.id });
  } catch {
    next(res.status(500).json({ error: "internal server error" }));
  }
});

export default router;
