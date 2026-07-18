export interface Location {
    city: string;
    state: string;
    country: string;
  }
  
  export interface Urls {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  }
  
  export interface Contact {
    full_name: string;
    headline: string;
    email: string;
    phone: string;
    location: Location;
    urls: Urls;
  }
  
  export interface Profile {
    summary: string;
  }
  
  export interface Experience {
    id: string;
    company: string;
    title: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    responsibilities: string[];
    tech_stack: string[];
  }
  
  export interface Project {
    id: string;
    name: string;
    domain: string;
    description: string;
    technologies: string[];
    github_url?: string;
    live_url?: string;
  }
  
  export interface Skills {
    languages: string[];
    frameworks: string[];
    tools: string[];
  }
  
  export interface Education {
    id: string;
    degree: string;
    institute: string;
    start_year: string;
    end_year: string;
    gpa: string;
  }
  
  export interface Metadata {
    last_updated: string;
    version: number;
  }
  
  export interface CareerProfile {
    contact: Contact;
    profile: Profile;
    experience: Experience[];
    projects: Project[];
    skills: Skills;
    education: Education[];
    metadata: Metadata;
  }
  
  export interface Session {
    session_id: string;
    company: string;
    role: string;
    status: string;
    career_profile_version: number;
    career_profile_last_updated: string;
    job_description: string;
    analysis: any;
    suggestions: any[];
    approved_suggestions: string[];
    resume_version: any;
    cover_letter: any;
    created_at: string;
    updated_at: string;
  }
