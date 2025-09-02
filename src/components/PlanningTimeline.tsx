'use client';

import React, { useState } from 'react';

interface PlanningActivity {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  type: 'project' | 'meeting' | 'break' | 'client';
  assignedTo: string;
  color: string;
}

interface PlanningTimelineProps {
  className?: string;
}

export const PlanningTimeline: React.FC<PlanningTimelineProps> = ({ className = '' }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Generate time slots from 08:00 to 18:00
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Sample activities for the day
  const dailyActivities: PlanningActivity[] = [
    {
      id: '1',
      title: 'Team Standup',
      description: 'Dagelijkse standup meeting',
      startTime: '08:00',
      endTime: '08:30',
      type: 'meeting',
      assignedTo: 'Team',
      color: '#E2017A'
    },
    {
      id: '2',
      title: 'Keukenhof Project',
      description: 'Logo redesign en website concept',
      startTime: '08:30',
      endTime: '11:00',
      type: 'project',
      assignedTo: 'Lisa de Vries',
      color: '#E2017A'
    },
    {
      id: '3',
      title: 'Lunch Break',
      description: 'Pauze',
      startTime: '11:00',
      endTime: '12:00',
      type: 'break',
      assignedTo: 'Team',
      color: '#666666'
    },
    {
      id: '4',
      title: 'Wildlands Meeting',
      description: 'Projectbespreking signage',
      startTime: '12:00',
      endTime: '13:00',
      type: 'meeting',
      assignedTo: 'Ron Stoel',
      color: '#E2017A'
    },
    {
      id: '5',
      title: 'Educatieve Bebording',
      description: 'Design en productie',
      startTime: '13:00',
      endTime: '15:30',
      type: 'project',
      assignedTo: 'Mark Jansen',
      color: '#E2017A'
    },
    {
      id: '6',
      title: 'Client Call',
      description: 'Keukenhof feedback sessie',
      startTime: '15:30',
      endTime: '16:00',
      type: 'client',
      assignedTo: 'Ron Stoel',
      color: '#E2017A'
    },
    {
      id: '7',
      title: 'Project Planning',
      description: 'Volgende week voorbereiden',
      startTime: '16:00',
      endTime: '17:30',
      type: 'project',
      assignedTo: 'Team',
      color: '#E2017A'
    },
    {
      id: '8',
      title: 'Dag Afsluiting',
      description: 'Dagelijkse afsluiting',
      startTime: '17:30',
      endTime: '18:00',
      type: 'meeting',
      assignedTo: 'Team',
      color: '#E2017A'
    }
  ];

  const getActivityPosition = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);
    
    const startMinutes = (startHour - 8) * 60 + startMinute;
    const endMinutes = (endHour - 8) * 60 + endMinute;
    
    const top = (startMinutes / 600) * 100; // 600 minutes = 10 hours (08:00-18:00)
    const height = ((endMinutes - startMinutes) / 600) * 100;
    
    return { top: `${top}%`, height: `${height}%` };
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'project':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'client':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'break':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-black/40 rounded-lg border border-gray-700 p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Dagelijkse Planning</h3>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#111111]/50 border border-[#E2017A]/30 text-white px-3 py-2 rounded-md text-sm"
          />
          <button className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            + Activiteit
          </button>
        </div>
      </div>

      {/* Timeline Header */}
      <div className="flex mb-4">
        <div className="w-24 flex-shrink-0"></div>
        <div className="flex-1 grid grid-cols-11 gap-1">
          {timeSlots.map((time) => (
            <div key={time} className="text-center text-xs text-[#E2017A] font-medium">
              {time}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="relative">
        {/* Time Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-11 gap-1">
          {timeSlots.map((_, index) => (
            <div key={index} className="border-l border-[#E2017A]/20 h-full"></div>
          ))}
        </div>

        {/* Hour Grid Lines */}
        <div className="absolute inset-0">
          {timeSlots.map((_, index) => (
            <div 
              key={index} 
              className="absolute w-full border-t border-[#E2017A]/10"
              style={{ top: `${(index / 10) * 100}%` }}
            ></div>
          ))}
        </div>

        {/* Activities */}
        {dailyActivities.map((activity) => {
          const position = getActivityPosition(activity.startTime, activity.endTime);
          return (
            <div
              key={activity.id}
              className="absolute left-0 right-0 mx-2 rounded-lg border border-[#E2017A]/30 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              style={{
                top: position.top,
                height: position.height,
                backgroundColor: `${activity.color}20`,
                borderColor: activity.color
              }}
            >
              <div className="p-2 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-[#E2017A]">
                      {getActivityTypeIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-white truncate">
                        {activity.title}
                      </h4>
                      <p className="text-xs text-[#E2017A]/70 truncate">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-[#E2017A] font-medium">
                    {activity.startTime} - {activity.endTime}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-[#E2017A]/70">
                    {activity.assignedTo}
                  </span>
                  <div className="flex space-x-1">
                    <button className="w-3 h-3 bg-[#E2017A]/30 rounded-full hover:bg-[#E2017A]/50 transition-colors"></button>
                    <button className="w-3 h-3 bg-[#E2017A]/30 rounded-full hover:bg-[#E2017A]/50 transition-colors"></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Current Time Indicator */}
        <div className="absolute left-0 right-0 mx-2">
          <div className="relative">
            <div className="absolute w-full h-0.5 bg-[#E2017A] z-10">
              <div className="absolute -left-1 -top-1 w-3 h-3 bg-[#E2017A] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-[#E2017A] rounded"></div>
          <span className="text-sm text-[#E2017A]">Projecten</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-[#E2017A] rounded"></div>
          <span className="text-sm text-[#E2017A]">Meetings</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-[#E2017A] rounded"></div>
          <span className="text-sm text-[#E2017A]">Klantgesprekken</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-600 rounded"></div>
          <span className="text-sm text-gray-400">Pauzes</span>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-[#111111]/30 rounded-lg p-4 border border-[#E2017A]/20">
                    <div className="text-sm text-[#E2017A] mb-1">Totale werktijd</div>
                    <div className="text-lg font-medium text-white">9,5 uur</div>
                  </div>
                  <div className="bg-[#111111]/30 rounded-lg p-4 border border-[#E2017A]/20">
            <div className="text-sm text-[#E2017A] mb-1">Projecten</div>
            <div className="text-lg font-medium text-white">3</div>
          </div>
                  <div className="bg-[#111111]/30 rounded-lg p-4 border border-[#E2017A]/20">
            <div className="text-sm text-[#E2017A] mb-1">Meetings</div>
            <div className="text-lg font-medium text-white">4</div>
          </div>
      </div>
    </div>
  );
};
