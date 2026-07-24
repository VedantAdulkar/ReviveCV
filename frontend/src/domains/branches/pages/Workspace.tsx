import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { GitBranch, FileText, Settings, Play, FileJson, ArrowLeft } from 'lucide-react';

// Mock data
const workspaceData = {
  id: 'ai-engineer',
  name: 'AI Engineer',
  currentVersion: 'v8',
  artifacts: [
    { name: 'resume.pdf', type: 'pdf', date: '2 hours ago' },
    { name: 'resume.docx', type: 'docx', date: '2 hours ago' },
    { name: 'cover_letter.pdf', type: 'pdf', date: '1 day ago' },
  ],
  configuration: {
    strategy: 'Highlight LLM, RAG, and distributed systems experience.',
    focusKeywords: ['PyTorch', 'TensorFlow', 'LLMs', 'RAG', 'Vector DBs'],
    hiddenSections: ['IoT Projects', 'Web Design'],
  },
  sessions: [
    { id: 'sess_1', title: 'Google - AI Engineer', date: '2 days ago', status: 'completed' },
    { id: 'sess_2', title: 'OpenAI - Research Engineer', date: '5 days ago', status: 'completed' },
    { id: 'sess_3', title: 'Anthropic - MTS', date: '1 week ago', status: 'completed' },
  ],
  versions: [
    { id: 'v8', parent: 'v7', message: 'Optimized for Google AI role', date: '2 days ago' },
    { id: 'v7', parent: 'v6', message: 'Sync with Career Profile (EVT-102)', date: '3 days ago' },
    { id: 'v6', parent: 'v5', message: 'Optimized for OpenAI', date: '5 days ago' },
  ]
};

export function Workspace() {
  const { id } = useParams();
  
  // In a real app, fetch data based on `id`
  const data = workspaceData;
  if (!id) return null; // appease TS unused var

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-slate-500" />
            <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
            <Badge variant="secondary" className="ml-2">{data.currentVersion}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configure Workspace
          </Button>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            New Session
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-8 md:col-span-2">
          
          {/* Current Artifacts */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Current Artifacts</h2>
            <Card>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {data.artifacts.map((artifact) => (
                  <div key={artifact.name} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {artifact.type === 'pdf' ? (
                        <FileText className="h-5 w-5 text-red-500" />
                      ) : (
                        <FileJson className="h-5 w-5 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{artifact.name}</p>
                        <p className="text-xs text-slate-500">{artifact.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Sessions */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Recent Sessions</h2>
            <Card>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {data.sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{session.title}</p>
                      <p className="text-xs text-slate-500">{session.date}</p>
                    </div>
                    <Button variant="outline" size="sm">Review</Button>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* Configuration */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Configuration</h2>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Strategy</h3>
                  <p className="text-sm">{data.configuration.strategy}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Focus Keywords</h3>
                  <div className="flex flex-wrap gap-1">
                    {data.configuration.focusKeywords.map(k => (
                      <Badge key={k} variant="secondary">{k}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Hidden Sections</h3>
                  <div className="flex flex-wrap gap-1">
                    {data.configuration.hiddenSections.map(k => (
                      <Badge key={k} variant="outline" className="text-slate-400">{k}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Version History */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Version History</h2>
              <Button variant="ghost" size="sm" className="h-8 text-xs">View Graph</Button>
            </div>
            <div className="space-y-4 pl-2">
              {data.versions.map((v, i) => (
                <div key={v.id} className="relative pl-6">
                  {/* Timeline line */}
                  {i !== data.versions.length - 1 && (
                    <div className="absolute left-[7px] top-4 bottom-[-24px] w-px bg-slate-200 dark:bg-slate-800" />
                  )}
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-4 border-white bg-slate-400 dark:border-slate-950 dark:bg-slate-600" />
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">{v.id}</span>
                      <span className="text-xs text-slate-500">{v.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{v.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
