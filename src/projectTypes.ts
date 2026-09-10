import type { ProjectMedia } from './projectMedia';

export type ProjectSectionColumn =
  | { kind: 'text' }
  | { kind: 'media'; media: ProjectMedia }
  | { kind: 'empty' };

export type ProjectSectionBlock =
  | { kind: 'columns'; left: ProjectSectionColumn; right: ProjectSectionColumn }
  | { kind: 'full'; media: ProjectMedia }
  | { kind: 'grid'; columns: number; items: ProjectMedia[] };

export type ProjectSection = {
  title: string;
  paragraphs: string[];
  blocks: ProjectSectionBlock[];
};

export type Credit = {
  role: string;
  names: string[];
};

export type Work = {
  slug: string;
  title: string;
  services: string;
  image: string;
  hero: string;
  heroType: ProjectMedia['type'];
  year: string;
  client: string;
  statement: string;
  challenge: string;
  sections: ProjectSection[];
  media: ProjectMedia[];
  credits?: Credit[];
};
