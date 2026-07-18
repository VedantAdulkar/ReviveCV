import { CareerProfile } from '../types/backend';

const API_BASE = 'http://localhost:8000';

export const importCareerProfile = async (file: File): Promise<{ message: string; confidence_scores: any; profile: CareerProfile }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/career-profile/import`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to import Career Profile');
  }

  return response.json();
};

export const getCareerProfile = async (): Promise<CareerProfile> => {
  const response = await fetch(`${API_BASE}/career-profile`);
  if (!response.ok) {
    throw new Error('Failed to fetch Career Profile');
  }
  return response.json();
};

export const updateCareerProfile = async (profile: CareerProfile): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE}/career-profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    throw new Error('Failed to update Career Profile');
  }
  return response.json();
};
