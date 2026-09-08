import { CaretIcon, QuestionIcon } from '@/components/layout/icons';
import type { AccordionSection } from '@/content/pdp/accordion';

export function ProductAccordion({
  sections,
}: {
  sections: readonly AccordionSection[];
}) {
  if (sections.length === 0) return null;

  return (
    <div className="accordion">
      {sections.map((section) => (
        <details key={section.title}>
          <summary>
            <span className="accordion__icon">
              <QuestionIcon />
            </span>
            <span className="accordion__label">{section.title}</span>
            <CaretIcon />
          </summary>
          <div className="prose accordion__body">
            {section.intro ? <p>{section.intro}</p> : null}
            {section.per ? <p>{section.per}</p> : null}
            {section.items ? (
              <ul>
                {section.items.map((item) => (
                  <li key={item.name}>
                    {item.name} — {item.body}
                  </li>
                ))}
              </ul>
            ) : null}
            {section.body ? <p>{section.body}</p> : null}
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
            {section.faqs?.map((faq) => (
              <div key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
