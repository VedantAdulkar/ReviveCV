import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeftRight, FileText, Download } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import {
  VersionDAG,
  VersionProvenance,
  GroupedDiffViewer
} from '../components/VersionComponents';

// Mock Data
const mockVersions = [
  {
    id: 'v5', parent: 'v4', isCurrent: false, date: '2026-07-01', generatedBy: 'JOB_OPTIMIZATION',
    eventsCount: 0, events: [], changesCount: 4,
    diffs: []
  },
  {
    id: 'v6', parent: 'v5', isCurrent: false, date: '2026-07-10', generatedBy: 'PROFILE_SYNC',
    eventsCount: 1, events: ['EVT-101'], changesCount: 2,
    diffs: [
      {
        section: 'Experience',
        changes: [
          { type: 'remove', text: 'Software Engineer at Startup' },
          { type: 'add', text: 'Backend Engineer at Startup' }
        ]
      }
    ]
  },
  {
    id: 'v7', parent: 'v6', isCurrent: false, date: '2026-07-15', generatedBy: 'PROFILE_SYNC',
    eventsCount: 2, events: ['EVT-201', 'EVT-202'], changesCount: 5,
    isBranch: true,
    diffs: [
      {
        section: 'Skills',
        changes: [
          { type: 'add', text: 'FastAPI, LangChain' }
        ]
      }
    ]
  },
  {
    id: 'v8', parent: 'v7', isCurrent: true, date: '2026-07-20', generatedBy: 'PROFILE_SYNC',
    eventsCount: 2, events: ['EVT-203', 'EVT-204'], changesCount: 8,
    isBranch: false,
    diffs: [
      {
        section: 'Summary',
        changes: [
          { type: 'add', text: 'Added MCP and Multi-Agent Systems specialization.' }
        ]
      },
      {
        section: 'Projects',
        changes: [
          { type: 'add', text: 'ReviveCV: Event-sourced architecture.' }
        ]
      }
    ]
  },
  {
    id: 'v9', parent: 'v7', isCurrent: false, date: '2026-07-24', generatedBy: 'JOB_OPTIMIZATION',
    eventsCount: 0, events: [], changesCount: 3,
    isBranch: true,
    diffs: [
      {
        section: 'Keywords',
        changes: [
          { type: 'add', text: 'Optimization for Google SWE.' }
        ]
      }
    ]
  }
];

export function VersionExplorer() {
  const { id } = useParams();
  
  const [activeVersionId, setActiveVersionId] = useState('v8');
  const activeVersion = mockVersions.find(v => v.id === activeVersionId) || mockVersions[0];

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-slate-500">
        <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Career Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/branches/${id || 'ai-engineer'}`} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          AI Engineer Workspace
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-900 dark:text-slate-100">Version Explorer</span>
      </nav>

      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Version Control</h1>
          <p className="text-slate-500 mt-1">Explore the reproducible evolution of your resumes.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><ArrowLeftRight className="h-4 w-4 mr-2"/> Compare</Button>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* Panel 1: Version DAG */}
        <div className="col-span-12 md:col-span-3">
          <VersionDAG 
            versions={mockVersions} 
            activeVersionId={activeVersionId} 
            onSelect={setActiveVersionId} 
          />
        </div>

        {/* Panel 2: Version Details (Provenance) */}
        <div className="col-span-12 md:col-span-3">
          <VersionProvenance version={activeVersion} />
        </div>

        {/* Panel 3: Diff & Actions */}
        <div className="col-span-12 md:col-span-6 space-y-6">
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-semibold">Version Actions</h3>
              <p className="text-sm text-slate-500">Manage artifact {activeVersion.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-2"/> Preview</Button>
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2"/> Download</Button>
              {activeVersion.isCurrent ? (
                <Button variant="outline" size="sm" disabled className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 cursor-default opacity-100 border-none">
                  ✓ Current Deployment
                </Button>
              ) : (
                <Button size="sm">Promote Version</Button>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Changes from Parent ({activeVersion.parent})</h3>
            <GroupedDiffViewer diffs={activeVersion.diffs} />
          </div>
        </div>

      </div>
    </div>
  );
}
