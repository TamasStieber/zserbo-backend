export type Predecessor = {
  _id: string;
  monthId: string;
};

export type Income = {
  _id: string;
  name: string;
  value: number;
};

export type Budget = {
  _id: string;
  name: string;
  plan: number;
  actual: number;
  categoryId: number;
};

export type Contributor = {
  _id: string;
  monthId: string;
  plan: number;
  actual: number;
};

export type Spending = {
  _id: string;
  amount: number;
  monthId: string;
};

export type Saving = {
  _id: string;
  name: string;
  goal: number;
  initial: number;
  comment: string;
  planned: number;
  actual: number;
  contributors: Contributor[];
  spendings: Spending[];
};

export type Default = {
  _id: string;
  income: Income[];
  budget: Budget[];
};

export type NewDefaultEntry = {
  _id: string;
  name: string;
  value?: number;
  plan?: number;
  actual?: number;
  categoryId?: number;
};

export type Month = {
  _id: string;
  name: string;
  url: string;
  default: boolean;
  closed: boolean;
  balance: number;
  opening: number;
  predecessor: Predecessor[];
  income: Income[];
  budget: Budget[];
  comment: string;
  sumAllSavings: number;
};

export type UpdateEntry = {
  balance: number;
  opening: string;
  comment: string;
};

export type ToggleClose = {
  closed: boolean;
  sumAllSavings: number;
};
