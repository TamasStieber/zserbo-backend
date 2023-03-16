export type Predecessor = {
  _id: string;
  monthId: string;
};

export type Income = {
  _id: string;
  name: string;
  value: number;
  date: Date;
};

export type Budget = {
  _id: string;
  name: string;
  plan: number;
  actual: number;
  categoryId: number;
  date: Date;
};

export type Contributor = {
  _id: string;
  monthId: string;
  plan: number;
  actual: number;
  date: Date;
};

export type Spending = {
  _id: string;
  amount: number;
  monthId: string;
  date: Date;
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
  date: Date;
};

export type Default = {
  _id: string;
  income: Income[];
  budget: Budget[];
  date: Date;
};

export type NewDefaultEntry = {
  _id: string;
  name: string;
  value?: number;
  plan?: number;
  actual?: number;
  categoryId?: number;
  date?: Date;
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
  date: Date;
  closedAt: Date;
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
