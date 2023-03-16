import { Router } from "express";
import * as Interfaces from "../interfaces";
import Saving from "../models/saving";
import Default from "../models/default";
import Joi from "joi";
import * as _ from "lodash";

const router = Router();

const validateSavingEntry = (
  saving: Interfaces.Saving
): Joi.ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    goal: Joi.number().min(0).required(),
    initial: Joi.number().min(0).required(),
    comment: Joi.string().allow(null, ""),
  });
  return schema.validate(saving);
};

const validateContributorEntry = (
  contributor: Interfaces.Contributor
): Joi.ValidationResult => {
  const schema = Joi.object({
    monthId: Joi.string().max(255).required(),
    plan: Joi.number().min(0).required(),
    actual: Joi.number().min(0).required(),
  });
  return schema.validate(contributor);
};

const validateSpendingEntry = (
  spending: Interfaces.Spending
): Joi.ValidationResult => {
  const schema = Joi.object({
    monthId: Joi.string().max(255).required(),
    amount: Joi.number().min(0).required(),
  });
  return schema.validate(spending);
};

router.get("/", async (req, res, next): Promise<void> => {
  try {
    const allSavings = await Saving.find({});
    res.status(200).json({ allSavings });
  } catch {
    next(res.status(500).json({ error: "internal server error" }));
  }
});

router.post("/", async (req, res, next): Promise<void> => {
  const newSaving = req.body as Interfaces.Saving;

  const { error } = validateSavingEntry(newSaving);

  if (error) {
    res.status(400).send(error.details[0].message);
    console.log(error);
  } else {
    try {
      newSaving.contributors = [];
      newSaving.spendings = [];
      newSaving.date = new Date();

      const saving = await Saving.create(newSaving);

      res.status(201).json({ saving });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
});

router.put("/:id", async (req, res, next): Promise<void> => {
  const newSaving = req.body as Interfaces.Saving;

  const { error } = validateSavingEntry(newSaving);

  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    try {
      newSaving.date = new Date();

      const saving = await Saving.findByIdAndUpdate(req.params.id, newSaving);

      res.status(200).json({ saving: saving });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
});

router.post("/:id/contributors/", async (req, res, next): Promise<void> => {
  const newContributor = req.body as Interfaces.Contributor;

  const { error } = validateContributorEntry(newContributor);

  if (error) {
    res.status(400).send(error.details[0].message);
    console.log(error);
  } else {
    try {
      newContributor.date = new Date();

      const contributor = await Saving.findByIdAndUpdate(req.params.id, {
        $push: { contributors: newContributor },
      });

      res.status(201).json({ contributor });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
});

router.put(
  "/:id/contributors/:contributorId",
  async (req, res, next): Promise<void> => {
    const newContributor = req.body as Interfaces.Contributor;

    const { error } = validateContributorEntry(newContributor);

    if (error) {
      res.status(400).send(error.details[0].message);
      console.log(error);
    } else {
      try {
        const contributor = await Saving.findOneAndUpdate(
          {
            contributors: { $elemMatch: { _id: req.params.contributorId } },
          },
          {
            $set: {
              "contributors.$.plan": newContributor.plan,
              "contributors.$.actual": newContributor.actual,
              "contributors.$.date": new Date(),
            },
          }
        );

        res.status(201).json({ contributor });
      } catch {
        next(res.status(500).json({ error: "internal server error" }));
      }
    }
  }
);

router.delete(
  "/:id/contributors/:contributorId",
  async (req, res, next): Promise<void> => {
    try {
      const contributorToDelete = await Saving.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { contributors: { _id: req.params.contributorId } } }
      );

      res.status(200).json({ contributorToDelete });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
);

router.post("/:id/spendings/", async (req, res, next): Promise<void> => {
  const newSpending = req.body as Interfaces.Spending;

  const { error } = validateSpendingEntry(newSpending);

  if (error) {
    res.status(400).send(error.details[0].message);
    console.log(error);
  } else {
    try {
      newSpending.date = new Date();

      const spending = await Saving.findByIdAndUpdate(req.params.id, {
        $push: { spendings: newSpending },
      });

      res.status(201).json({ spending });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
});

router.put(
  "/:id/spendings/:spendingId",
  async (req, res, next): Promise<void> => {
    const newSpending = req.body as Interfaces.Spending;

    const { error } = validateSpendingEntry(newSpending);

    if (error) {
      res.status(400).send(error.details[0].message);
      console.log(error);
    } else {
      try {
        const spending = await Saving.findOneAndUpdate(
          {
            spendings: { $elemMatch: { _id: req.params.spendingId } },
          },
          {
            $set: {
              "spendings.$.amount": newSpending.amount,
              "spendings.$.date": new Date(),
            },
          }
        );

        res.status(201).json({ spending });
      } catch {
        next(res.status(500).json({ error: "internal server error" }));
      }
    }
  }
);

router.delete(
  "/:id/spendings/:spendingId",
  async (req, res, next): Promise<void> => {
    try {
      const spendingToDelete = await Saving.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { spendings: { _id: req.params.spendingId } } }
      );

      res.status(200).json({ spendingToDelete });
    } catch {
      next(res.status(500).json({ error: "internal server error" }));
    }
  }
);

router.delete("/:id", async (req, res, next): Promise<void> => {
  try {
    const savingToDelete = await Saving.findByIdAndRemove(req.params.id);

    res.status(200).json({ savingToDelete });
  } catch {
    next(res.status(500).json({ error: "internal server error" }));
  }
});

export default router;
