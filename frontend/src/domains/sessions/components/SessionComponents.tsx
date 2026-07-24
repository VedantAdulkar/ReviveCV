import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { CheckCircle2, XCircle, AlertTriangle, Plus, Minus } from 'lucide-react';
import { cn } from '../../../shared/lib/utils';

export function SessionHeader({ session }: { session: any }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className="text-xs uppercase tracking-wider">{session.type}</Badge>
          <span className="text-sm font-medium text-slate-500">Session #{session.id}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{session.title}</h1>
        <p className="text-slate-500 mt-1">{session.subtitle}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-slate-500 mb-1">Status</p>
        <div className="flex items-center justify-end gap-2 text-amber-600 dark:text-amber-500">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Pending Review</span>
        </div>
      </div>
    </div>
  );
}

export function ProgressSummary({ stats }: { stats: any }) {
  const percent = Math.round((stats.approved + stats.rejected) / stats.total * 100);
  return (
    <Card className="p-4 bg-slate-50 dark:bg-slate-900/50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Review Progress</h3>
        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{percent}%</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percent}%` }} />
      </div>
      <div className="flex justify-between text-xs font-medium">
        <div className="flex items-center gap-1 text-green-600 dark:text-green-500">
          <CheckCircle2 className="h-3 w-3" /> {stats.approved} Approved
        </div>
        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500">
          <AlertTriangle className="h-3 w-3" /> {stats.pending} Pending
        </div>
        <div className="flex items-center gap-1 text-red-600 dark:text-red-500">
          <XCircle className="h-3 w-3" /> {stats.rejected} Rejected
        </div>
      </div>
    </Card>
  );
}

export function RecommendationCategoryList({ categories, activeCategory, onSelect }: { categories: any[], activeCategory: string, onSelect: (c: string) => void }) {
  return (
    <div className="space-y-1">
      {categories.map(c => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
            activeCategory === c.id 
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium" 
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
          )}
        >
          <span>{c.label}</span>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            activeCategory === c.id ? "bg-slate-800 text-slate-100 dark:bg-slate-200 dark:text-slate-800" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          )}>
            {c.count}
          </span>
        </button>
      ))}
    </div>
  );
}

export function DiffViewer({ oldText, newText }: { oldText: string, newText: string }) {
  return (
    <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden font-mono text-sm">
      <div className="bg-red-50 dark:bg-red-950/20 p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3 text-red-800 dark:text-red-300">
          <Minus className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="whitespace-pre-wrap">{oldText}</p>
        </div>
      </div>
      <div className="bg-green-50 dark:bg-green-950/20 p-4">
        <div className="flex items-start gap-3 text-green-800 dark:text-green-300">
          <Plus className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="whitespace-pre-wrap">{newText}</p>
        </div>
      </div>
    </div>
  );
}

export function ReasoningPanel({ suggestion }: { suggestion: any }) {
  return (
    <Card className="p-5 space-y-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">AI Reasoning</h3>
        <ul className="space-y-2">
          {suggestion.reasoning.map((r: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {suggestion.referencedEvents && suggestion.referencedEvents.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Referenced Events</h3>
          <div className="flex flex-wrap gap-2">
            {suggestion.referencedEvents.map((e: string) => (
              <Badge key={e} variant="outline" className="font-mono">{e}</Badge>
            ))}
          </div>
        </div>
      )}

      {suggestion.referencedProjects && suggestion.referencedProjects.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Referenced Projects</h3>
          <div className="flex flex-wrap gap-2">
            {suggestion.referencedProjects.map((p: string) => (
              <Badge key={p} variant="secondary">{p}</Badge>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Confidence</h3>
        <Badge variant={suggestion.confidence === 'High' ? 'default' : 'secondary'} className={cn(
          suggestion.confidence === 'High' ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : ""
        )}>
          {suggestion.confidence} Match
        </Badge>
      </div>
    </Card>
  );
}

export function DecisionPanel({ suggestion, onAccept, onReject }: { suggestion: any, onAccept: () => void, onReject: () => void }) {
  return (
    <div className="flex items-center gap-3 mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
      <div className="flex-1">
        {suggestion.status === 'pending' && (
          <p className="text-sm font-medium text-amber-600 dark:text-amber-500">Awaiting Decision</p>
        )}
        {suggestion.status === 'approved' && (
          <p className="text-sm font-medium text-green-600 dark:text-green-500 flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Approved</p>
        )}
        {suggestion.status === 'rejected' && (
          <p className="text-sm font-medium text-red-600 dark:text-red-500 flex items-center gap-1"><XCircle className="h-4 w-4"/> Rejected</p>
        )}
      </div>
      <Button 
        variant="outline" 
        className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/50"
        onClick={onReject}
        disabled={suggestion.status !== 'pending'}
      >
        <XCircle className="h-4 w-4 mr-2" />
        Reject
      </Button>
      <Button 
        className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
        onClick={onAccept}
        disabled={suggestion.status !== 'pending'}
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Accept
      </Button>
    </div>
  );
}

export function SessionFooter({ readyToCommit, onCreateVersion }: { readyToCommit: boolean, onCreateVersion: () => void }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6 mt-8">
      <p className="text-sm text-slate-500">
        Review all pending recommendations before creating a new Resume Version.
      </p>
      <Button disabled={!readyToCommit} onClick={onCreateVersion} size="lg">
        Create Resume Version
      </Button>
    </div>
  );
}
