import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/ui/Card';
import { StatusChip, SyncStatus } from '../../../shared/ui/StatusChip';
import { Button } from '../../../shared/ui/Button';
import { GitBranch, Plus, FileText, Activity } from 'lucide-react';

// Mock data based on the user's wireframe
const branches = [
  {
    id: 'ai-engineer',
    name: 'AI Engineer',
    status: 'synced' as SyncStatus,
    resumeVersion: 'v8',
    sessionsCount: 12,
    missingEvents: 0,
  },
  {
    id: 'backend-engineer',
    name: 'Backend Engineer',
    status: 'behind' as SyncStatus,
    resumeVersion: 'v6',
    sessionsCount: 4,
    missingEvents: 2,
  },
  {
    id: 'data-engineer',
    name: 'Data Engineer',
    status: 'synced' as SyncStatus,
    resumeVersion: 'v4',
    sessionsCount: 7,
    missingEvents: 0,
  }
];

export function Dashboard() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">ReviveCV</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Branch
        </Button>
      </div>

      {/* Career Profile Summary */}
      <Card className="bg-slate-50 dark:bg-slate-900/50">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-slate-200 p-3 dark:bg-slate-800">
              <Activity className="h-6 w-6 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Career Profile</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Version 15 • 128 Events • Last Updated Today
              </p>
            </div>
          </div>
          <div className="flex gap-8 text-center">
            <div>
              <div className="text-2xl font-bold">{branches.length}</div>
              <div className="text-sm text-slate-500">Branches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                {branches.filter(b => b.status === 'behind').length}
              </div>
              <div className="text-sm text-slate-500">Need Sync</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branches List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">Your Workspaces</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {branches.map(branch => (
            <Card key={branch.id} className="transition-all hover:shadow-md cursor-pointer">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-slate-500" />
                  <CardTitle className="text-xl">{branch.name}</CardTitle>
                </div>
                <StatusChip status={branch.status} />
              </CardHeader>
              <CardContent>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Resume {branch.resumeVersion}
                    </span>
                    <span>{branch.sessionsCount} Sessions</span>
                  </div>
                  
                  {branch.status === 'behind' && (
                    <Button variant="outline" size="sm" className="h-8">
                      Review Sync ({branch.missingEvents})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
