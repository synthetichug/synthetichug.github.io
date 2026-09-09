// Typed shapes for data/*.json. Mirrors what the render modules actually read.

export interface Profile {
  generated_at?: string;
  name?: string;
  tagline?: string;
  biography?: string;
  // legacy field names the current render/profile.js reads (data mismatch already
  // present in the live site's profile.json — kept here as fallbacks, not fixed).
  title?: string;
  bio?: string;
}

export interface Position {
  role: string;
  company: string;
  start: string;
  end: string | null;
  bullets: string[];
}
export interface ExperienceData {
  positions: Position[];
}

export interface EducationEntry {
  program: string;
  school: string;
  start: string;
  end: string | null;
  bullets: string[];
}
export interface EducationData {
  education: EducationEntry[];
}

export interface Skill {
  category?: string;
  name?: string;
  details?: string;
}
export interface SkillsData {
  skills: Skill[];
}

export interface Cert {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  expires?: string;
  url: string;
  icon?: string;
  short?: string;
}
export interface CertsData {
  certs: Cert[];
}

export interface Project {
  name: string;
  repo?: string;
  blurb?: string;
  stack?: string[];
}
export interface ProjectsData {
  projects: Project[];
}

export interface Writeup {
  title: string;
  link?: string;
  summary?: string;
  tags?: string[];
}
export interface WriteupsData {
  writeups: Writeup[];
}
