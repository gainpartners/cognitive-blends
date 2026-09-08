import type { AccordionSection } from './accordion';
import { creatineAccordion } from './creatine-accordion';
import { thriveoneAccordion } from './thriveone-accordion';

const byHandle: Record<string, readonly AccordionSection[]> = {
  thriveone: thriveoneAccordion,
  'creatine-sachets-box-of-30': creatineAccordion,
};

export function accordionFor(handle: string): readonly AccordionSection[] | null {
  return byHandle[handle] ?? null;
}
