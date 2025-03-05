// app/institute/tickets/client.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock } from 'lucide-react';
import { bulkUpdateUrgencies } from './actions';

interface StudentRequestsClientProps {
  initialRecords: any[];
  studentDetails: any[];
}

// Helper function to calculate days passed
const getDaysPassed = (requestDate: string) => {
  const now = new Date();
  const request = new Date(requestDate);
  return Math.floor((now.getTime() - request.getTime()) / (1000 * 60 * 60 * 24));
};

// Priority calculation helper
const calculatePriority = (record: any, studentDetails: any[], daysPassed: number) => {
  const student = studentDetails.find(s => s.reg_no === record.student_reg_no);
  
  if (!student) return { level: 5, urgency: 'normal' };
  
  // Priority 1: Fourth year students
  if (student.year_of_study === 4) {
    return { level: 1, urgency: 'critical' };
  }
  
  // Priority 2: Year down students
  if (student.pending_requests > student.total_requests) {
    return { level: 2, urgency: 'high' };
  }
  
  // Priority 3: Current marks < 35
  if (record.current_marks < 35) {
    return { level: 3, urgency: 'medium' };
  }

  // Priority 4: Third year, semester 2 students
  if (student.year_of_study === 3 && student.semester === 2) {
    return { level: 4, urgency: 'moderate' };
  }
  
  // Priority 5: All other cases
  return { level: 5, urgency: 'normal' };
};

const PriorityBadge = ({ priority }: { priority: { urgency: string } }) => {
  const colors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    moderate: 'bg-green-500',
    normal: 'bg-blue-500'
  };

  return (
    <Badge className={`${colors[priority.urgency as keyof typeof colors]} text-white`}>
      <AlertCircle className="w-4 h-4 mr-1" />
      {priority.urgency.charAt(0).toUpperCase() + priority.urgency.slice(1)}
    </Badge>
  );
};

export function StudentRequestsClient({ initialRecords, studentDetails }: StudentRequestsClientProps) {
  const [selectedDay, setSelectedDay] = useState('all');
  const [records, setRecords] = useState(initialRecords);
  const [isUpdating, setIsUpdating] = useState(false);

  // Effect to update urgencies in the database
  useEffect(() => {
    const updateUrgencies = async () => {
      setIsUpdating(true);
      
      const updates = records.map(record => {
        const priority = calculatePriority(record, studentDetails, getDaysPassed(record.request_date));
        return {
          id: record.id,
          urgency: priority.urgency
        };
      });

      const result = await bulkUpdateUrgencies(updates);
      
      if (!result.success) {
        console.error('Failed to update urgencies:', result.error);
      }
      
      setIsUpdating(false);
    };

    updateUrgencies();
  }, [records, studentDetails]);

  const getFilteredRecords = () => {
    return records
      .map(record => {
        const daysPassed = getDaysPassed(record.request_date);
        const priority = calculatePriority(record, studentDetails, daysPassed);
        return { ...record, priority, daysPassed };
      })
      .filter(record => {
        if (selectedDay === 'all') return true;
        const days = parseInt(selectedDay.replace('day', ''));
        return record.daysPassed === days - 1;
      })
      .sort((a, b) => a.priority.level - b.priority.level);
  };

  const filteredRecords = getFilteredRecords();

  return (
    <div className="container mx-auto py-10">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Student Reevaluation Requests</h1>
            {isUpdating && (
              <p className="text-sm text-blue-500">Updating priorities...</p>
            )}
            <div className="text-sm text-gray-500 space-y-1">
              <p>Priority Levels:</p>
              <ul className="list-disc pl-5">
                <li>Level 1 (Critical): Fourth year students</li>
                <li>Level 2 (High): Year down students</li>
                <li>Level 3 (Medium): Students with marks below 35</li>
                <li>Level 4 (Moderate): Third year, semester 2 students</li>
                <li>Level 5 (Normal): All other cases</li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="w-5 h-5" />
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                <SelectItem value="day1">Day 1</SelectItem>
                <SelectItem value="day2">Day 2</SelectItem>
                <SelectItem value="day3">Day 3</SelectItem>
                <SelectItem value="day4">Day 4</SelectItem>
                <SelectItem value="day5">Day 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Priority</th>
                <th className="py-2 px-4 border-b">Student Reg No</th>
                <th className="py-2 px-4 border-b">Subject</th>
                <th className="py-2 px-4 border-b">Current Marks</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Evaluator ID</th>
                <th className="py-2 px-4 border-b">Updated Marks</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <PriorityBadge priority={record.priority} />
                  </td>
                  <td className="py-2 px-4 border-b text-center">{record.student_reg_no}</td>
                  <td className="py-2 px-4 border-b text-center">{record.subject_name}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <span className={record.current_marks < 35 ? 'text-red-500 font-semibold' : ''}>
                      {record.current_marks}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b text-center">{record.status}</td>
                  <td className="py-2 px-4 border-b text-center">{record.evaluator_reg_no}</td>
                  <td className="py-2 px-4 border-b text-center">{record.updated_marks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}