import { Router } from "express";
import * as Interfaces from "../interfaces";
import Month from "../models/month";
import Default from "../models/default";
import Joi from "joi";
import * as _ from "lodash";
import Saving from "../models/saving";

const router = Router();

const validateMonthEntry = (month: Interfaces.Month): Joi.ValidationResult => {
  const schema = Joi.object({
    predecessor: {
      monthId: Joi.string().allow(null, ""),
    },
    name: Joi.string().min(1).max(255).required(),
    comment: Joi.string().allow(null, ""),
    default: Joi.boolean(),
  });
  return schema.validate(month);
};

const validateToggleClose = (
  update: Interfaces.ToggleClose
): Joi.ValidationResult => {
  const schema = Joi.object({
    closed: Joi.boolean().required(),
    sumAllSavings: Joi.number().min(0).required(),
  });
  return schema.validate(update);
};

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

const validateUpdate = (
  update: Interfaces.UpdateEntry
): Joi.ValidationResult => {
  const schema = Joi.object({
    balance: Joi.number().min(0).required(),
    opening: Joi.number().min(0).required(),
    comment: Joi.string().allow("", null),
  });
  return schema.validate(update);
};

router.get("/", async (req, res, next): Promise<void> => {
  try {
    const allMonths = await Month.find({});
    res.status(200).json({ allMonths });
  } catch {
    next(res.status(500).json({ error: "internal server error" }));
  }
});

router.get("/:url", async (req, res, next): Promise<void> => {
  try {
    const month = await Month.findOne({ url: req.params.url });
    res.status(200).json({ month });
  } catch {
    next(res.status(500).json({ error: "internal server error" }));
  }
});

