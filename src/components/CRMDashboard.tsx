'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useCRM } from '@/lib/crm-context';
import { CustomerStatus, ProjectStatus, ProjectType, Department } from '@/types/crm';

export const CRMDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { customers, projects, teamMembers, stats } = useCRM();
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'projects' | 'team'>('overview');

  const getStatusColor = (status: CustomerStatus | ProjectStatus) => {
    switch (status) {
      case CustomerStatus.ACTIVE:
      case ProjectStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case CustomerStatus.INACTIVE:
      case ProjectStatus.ON_HOLD:
        return 'bg-red-100 text-red-800';
      case CustomerStatus.PROSPECT:
      case ProjectStatus.PLANNING:
        return 'bg-yellow-100 text-yellow-800';
      case CustomerStatus.LEAD:
      case ProjectStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case ProjectStatus.REVIEW:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectTypeIcon = (type: ProjectType) => {
    switch (type) {
      case ProjectType.OFFLINE:
        return '📄';
      case ProjectType.ONLINE:
        return '🌐';
      case ProjectType.STRATEGY:
        return '🎯';
      case ProjectType.BRANDING:
        return '🎨';
      case ProjectType.WEBSITE:
        return '💻';
      case ProjectType.SOCIAL_MEDIA:
        return '📱';
      case ProjectType.PRINT:
        return '🖨️';
      case ProjectType.SIGNAGE:
        return '🚪';
      default:
        return '📋';
    }
  };

  const getDepartmentColor = (department: Department) => {
    switch (department) {
      case Department.BUITENDIENST:
        return 'bg-blue-100 text-blue-800';
      case Department.STUDIO:
        return 'bg-purple-100 text-purple-800';
      case Department.ADMINISTRATIE_PLANNING:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-white">Vanhaaster CRM</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Welkom, <span className="font-semibold text-white">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overzicht' },
              { id: 'customers', name: 'Klanten' },
              { id: 'projects', name: 'Projecten' },
              { id: 'team', name: 'Team' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-gray-300 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">👥</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">Totaal Klanten</dt>
                          <dd className="text-lg font-medium text-white">{stats.totalCustomers}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">✅</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">Actieve Klanten</dt>
                          <dd className="text-lg font-medium text-white">{stats.activeCustomers}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">📋</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">Totaal Projecten</dt>
                          <dd className="text-lg font-medium text-white">{stats.totalProjects}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">💰</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">Omzet</dt>
                          <dd className="text-lg font-medium text-white">€{stats.revenue.toLocaleString()}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Customers */}
              <div className="bg-gray-800 shadow-lg rounded-lg border border-gray-700">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-white mb-4">
                    Recente Klanten
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Klant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Toegewezen aan
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Laatste update
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {customers.slice(0, 5).map((customer) => (
                          <tr key={customer.id} className="hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-white">{customer.name}</div>
                                <div className="text-sm text-gray-400">{customer.company}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                                {customer.status === CustomerStatus.ACTIVE ? 'Actief' :
                                 customer.status === CustomerStatus.INACTIVE ? 'Inactief' :
                                 customer.status === CustomerStatus.PROSPECT ? 'Prospect' : 'Lead'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {customer.assignedTo.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {customer.updatedAt.toLocaleDateString('nl-NL')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="bg-gray-800 shadow-lg rounded-lg border border-gray-700">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-white">
                    Alle Klanten
                  </h3>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                    + Nieuwe Klant
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Klant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Toegewezen aan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Acties
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                              {customers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-white">{customer.name}</div>
                                <div className="text-sm text-gray-400">{customer.company}</div>
                                <div className="text-sm text-gray-400">{customer.industry}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{customer.email}</div>
                              <div className="text-sm text-gray-400">{customer.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                                {customer.status === CustomerStatus.ACTIVE ? 'Actief' :
                                 customer.status === CustomerStatus.INACTIVE ? 'Inactief' :
                                 customer.status === CustomerStatus.PROSPECT ? 'Prospect' : 'Lead'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{customer.assignedTo.name}</div>
                              <div className="text-sm text-gray-400">{customer.assignedTo.role}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-gray-300 hover:text-white mr-3">Bekijk</button>
                              <button className="text-gray-300 hover:text-white">Bewerk</button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="bg-gray-800 shadow-lg rounded-lg border border-gray-700">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-white">
                    Alle Projecten
                  </h3>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                    + Nieuw Project
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Budget
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Toegewezen aan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                              {projects.map((project) => (
                          <tr key={project.id} className="hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-white">{project.name}</div>
                                <div className="text-sm text-gray-400">{project.description}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="mr-2">{getProjectTypeIcon(project.type)}</span>
                                <span className="text-sm text-white">
                                  {project.type === ProjectType.OFFLINE ? 'Offline' :
                                   project.type === ProjectType.ONLINE ? 'Online' :
                                   project.type === ProjectType.STRATEGY ? 'Strategie' :
                                   project.type === ProjectType.BRANDING ? 'Branding' :
                                   project.type === ProjectType.WEBSITE ? 'Website' :
                                   project.type === ProjectType.SOCIAL_MEDIA ? 'Social Media' :
                                   project.type === ProjectType.PRINT ? 'Print' : 'Signage'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                {project.status === ProjectStatus.PLANNING ? 'Planning' :
                                 project.status === ProjectStatus.IN_PROGRESS ? 'In Uitvoering' :
                                 project.status === ProjectStatus.REVIEW ? 'Review' :
                                 project.status === ProjectStatus.COMPLETED ? 'Voltooid' : 'On Hold'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              €{project.budget.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{project.assignedTo.name}</div>
                              <div className="text-sm text-gray-400">{project.assignedTo.role}</div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="bg-gray-800 shadow-lg rounded-lg border border-gray-700">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-white mb-4">
                  Team Overzicht
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-gray-300 font-semibold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-white">{member.name}</h4>
                          <p className="text-sm text-gray-400">{member.role}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-300">
                          <span className="mr-2">📧</span>
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="flex items-center text-sm text-gray-300">
                            <span className="mr-2">📞</span>
                            {member.phone}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-300">
                          <span className="mr-2">🏢</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(member.department)}`}>
                            {member.department === Department.BUITENDIENST ? 'Buitendienst' :
                             member.department === Department.STUDIO ? 'Studio' : 'Administratie & Planning'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
