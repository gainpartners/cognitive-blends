import { thriveoneAccordion } from '@/content/pdp/thriveone-accordion';

export function ProductAccordion() {
  return (
    <div className="accordion">
      {thriveoneAccordion.map((section) => (
        <details key={section.title}>
          <summary>{section.title}</summary>
          <div className="prose accordion__body">
            {'intro' in section ? <p>{section.intro}</p> : null}
            {'per' in section ? <p>{section.per}</p> : null}
            {'items' in section ? (
              <ul>
                {section.items.map((item) => (
                  <li key={item.name}>
                    {item.name} — {item.body}
                  </li>
                ))}
              </ul>
            ) : null}
            {'body' in section ? <p>{section.body}</p> : null}
            {'faqs' in section
              ? section.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))
              : null}
          </div>
        </details>
      ))}
    </div>
  );
}