router.post("/", async (req, res, next): Promise<void> => {
  const newMonth = req.body as Interfaces.Month;

  const { error } = validateMonthEntry(newMonth);

  if (error) {
    res.status(400).send(error.details[0].message);
    console.log(error);
  } else {
    try {
      newMonth.url = _.kebabCase(req.body.name);
      newMonth.date = new Date();

      const defaults = await Default.findOne({});

      if (defaults) {
        newMonth.income = defaults.income;
        newMonth.budget = defaults.budget;
      }

      if (newMonth.default) {
        await Month.updateMany({}, { $set: { default: false } });
      }

      const month = await Month.create(newMonth);
      res.status(201).json({ month });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
});

router.post("/:id/budget", async (req, res, next): Promise<void> => {
  const newBudgetElement = req.body as Interfaces.NewDefaultEntry;

  const { error } = newBudgetElement.value
    ? validateIncomeEntry(newBudgetElement as Interfaces.Income)
    : validateBudgeteEntry(newBudgetElement as Interfaces.Budget);

  if (error) {
    res.status(400).send(error.details[0].message);
    console.log(error);
  } else {
    try {
      newBudgetElement.date = new Date();

      const query = newBudgetElement.value
        ? { $push: { income: newBudgetElement } }
        : { $push: { budget: newBudgetElement } };

      const budgetEntry = await Month.findByIdAndUpdate(req.params.id, query);
      res.status(201).json({ newBudgetElement });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
});

router.put("/:id/budget/:budgetId", async (req, res, next): Promise<void> => {
  const newBudgetElement = req.body as Interfaces.NewDefaultEntry;

  const { error } = newBudgetElement.value
    ? validateIncomeEntry(newBudgetElement as Interfaces.Income)
    : validateBudgeteEntry(newBudgetElement as Interfaces.Budget);

  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    try {
      const filter = newBudgetElement.value
        ? {
            _id: req.params.id,
            income: { $elemMatch: { _id: req.params.budgetId } },
          }
        : {
            _id: req.params.id,
            budget: { $elemMatch: { _id: req.params.budgetId } },
          };

      if (newBudgetElement.plan) {
        const previousState = await Month.findOne(filter);

        const foundElement = previousState?.budget.find(
          (element) => element._id.toString() === req.params.budgetId
        );
        if (foundElement && foundElement.actual !== newBudgetElement.actual)
          newBudgetElement.date = new Date();
      }

      const query = newBudgetElement.value
        ? {
            $set: {
              "income.$.name": newBudgetElement.name,
              "income.$.value": newBudgetElement.value,
              "income.$.date": new Date(),
            },
          }
        : {
            $set: {
              "budget.$.name": newBudgetElement.name,
              "budget.$.plan": newBudgetElement.plan,
              "budget.$.actual": newBudgetElement.actual,
              "budget.$.categoryId": newBudgetElement.categoryId,
              "budget.$.date": newBudgetElement.date,
            },
          };

      const budgetEntry = await Month.findOneAndUpdate(filter, query);

      res.status(200).json({ newBudgetElement });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
});

router.put("/:id/update/", async (req, res, next): Promise<void> => {
  const update = req.body as Interfaces.UpdateEntry;

  const { error } = validateUpdate(update as Interfaces.UpdateEntry);

  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    try {
      const updateEntry = await Month.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            balance: update.balance,
            opening: update.opening,
            comment: update.comment,
            date: new Date(),
          },
        }
      );

      res.status(200).json({ update: updateEntry });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
});

router.put("/:id/toggleclose/", async (req, res, next): Promise<void> => {
  const update = req.body as Interfaces.ToggleClose;

  const { error } = validateToggleClose(update as Interfaces.ToggleClose);

  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    try {
      const updateEntry = await Month.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            closed: update.closed,
            sumAllSavings: update.sumAllSavings,
            closedAt: new Date(),
          },
        }
      );

      res.status(200).json({ update: updateEntry });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
});

router.delete(
  "/:id/income/:incomeId",
  async (req, res, next): Promise<void> => {
    try {
      const incomeToDelete = await Month.findByIdAndUpdate(req.params.id, {
        $pull: { income: { _id: req.params.incomeId } },
      });

      res.status(200).json({ id: req.params.id });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
);

router.delete(
  "/:id/expense/:expenseId",
  async (req, res, next): Promise<void> => {
    try {
      const budgetToDelete = await Month.findByIdAndUpdate(req.params.id, {
        $pull: { budget: { _id: req.params.expenseId } },
      });

      res.status(200).json({ id: req.params.id });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
);

router.post("/update-default/:id", async (req, res, next): Promise<void> => {
  try {
    await Month.updateMany({}, { $set: { default: false } });

    await Month.findByIdAndUpdate(req.params.id, {
      $set: { default: true },
    });
    res.status(200).json({ id: req.params.id });
  } catch {
    next(res.status(500).json({ error: "internal server error" }));
  }
});

router.put("/:id", async (req, res, next): Promise<void> => {
  const newMonth = req.body as Interfaces.Month;

  const { error } = validateMonthEntry(newMonth);

  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    try {
      newMonth.date = new Date();

      const updatedMonth = await Month.findByIdAndUpdate(
        req.params.id,
        newMonth
      );
      res.status(200).json({ month: updatedMonth });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
});

router.delete("/:id", async (req, res, next): Promise<void> => {
  try {
    const monthToDelete = await Month.findByIdAndRemove(req.params.id);
    const allSavings = await Saving.find();

    allSavings.forEach((saving) => {
      saving.contributors.forEach(async (contributor) => {
        if (contributor.monthId == req.params.id) {
          await Saving.findOneAndUpdate(
            {
              _id: saving._id,
            },
            { $pull: { contributors: { _id: contributor._id } } }
          );
        }
      });
    });

    if (monthToDelete?.default) {
      const latestMonth = await Month.find().sort({ _id: -1 }).limit(1);
      await Month.findByIdAndUpdate(latestMonth[0]?._id, {
        $set: { default: true },
      });
    }

    res.status(200).json({ monthToDelete });
  } catch {
    next(res.status(500).json({ error: "internal server error" }));
  }
});

export default router;
