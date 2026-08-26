/**
 * Site-wide institutional metadata. Edit this file to change the group name,
 * affiliation, address or footer links. Nothing here is generated.
 */
export const site = {
  shortName: 'ESD',
  name: 'Electronic Systems Design',
  /** Used for <title> on the home page and as the Open Graph site name. */
  title: 'ESD — Electronic Systems Design · University of Verona',
  /** Default meta description (≤ 160 characters). */
  description:
    'Electronic Systems Design (ESD) research group, Department of Computer Science, University of Verona.',
  /**
   * DRAFT — hero copy for the scaffold. Replace with the group's approved mission
   * statement before launch; it is intentionally short and factual.
   */
  mission:
    'Research on the design, modelling and verification of electronic and cyber-physical systems — from hardware description languages and design automation to smart manufacturing and the Internet of Things.',
  organisation: {
    university: 'University of Verona',
    universityUrl: 'https://www.univr.it/',
    department: 'Department of Computer Science',
    departmentUrl: 'https://www.di.univr.it/',
    /** Postal address of the department (Ca' Vignal 2). */
    address: ['Strada le Grazie 15', '37134 Verona', 'Italy'],
    /** Link (not an embed) to a map; no third-party iframes are loaded. */
    mapUrl: 'https://www.openstreetmap.org/search?query=Strada%20le%20Grazie%2015%2C%20Verona',
  },
  links: {
    github: 'https://github.com/esd-univr',
  },
  /**
   * Optional brand assets — leave undefined until official files are approved.
   * Paths are relative to public/ (e.g. '/images/brand/esd-logo.svg').
   */
  brand: {
    logo: undefined as string | undefined,
    favicon: undefined as string | undefined,
    ogImage: undefined as string | undefined,
  },
  locale: 'en',
} as const;

export type Site = typeof site;
