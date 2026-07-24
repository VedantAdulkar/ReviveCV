import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { GitBranch, FileText, Settings, Play, FileJson, ArrowLeft, CheckCircle2, AlertTriangle, ChevronRight, Download, Eye } from 'lucide-react';

// Mock data
const workspaceData = {
  id: 'ai-engineer',
  name: 'AI Engineer',
  currentVersion: 'v8',
  status: 'Behind Main',
  pendingEvents: 2,
  lastSync: '3 days ago',
  activeDeployment: { version: 'v8', updated: '2 days ago' },
  artifacts: [
    { name: 'resume.pdf', type: 'pdf' },
    { name: 'resume.docx', type: 'docx' },
    { name: 'cover_letter.pdf', type: 'pdf' },
  ],
  configuration: {
    strategy: 'One Page, Projects First',
    industry: 'AI / ML Platforms',
    focusKeywords: ['PyTorch', 'TensorFlow', 'LLMs', 'RAG', 'Vector DBs'],
    hiddenSections: ['IoT Projects', 'Web Design'],
  },
  sessions: [
    { id: 'sess_1', title: 'Google SWE', type: 'JOB_OPTIMIZATION', date: '2 days ago', status: 'Approved' },
    { id: 'sess_2', title: 'Profile Sync', type: 'PROFILE_SYNC', date: 'Just now', status: 'Waiting Review' },
  ],
  versions: [
    { id: 'v5', parent: null, current: false },
    { id: 'v6', parent: 'v5', current: false },
    { id: 'v7', parent: 'v6', current: false },
    { id: 'v8', parent: 'v7', current: true, message: 'Google AI role' },
    { id: 'v9', parent: 'v7', current: false, message: 'Draft sync' },
  ]
};

export function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app, fetch data based on `id`
  const data = workspaceData;
  if (!id) return null; // appease TS unused var

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-slate-500">
        <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Career Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-900 dark:text-slate-100">{data.name} Workspace</span>
      </nav>

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
          
          {/* Workspace Health */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Workspace Health</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card className="p-4 flex flex-col justify-between">
                <CheckCircle2 className="h-5 w-5 text-green-500 mb-2" />
                <p className="text-sm font-medium">Resume</p>
                <p className="text-xs text-slate-500">Available</p>
              </Card>
              <Card className="p-4 flex flex-col justify-between">
                <CheckCircle2 className="h-5 w-5 text-green-500 mb-2" />
                <p className="text-sm font-medium">Cover Letter</p>
                <p className="text-xs text-slate-500">Available</p>
              </Card>
              <Card className="p-4 flex flex-col justify-between bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50">
                <AlertTriangle className="h-5 w-5 text-amber-500 mb-2" />
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Behind Main</p>
                <p className="text-xs text-amber-700 dark:text-amber-400">{data.pendingEvents} Events Pending</p>
              </Card>
              <Card className="p-4 flex flex-col justify-between">
                <GitBranch className="h-5 w-5 text-slate-500 mb-2" />
                <p className="text-sm font-medium">Branch Version</p>
                <p className="text-xs text-slate-500">{data.currentVersion}</p>
              </Card>
            </div>
          </section>

          {/* Current Artifacts */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Current Artifacts</h2>
            <Card>
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Promoted Version: {data.activeDeployment.version}</span>
                  </div>
                  <span className="text-xs text-slate-500">Updated: {data.activeDeployment.updated}</span>
                </div>
              </CardHeader>
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
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" /> Preview</Button>
                      <Button variant="ghost" size="sm"><Download className="h-4 w-4 mr-1" /> Download</Button>
                    </div>
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
                  <div key={session.id} className="flex items-start justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{session.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{session.type}</Badge>
                        {session.status === 'Approved' ? (
                          <span className="flex items-center text-xs text-green-600 dark:text-green-500"><CheckCircle2 className="h-3 w-3 mr-1"/> Approved</span>
                        ) : (
                          <span className="flex items-center text-xs text-amber-600 dark:text-amber-500"><AlertTriangle className="h-3 w-3 mr-1"/> {session.status}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{session.date}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/sessions/${session.id}`)}>Review</Button>
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
              <CardContent className="space-y-5 pt-6">
                <div>
                  <h3 className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Strategy</h3>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{data.configuration.strategy}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Industry</h3>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{data.configuration.industry}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Keywords</h3>
                  <div className="flex flex-wrap gap-1">
                    {data.configuration.focusKeywords.map(k => (
                      <Badge key={k} variant="secondary">{k}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Hidden</h3>
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
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => navigate(`/branches/${id || 'ai-engineer'}/versions`)}>View Graph</Button>
            </div>
            <Card className="p-4 font-mono text-sm">
              <div className="space-y-2 text-slate-600 dark:text-slate-400">
                <div>v5</div>
                <div>│</div>
                <div>v6</div>
                <div>│</div>
                <div>v7</div>
                <div className="flex items-center gap-2">
                  <span>├──</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">v8 (Current)</span>
                  <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">Google AI</span>
                </div>
                <div>│</div>
                <div className="flex items-center gap-2">
                  <span>└──</span>
                  <span>v9</span>
                  <span className="text-xs text-slate-500">Draft sync</span>
                </div>
              </div>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}
