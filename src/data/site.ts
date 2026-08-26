/**
 * Site-wide institutional metadata. Edit this file to change the group name,
 * affiliation, address or footer links. Nothing here is generated.
 */
export const site = {
  shortName: 'CISD',
  name: 'Cyber-Physical and IoT Systems Design',
  /** Used for <title> on the home page and as the Open Graph site name. */
  title: 'CISD — Cyber-Physical and IoT Systems Design · University of Verona',
  /** Default meta description (≤ 160 characters). */
  description:
    'CISD brings together the ESD, PARCO and IoT4Care research groups at the Department of Engineering for Innovation Medicine, University of Verona.',
  /** Hero copy on the home page. */
  mission:
    'CISD brings together research groups at the Department of Engineering for Innovation Medicine of the University of Verona that address, with multi-domain knowledge, the design and verification of cyber-physical and IoT systems — from industrial IoT and smart manufacturing to parallel computing and healthcare.',
  organisation: {
    university: 'University of Verona',
    universityUrl: 'https://www.univr.it/',
    department: 'Department of Engineering for Innovation Medicine',
    departmentUrl: 'https://www.dimi.univr.it/',
    /** Postal address of the department. */
    address: ['Strada le Grazie 15', '37134 Verona', 'Italy'],
    /** Link (not an embed) to a map; no third-party iframes are loaded. */
    mapUrl: 'https://www.openstreetmap.org/search?query=Strada%20le%20Grazie%2015%2C%20Verona',
  },
  links: {
    github: 'https://github.com/esd-univr',
  },
  /**
   * Optional brand assets — leave undefined until official files are approved.
   * Paths are relative to public/ (e.g. '/images/brand/cisd-logo.svg').
   */
  brand: {
    logo: undefined as string | undefined,
    favicon: undefined as string | undefined,
    ogImage: undefined as string | undefined,
  },
  locale: 'en',
} as const;

export type Site = typeof site;
