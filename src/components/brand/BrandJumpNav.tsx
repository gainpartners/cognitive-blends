'use client';

export function BrandJumpNav({
  sections,
}: {
  sections: readonly { id: string; label: string }[];
}) {
  return (
    <>
      <nav className="bd-sticky-nav" aria-label="Guidelines">
        <div className="bd-sticky-nav__inner">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="bd-sticky-nav__link">
              {section.label}
            </a>
          ))}
        </div>
      </nav>
      <div className="bd-sticky-nav-mobile">
        <label className="visually-hidden" htmlFor="brand-jump">
          Jump to section
        </label>
        <select
          id="brand-jump"
          defaultValue=""
          onChange={(event) => {
            if (!event.target.value) return;
            document.querySelector(event.target.value)?.scrollIntoView({ behavior: 'smooth' });
            event.target.value = '';
          }}
        >
          <option value="">Jump to section…</option>
          {sections.map((section) => (
            <option key={section.id} value={`#${section.id}`}>
              {section.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
