import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { User, Briefcase, GraduationCap, Wrench, Plus, ChevronRight } from 'lucide-react';

const mockProfile = {
  name: "John Doe",
  title: "AI & Backend Engineer",
  experience: [
    { id: 'exp_1', role: 'Software Engineer', company: 'Google', period: '2023 - Present' },
    { id: 'exp_2', role: 'Backend Engineer', company: 'Startup Inc', period: '2020 - 2023' },
  ],
  projects: [
    { id: 'proj_1', name: 'ReviveCV', description: 'Event-driven professional identity VCS' },
    { id: 'proj_2', name: 'RAG Pipeline', description: 'Document retrieval with Qwen3' },
  ],
  skills: ['Python', 'TypeScript', 'React', 'FastAPI', 'LLMs', 'Event Sourcing'],
  events: [
    { id: 'EVT-103', type: 'PROJECT_ADDED', target: 'ReviveCV', date: '2 days ago' },
    { id: 'EVT-102', type: 'SKILL_ADDED', target: 'FastAPI', date: '5 days ago' },
    { id: 'EVT-101', type: 'EXPERIENCE_UPDATED', target: 'Google', date: '1 month ago' },
  ]
};

export function CareerProfile() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-slate-500">
        <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Career Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-900 dark:text-slate-100">Career Profile Knowledge Base</span>
      </nav>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <User className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Career Profile</h1>
            <p className="text-slate-500">Single source of truth for your professional history.</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Career Event
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Content Area (Snapshot) */}
        <div className="space-y-6 md:col-span-2">
          
          <h2 className="text-xl font-semibold tracking-tight border-b border-slate-200 dark:border-slate-800 pb-2">Materialized Snapshot</h2>

          {/* Experience */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Briefcase className="h-5 w-5" />
              <h3 className="text-lg font-medium">Experience</h3>
            </div>
            <Card>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {mockProfile.experience.map(exp => (
                  <div key={exp.id} className="p-4">
                    <p className="font-medium">{exp.role} <span className="text-slate-400 mx-1">at</span> {exp.company}</p>
                    <p className="text-sm text-slate-500">{exp.period}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Projects */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Wrench className="h-5 w-5" />
              <h3 className="text-lg font-medium">Projects</h3>
            </div>
            <Card>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {mockProfile.projects.map(proj => (
                  <div key={proj.id} className="p-4">
                    <p className="font-medium">{proj.name}</p>
                    <p className="text-sm text-slate-500">{proj.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Skills */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <GraduationCap className="h-5 w-5" />
              <h3 className="text-lg font-medium">Skills & Competencies</h3>
            </div>
            <Card className="p-4 flex flex-wrap gap-2">
              {mockProfile.skills.map(skill => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </Card>
          </section>

        </div>

        {/* Sidebar (Event Timeline) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h2 className="text-xl font-semibold tracking-tight">Event Timeline</h2>
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => navigate('/evolution')}>View All</Button>
          </div>
          
          <div className="space-y-6 pl-2">
            {mockProfile.events.map((evt, i) => (
              <div key={evt.id} className="relative pl-6">
                {/* Timeline line */}
                {i !== mockProfile.events.length - 1 && (
                  <div className="absolute left-[7px] top-4 bottom-[-24px] w-px bg-slate-200 dark:bg-slate-800" />
                )}
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-4 border-white bg-blue-500 dark:border-slate-950 dark:bg-blue-600" />
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-blue-600 dark:text-blue-400">{evt.id}</span>
                    <span className="text-xs text-slate-500">{evt.date}</span>
                  </div>
                  <p className="text-xs font-semibold mt-1 uppercase tracking-wider text-slate-700 dark:text-slate-300">{evt.type}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{evt.target}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
