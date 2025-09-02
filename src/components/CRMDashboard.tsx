'use client';

import React, { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { useCRM } from '../lib/crm-context';



interface Lead {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  lastContact: string;
  nextAction: string;
  assignedTo: string;
}

interface PipelineStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  negotiation: number;
  won: number;
  lost: number;
  totalValue: number;
  wonValue: number;
}

export const CRMDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { customers, projects, teamMembers } = useCRM();
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'projects' | 'planning' | 'invoicing' | 'hours' | 'routes' | 'pipeline' | 'team'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);


  // Pipeline state
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Drenthe Event',
      company: 'Drenthe Marketing',
      value: 25000,
      stage: 'new',
      priority: 'high',
      lastContact: '2024-01-15',
      nextAction: 'Eerste contact leggen',
      assignedTo: 'Jan van der Berg'
    },
    {
      id: '2',
      name: 'Groningen Website',
      company: 'Groningen Tech',
      value: 15000,
      stage: 'contacted',
      priority: 'medium',
      lastContact: '2024-01-14',
      nextAction: 'Vraag specificaties op',
      assignedTo: 'Lisa de Vries'
    },
    {
      id: '3',
      name: 'Emmen Rebranding',
      company: 'Emmen Design',
      value: 35000,
      stage: 'qualified',
      priority: 'high',
      lastContact: '2024-01-13',
      nextAction: 'Proposal voorbereiden',
      assignedTo: 'Jan van der Berg'
    },
    {
      id: '4',
      name: 'Assen App',
      company: 'Assen Mobile',
      value: 45000,
      stage: 'proposal',
      priority: 'high',
      lastContact: '2024-01-12',
      nextAction: 'Presentatie plannen',
      assignedTo: 'Lisa de Vries'
    },
    {
      id: '5',
      name: 'Hoogeveen Campaign',
      company: 'Hoogeveen Media',
      value: 18000,
      stage: 'negotiation',
      priority: 'medium',
      lastContact: '2024-01-11',
      nextAction: 'Contract onderhandelen',
      assignedTo: 'Jan van der Berg'
    },
    {
      id: '6',
      name: 'Leeuwarden Event',
      company: 'Leeuwarden Events',
      value: 22000,
      stage: 'won',
      priority: 'low',
      lastContact: '2024-01-10',
      nextAction: 'Project starten',
      assignedTo: 'Lisa de Vries'
    }
  ]);

  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  // Calculate pipeline statistics
  const pipelineStats: PipelineStats = leads.reduce((stats, lead) => {
    stats.total++;
    stats[lead.stage]++;
    stats.totalValue += lead.value;
    if (lead.stage === 'won') {
      stats.wonValue += lead.value;
    }
    return stats;
  }, {
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    negotiation: 0,
    won: 0,
    lost: 0,
    totalValue: 0,
    wonValue: 0
  });

  const stages = [
    { id: 'new', name: 'Nieuwe Leads', color: 'bg-blue-500', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400' },
    { id: 'contacted', name: 'Gecontacteerd', color: 'bg-yellow-500', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400' },
    { id: 'qualified', name: 'Gekwalificeerd', color: 'bg-purple-500', bgColor: 'bg-purple-500/20', textColor: 'text-purple-400' },
    { id: 'proposal', name: 'Proposal', color: 'bg-indigo-500', bgColor: 'bg-indigo-500/20', textColor: 'text-indigo-400' },
    { id: 'negotiation', name: 'Onderhandeling', color: 'bg-orange-500', bgColor: 'bg-orange-500/20', textColor: 'text-orange-400' },
    { id: 'won', name: 'Gewonnen', color: 'bg-green-500', bgColor: 'bg-green-500/20', textColor: 'text-green-400' },
    { id: 'lost', name: 'Verloren', color: 'bg-red-500', bgColor: 'bg-red-500/20', textColor: 'text-red-400' }
  ];

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    if (draggedLead && draggedLead.stage !== targetStage) {
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === draggedLead.id 
            ? { ...lead, stage: targetStage as Lead['stage'] }
            : lead
        )
      );
    }
    setDraggedLead(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {/* Header */}
      <header className="bg-black/40 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-[#E2017A]">Vanhaaster CRM Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welkom, {user?.email}</span>
            <button
              onClick={logout}
              className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`bg-black/40 border-r border-gray-700 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
          <nav className="p-4">
            <ul className="space-y-2">
              {[
                { id: 'overview', name: 'Overzicht', icon: '📊' },
                { id: 'customers', name: 'Klanten', icon: '👥' },
                { id: 'projects', name: 'Projecten', icon: '📁' },
                { id: 'planning', name: 'Planning', icon: '📅' },
                { id: 'invoicing', name: 'Facturering', icon: '💰' },
                { id: 'hours', name: 'Uren', icon: '⏰' },
                { id: 'routes', name: 'Routes', icon: '🗺️' },
                { id: 'pipeline', name: 'Pipeline', icon: '🎯' },
                { id: 'team', name: 'Team', icon: '👨‍💼' }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id as 'overview' | 'customers' | 'projects' | 'planning' | 'invoicing' | 'hours' | 'routes' | 'pipeline' | 'team')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-[#E2017A] text-white'
                        : 'text-gray-300 hover:bg-black/20 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {sidebarOpen && <span>{item.name}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-white">Dashboard Overzicht</h1>
              
              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-[#E2017A]/20 rounded-lg">
                      <svg className="w-6 h-6 text-[#E2017A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Totaal Klanten</p>
                      <p className="text-2xl font-bold text-white">{customers.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-[#E2017A]/20 rounded-lg">
                      <svg className="w-6 h-6 text-[#E2017A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Actieve Projecten</p>
                      <p className="text-2xl font-bold text-white">{projects.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-[#E2017A]/20 rounded-lg">
                      <svg className="w-6 h-6 text-[#E2017A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Teamleden</p>
                      <p className="text-2xl font-bold text-white">{teamMembers.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-[#E2017A]/20 rounded-lg">
                      <svg className="w-6 h-6 text-[#E2017A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Pipeline Waarde</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(pipelineStats.totalValue)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
                <h2 className="text-lg font-medium text-white mb-4">Recente Activiteit</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-[#E2017A] rounded-full"></div>
                    <span className="text-gray-300">Nieuwe lead toegevoegd: Drenthe Event</span>
                    <span className="text-gray-500">2 uur geleden</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Project &quot;Website Redesign&quot; voltooid</span>
                    <span className="text-gray-500">1 dag geleden</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Nieuwe factuur gegenereerd</span>
                    <span className="text-gray-500">2 dagen geleden</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pipeline Tab */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              {/* Pipeline Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-white">Sales Pipeline</h1>
                  <p className="text-gray-400">Beheer je leads en verkoopkansen</p>
                </div>
                <button className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  + Nieuwe Lead
                </button>
              </div>

              {/* Pipeline Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">Totaal Leads</p>
                    <p className="text-2xl font-bold text-white">{pipelineStats.total}</p>
                    <p className="text-xs text-gray-500">€{formatCurrency(pipelineStats.totalValue)}</p>
                  </div>
                </div>
                <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">Gewonnen</p>
                    <p className="text-2xl font-bold text-green-400">{pipelineStats.won}</p>
                    <p className="text-xs text-gray-500">€{formatCurrency(pipelineStats.wonValue)}</p>
                  </div>
                </div>
                <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">Win Rate</p>
                    <p className="text-2xl font-bold text-[#E2017A]">
                      {pipelineStats.total > 0 ? Math.round((pipelineStats.won / pipelineStats.total) * 100) : 0}%
                    </p>
                  </div>
                </div>
                <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">Gemiddelde Deal</p>
                    <p className="text-2xl font-bold text-white">
                      €{pipelineStats.total > 0 ? Math.round(pipelineStats.totalValue / pipelineStats.total) : 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Kanban Board */}
              <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
                <div className="grid grid-cols-7 gap-4">
                  {stages.map((stage) => {
                    const stageLeads = leads.filter(lead => lead.stage === stage.id);
                    return (
                      <div key={stage.id} className="min-h-[600px]">
                        <div className={`${stage.bgColor} rounded-lg p-3 mb-4`}>
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium ${stage.textColor}`}>{stage.name}</h3>
                            <span className={`${stage.color} text-white text-xs px-2 py-1 rounded-full`}>
                              {stageLeads.length}
                            </span>
                          </div>
                        </div>
                        
                        <div
                          className="min-h-[500px] p-2 rounded-lg border-2 border-dashed border-gray-600"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, stage.id)}
                        >
                          {stageLeads.map((lead) => (
                            <div
                              key={lead.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, lead)}
                              className="bg-black/60 border border-gray-600 rounded-lg p-3 mb-3 cursor-move hover:border-[#E2017A]/50 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-white text-sm">{lead.name}</h4>
                                <div className={`w-3 h-3 ${getPriorityColor(lead.priority)} rounded-full`}></div>
                              </div>
                              <p className="text-gray-400 text-xs mb-2">{lead.company}</p>
                              <p className="text-[#E2017A] font-bold text-sm mb-2">{formatCurrency(lead.value)}</p>
                              <div className="text-gray-500 text-xs">
                                <p>Toegewezen: {lead.assignedTo}</p>
                                <p>Volgende actie: {lead.nextAction}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ... existing tabs ... */}
        </main>
      </div>
    </div>
  );
};
