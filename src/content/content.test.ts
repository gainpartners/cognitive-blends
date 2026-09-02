import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { copyrightLine, footer } from './footer';
import { hero, signup, statsPanel, testimonials, thriveOneFeatures, whoWeAre } from './home';
import { navLinks } from './nav';
import { contactPage } from './pages/contact';
import { ourStory } from './pages/our-story';
import { onlineStore } from './pages/store';
import { whatIsThriveOne } from './pages/what-is-thriveone';
import { thriveoneAccordion } from './pdp/thriveone-accordion';

describe('nav', () => {
  it('keeps live labels in order', () => {
    assert.deepEqual(
      navLinks.map((link) => link.label),
      ['Home', 'What Is ThriveOne?', 'Online Store', 'Our Story', 'Contact'],
    );
    assert.equal(
      navLinks.find((link) => link.label === 'Online Store')?.href,
      '/collections/frontpage',
    );
  });
});

describe('verbatim copy', () => {
  it('keeps the live ThriveOne typo', () => {
    assert.match(whatIsThriveOne.intro[0], /perople/);
  });

  it('keeps the live Our Story typo', () => {
    assert.match(ourStory.intro[2], /Cogntive Blends/);
  });

  it('keeps hero and feature copy', () => {
    assert.equal(hero.title, 'Formulas For Modern Living');
    assert.equal(thriveOneFeatures.blocks[0].title, 'Restorative Sleep');
    assert.match(thriveOneFeatures.blocks[0].body, /supports deeper/);
  });

  it('points both founder cards at Our Story', () => {
    assert.deepEqual(
      whoWeAre.people.map((person) => person.cta.href),
      ['/our-story', '/our-story'],
    );
  });

  it('keeps homepage signup and stats copy', () => {
    assert.equal(signup.heading, 'Sign up and Save');
    assert.equal(signup.successHeading, 'Success');
    assert.equal(signup.successText, 'Thank you. The form has been submitted.');
    assert.equal(signup.alreadyOnList, "You're already on the list.");
    assert.equal(statsPanel.stats[0].value, '88%');
    assert.equal(testimonials.quotes.length, 4);
  });

  it('keeps contact intro and accordion FAQs', () => {
    assert.equal(onlineStore.heading, 'Best Sellers');
    assert.equal(contactPage.heading, 'Contact Us');
    assert.equal(contactPage.intro.length, 3);
    const faqs = thriveoneAccordion.find((section) => section.title === 'FAQs');
    assert.ok(faqs && 'faqs' in faqs && faqs.faqs.length === 4);
  });
});

describe('footer', () => {
  it('computes the copyright year rather than hardcoding 2026', () => {
    assert.equal(
      copyrightLine(2031),
      '© 2031, Cognitive Blends - Natural Hormone Support.',
    );
    assert.equal(footer.instagram.href, 'https://instagram.com/cognitiveblends');
    assert.equal(footer.countryLabel, 'Country/region');
  });
});
