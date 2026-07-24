import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  SessionHeader,
  ProgressSummary,
  RecommendationCategoryList,
  DiffViewer,
  ReasoningPanel,
  DecisionPanel,
  SessionFooter
} from '../components/SessionComponents';

// Mock Session Data
const mockSession = {
  id: '18',
  title: 'Google Software Engineer',
  subtitle: 'JOB_OPTIMIZATION',
  type: 'Optimization',
  status: 'Pending Review',
};

// Mock Recommendations Data
const initialRecommendations = [
  {
    id: 'rec_1',
    category: 'summary',
    action: 'Rewrite Summary',
    oldText: 'Experienced Software Engineer with a background in web development.',
    newText: 'Experienced AI Engineer specializing in MCP, Multi-Agent Systems, and RAG architectures.',
    reasoning: [
      'The JD heavily prioritizes MCP and LangGraph.',
      'Highlights backend architecture experience.'
    ],
    referencedEvents: ['EVT-202', 'EVT-204'],
    referencedProjects: ['ReviveCV', 'Unisearch'],
    confidence: 'High',
    status: 'pending' // pending, approved, rejected
  },
  {
    id: 'rec_2',
    category: 'projects',
    action: 'Promote Project',
    oldText: 'Various minor IoT projects.',
    newText: 'ReviveCV: Event-driven Professional Identity VCS built with FastAPI and React.',
    reasoning: [
      'Aligns with the Branch Strategy "Projects First".',
      'Demonstrates full-stack capability required by JD.'
    ],
    referencedEvents: ['EVT-103'],
    referencedProjects: ['ReviveCV'],
    confidence: 'High',
    status: 'pending'
  },
  {
    id: 'rec_3',
    category: 'skills',
    action: 'Add Skill',
    oldText: 'JavaScript, HTML, CSS',
    newText: 'Python, FastAPI, LangChain, React, TypeScript',
    reasoning: [
      'JD explicitly lists Python and FastAPI as hard requirements.'
    ],
    referencedEvents: ['EVT-102'],
    referencedProjects: [],
    confidence: 'High',
    status: 'pending'
  }
];

export function SessionReview() {
  const navigate = useNavigate();
  
  // State
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [activeCategory, setActiveCategory] = useState('summary');

  // Derived State
  const stats = useMemo(() => {
    return {
      total: recommendations.length,
      approved: recommendations.filter(r => r.status === 'approved').length,
      rejected: recommendations.filter(r => r.status === 'rejected').length,
      pending: recommendations.filter(r => r.status === 'pending').length,
    };
  }, [recommendations]);

  const categories = [
    { id: 'summary', label: 'Summary', count: recommendations.filter(r => r.category === 'summary').length },
    { id: 'projects', label: 'Projects', count: recommendations.filter(r => r.category === 'projects').length },
    { id: 'experience', label: 'Experience', count: recommendations.filter(r => r.category === 'experience').length },
    { id: 'skills', label: 'Skills', count: recommendations.filter(r => r.category === 'skills').length },
  ].filter(c => c.count > 0);

  const activeRecommendations = recommendations.filter(r => r.category === activeCategory);
  
  // Actions
  const handleDecision = (recId: string, decision: 'approved' | 'rejected') => {
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: decision } : r));
  };

  const handleCreateVersion = () => {
    // In a real app: POST /branches/{id}/versions with approved suggestions
    alert('Resume Version Created successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-8">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-slate-500">
        <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Career Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/branches/ai-engineer" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">AI Engineer Workspace</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-900 dark:text-slate-100">Review Session</span>
      </nav>

      <SessionHeader session={mockSession} />

      {/* 3-Column PR-Style Layout */}
      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Categories Sidebar */}
        <div className="col-span-12 md:col-span-3 lg:col-span-2 space-y-6">
          <ProgressSummary stats={stats} />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 ml-2">Categories</h3>
            <RecommendationCategoryList 
              categories={categories} 
              activeCategory={activeCategory} 
              onSelect={setActiveCategory} 
            />
          </div>
        </div>

        {/* Middle + Right Columns: Recommendations */}
        <div className="col-span-12 md:col-span-9 lg:col-span-10 space-y-12">
          {activeRecommendations.map(rec => (
            <div key={rec.id} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Middle Column: Diff Viewer & Action */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{rec.action}</h3>
                </div>
                
                <DiffViewer oldText={rec.oldText} newText={rec.newText} />
                
                <DecisionPanel 
                  suggestion={rec} 
                  onAccept={() => handleDecision(rec.id, 'approved')} 
                  onReject={() => handleDecision(rec.id, 'rejected')} 
                />
              </div>

              {/* Right Column: AI Reasoning */}
              <div className="lg:col-span-1">
                <ReasoningPanel suggestion={rec} />
              </div>
              
            </div>
          ))}
          
          {activeRecommendations.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No recommendations in this category.
            </div>
          )}
        </div>
      </div>

      <SessionFooter 
        readyToCommit={stats.pending === 0} 
        onCreateVersion={handleCreateVersion} 
      />

    </div>
  );
}
