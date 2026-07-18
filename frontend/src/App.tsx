import React, { useState, useEffect } from 'react';
import { CareerProfile } from './types/backend';
import { getCareerProfile, importCareerProfile, updateCareerProfile } from './api/careerProfile';

export default function App() {
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [confidence, setConfidence] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'editor' | 'json'>('editor');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getCareerProfile();
      setProfile(data);
    } catch (e) {
      console.log('No existing profile found or error fetching.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setMessage('');
    try {
      const res = await importCareerProfile(e.target.files[0]);
      setProfile(res.profile);
      setConfidence(res.confidence_scores);
      setMessage('✓ Imported Successfully');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      await updateCareerProfile(profile);
      setMessage('✓ Profile Saved Successfully');
    } catch (err: any) {
      setMessage(`Error saving: ${err.message}`);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted">Loading...</div>;

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">ReviveCV (Dev UI)</h1>
        <p className="text-muted text-lg">Phase 1 Pipeline Validation</p>
      </header>

      <main className="w-full max-w-5xl flex flex-col gap-8">
        
        {/* SCREEN 1: UPLOAD */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Upload Resume (.docx)</h2>
          <div className="flex items-center gap-4">
            <input type="file" accept=".docx" onChange={handleFileUpload} disabled={uploading} className="file:btn-primary file:cursor-pointer" />
          </div>
          {uploading && <p className="text-muted mt-4">Importing and parsing...</p>}
          {message && <p className="mt-4 font-semibold text-secondary">{message}</p>}
          {confidence && (
            <div className="mt-4 p-4 bg-slate-800 rounded">
              <h3 className="font-bold text-slate-300 mb-2">Confidence Scores</h3>
              <pre className="text-sm text-slate-400">{JSON.stringify(confidence, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* SCREEN 2 & 3: EDITOR / JSON */}
        {profile && (
          <div className="card">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
              <h2 className="text-xl font-semibold">Career Profile Data</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewMode('editor')}
                  className={`px-3 py-1 rounded ${viewMode === 'editor' ? 'bg-primary text-background' : 'bg-slate-700 text-slate-300'}`}>
                  Editor
                </button>
                <button 
                  onClick={() => setViewMode('json')}
                  className={`px-3 py-1 rounded ${viewMode === 'json' ? 'bg-primary text-background' : 'bg-slate-700 text-slate-300'}`}>
                  Raw JSON
                </button>
              </div>
            </div>

            {viewMode === 'json' ? (
              <textarea 
                className="w-full h-96 bg-slate-900 text-slate-300 p-4 rounded font-mono text-sm border border-slate-700"
                value={JSON.stringify(profile, null, 2)}
                onChange={(e) => {
                  try {
                    setProfile(JSON.parse(e.target.value));
                  } catch (err) {}
                }}
              />
            ) : (
              <div className="flex flex-col gap-6">
                
                <div>
                  <h3 className="text-lg text-primary mb-2 border-b border-slate-700/50 pb-1">Contact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      className="bg-slate-800 p-2 rounded text-slate-200 border border-slate-700"
                      value={profile.contact.full_name} 
                      onChange={(e) => setProfile({...profile, contact: {...profile.contact, full_name: e.target.value}})}
                      placeholder="Full Name"
                    />
                    <input 
                      className="bg-slate-800 p-2 rounded text-slate-200 border border-slate-700"
                      value={profile.contact.headline} 
                      onChange={(e) => setProfile({...profile, contact: {...profile.contact, headline: e.target.value}})}
                      placeholder="Headline"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-primary mb-2 border-b border-slate-700/50 pb-1">Summary</h3>
                  <textarea 
                    className="w-full h-32 bg-slate-800 p-3 rounded text-slate-200 border border-slate-700"
                    value={profile.profile.summary}
                    onChange={(e) => setProfile({...profile, profile: {summary: e.target.value}})}
                  />
                </div>

                <button onClick={handleSave} className="btn-primary self-start mt-4">
                  Save Changes to Backend
                </button>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
