import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { ChevronRight, CheckCircle2, AlertTriangle, PlayCircle, GitCommit } from 'lucide-react';
import { cn } from '../../../shared/lib/utils';
import { GroupedDiffViewer } from '../../versions/components/VersionComponents';

// Mock Data
const mockEvents = [
  {
    id: 'EVT-204',
    type: 'PROJECT_ADDED',
    title: 'ReviveCV',
    category: 'Projects',
    occurred: 'July 24, 2026',
    recorded: 'July 25, 2026',
    reason: 'User recorded a new portfolio project.',
    diffs: [
      {
        section: 'Projects',
        changes: [{ type: 'add', text: 'ReviveCV: Event-sourced architecture.' }]
      }
    ],
    branches: [
      { id: 'ai-engineer', name: 'AI Engineer', status: 'Synced', sessionId: null },
      { id: 'backend-engineer', name: 'Backend Engineer', status: 'Behind Main', sessionId: 'sess_12' },
      { id: 'data-scientist', name: 'Data Scientist', status: 'Synced', sessionId: null }
    ]
  },
  {
    id: 'EVT-203',
    type: 'SKILL_ADDED',
    title: 'LangGraph',
    category: 'Skills',
    occurred: 'July 20, 2026',
    recorded: 'July 21, 2026',
    reason: 'Added new AI orchestration framework.',
    diffs: [
      {
        section: 'Skills',
        changes: [{ type: 'add', text: 'LangGraph' }]
      }
    ],
    branches: [
      { id: 'ai-engineer', name: 'AI Engineer', status: 'Synced', sessionId: null },
      { id: 'backend-engineer', name: 'Backend Engineer', status: 'Synced', sessionId: null }
    ]
  },
  {
    id: 'EVT-202',
    type: 'EXPERIENCE_UPDATED',
    title: 'Google',
    category: 'Experience',
    occurred: 'June 15, 2026',
    recorded: 'June 16, 2026',
    reason: 'Promoted to Senior SWE.',
    diffs: [
      {
        section: 'Experience',
        changes: [
          { type: 'remove', text: 'Software Engineer at Google' },
          { type: 'add', text: 'Senior Software Engineer at Google' }
        ]
      }
    ],
    branches: [
      { id: 'ai-engineer', name: 'AI Engineer', status: 'Synced', sessionId: null },
      { id: 'backend-engineer', name: 'Backend Engineer', status: 'Synced', sessionId: null }
    ]
  }
];

export function CareerEvolution() {
  const navigate = useNavigate();
  const [activeEventId, setActiveEventId] = useState('EVT-204');
  const [filter, setFilter] = useState('All');

  const activeEvent = mockEvents.find(e => e.id === activeEventId) || mockEvents[0];
  
  const filteredEvents = filter === 'All' 
    ? mockEvents 
    : mockEvents.filter(e => e.category === filter);

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-slate-500">
        <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Career Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/career-profile" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Career Profile</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-900 dark:text-slate-100">Evolution Timeline</span>
      </nav>

      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Career Evolution</h1>
          <p className="text-slate-500 mt-1">The immutable Git history of your professional identity.</p>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* Panel 1: Timeline */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['All', 'Projects', 'Skills', 'Experience'].map(f => (
              <Badge 
                key={f} 
                variant={filter === f ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setFilter(f)}
              >
                {f}
              </Badge>
            ))}
          </div>

          <Card className="p-4 h-[600px] overflow-y-auto space-y-2">
            {filteredEvents.map((evt) => {
              const isActive = evt.id === activeEventId;
              return (
                <div 
                  key={evt.id} 
                  className={cn(
                    "relative p-3 rounded-md cursor-pointer transition-colors border",
                    isActive 
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" 
                      : "hover:bg-slate-50 dark:hover:bg-slate-900/50 border-transparent"
                  )}
                  onClick={() => setActiveEventId(evt.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "font-mono text-xs font-bold",
                      isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                    )}>{evt.id}</span>
                    <span className="text-[10px] text-slate-500">{evt.occurred}</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{evt.type}</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{evt.title}</p>
                </div>
              )
            })}
          </Card>
        </div>

        {/* Panel 2: Event Details & Replay */}
        <div className="col-span-12 md:col-span-6 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <GitCommit className="h-5 w-5 text-blue-500" />
              Event Details
            </h2>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Occurred</p>
                <p className="text-sm font-medium">{activeEvent.occurred}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Recorded</p>
                <p className="text-sm font-medium">{activeEvent.recorded}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Category</p>
                <p className="text-sm font-medium">{activeEvent.category}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Reason</p>
                <p className="text-sm font-medium">{activeEvent.reason}</p>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
              <h3 className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2 mb-4">
                <PlayCircle className="h-4 w-4 text-green-500" />
                Snapshot Replay Result
              </h3>
              <GroupedDiffViewer diffs={activeEvent.diffs} />
            </div>
          </Card>
        </div>

        {/* Panel 3: Branch Impact */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          <h3 className="font-semibold text-lg">Branch Impact</h3>
          <p className="text-sm text-slate-500 mb-4">Branches affected by this event.</p>
          
          <div className="space-y-3">
            {activeEvent.branches.map(branch => (
              <Card key={branch.id} className="p-4">
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{branch.name}</p>
                  <div className="flex items-center justify-between">
                    {branch.status === 'Synced' ? (
                      <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Fully Applied
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-500">
                        <AlertTriangle className="h-3 w-3 mr-1" /> Behind Main
                      </span>
                    )}
                  </div>
                  {branch.status !== 'Synced' && branch.sessionId && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2 text-xs h-7"
                      onClick={() => navigate(`/sessions/${branch.sessionId}`)}
                    >
                      Review Sync Session
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
