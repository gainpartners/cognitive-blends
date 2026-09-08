export type AccordionItem = {
  name: string;
  body: string;
};

export type AccordionFaq = {
  question: string;
  answer: string;
};

export type AccordionSection = {
  title: string;
  intro?: string;
  per?: string;
  items?: readonly AccordionItem[];
  body?: string;
  paragraphs?: readonly string[];
  faqs?: readonly AccordionFaq[];
};
