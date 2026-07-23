export type FieldNoteSummary = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  displayDate: string;
  category: string;
  readingTime: string;
};

export type FieldNote = FieldNoteSummary & {
  body: string;
};
