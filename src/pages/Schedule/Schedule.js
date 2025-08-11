import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import {
  ClockIcon,
  MapPinIcon,
  UserIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:8000/api/v1/schedule', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setClasses(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error('Failed to load schedule');
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const getClassesForDay = (date) => {
    const dayName = format(date, 'EEEE');
    return classes.filter(cls => cls.days.includes(dayName));
  };

  const getClassesForTimeSlot = (date, timeSlot) => {
    const dayClasses = getClassesForDay(date);
    return dayClasses.filter(cls => {
      const startHour = parseInt(cls.startTime.split(':')[0]);
      const timeHour = parseInt(timeSlot.split(':')[0]);
      return startHour === timeHour;
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const navigateWeek = (direction) => {
    setCurrentDate(prev => addDays(prev, direction * 7));
  };

  const todayClasses = getClassesForDay(selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Schedule</h1>
          <p className="mt-1 text-sm text-gray-500">
            View your weekly class schedule and manage your time
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <button
            onClick={() => navigateWeek(-1)}
            className="btn-secondary"
          >
            Previous Week
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="btn-primary"
          >
            Today
          </button>
          <button
            onClick={() => navigateWeek(1)}
            className="btn-secondary"
          >
            Next Week
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(weekStart, 'MMMM d')} - {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
        </h2>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          {/* Time column */}
          <div className="bg-gray-50 p-2">
            <div className="h-8"></div> {/* Header spacer */}
            {timeSlots.map((time, index) => (
              <div key={index} className="h-16 flex items-center text-xs text-gray-500 font-medium">
                {time}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-gray-50">
              {/* Day header */}
              <div className={`p-2 text-center border-b border-gray-200 ${
                isSameDay(day, new Date()) ? 'bg-primary-50' : ''
              }`}>
                <div className="text-sm font-medium text-gray-900">
                  {format(day, 'EEE')}
                </div>
                <div className={`text-xs ${
                  isSameDay(day, new Date()) ? 'text-primary-600 font-semibold' : 'text-gray-500'
                }`}>
                  {format(day, 'd')}
                </div>
              </div>

              {/* Time slots */}
              {timeSlots.map((timeSlot, timeIndex) => {
                const classesInSlot = getClassesForTimeSlot(day, timeSlot);
                return (
                  <div key={timeIndex} className="h-16 border-b border-gray-200 relative">
                    {classesInSlot.map((cls, clsIndex) => (
                      <div
                        key={clsIndex}
                        className={`absolute inset-1 rounded border-l-4 p-1 text-xs font-medium ${cls.color} cursor-pointer hover:shadow-sm transition-shadow`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="font-semibold">{cls.courseCode}</div>
                        <div className="text-xs opacity-75">{cls.room}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Schedule for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        
        {todayClasses.length > 0 ? (
          <div className="space-y-4">
            {todayClasses
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((cls) => (
                <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{cls.courseCode}</h4>
                        <span className={`badge ${cls.color.replace('bg-', 'text-').replace('-100', '-600').replace(' border-', ' bg-').replace('-300', '-50')}`}>
                          {cls.days.length} days/week
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{cls.courseName}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {cls.room}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <UserIcon className="h-4 w-4 mr-2" />
                          {cls.instructor}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <button className="btn-primary text-sm">
                        View Details
                      </button>
                      <button className="btn-secondary text-sm">
                        Materials
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No classes scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">
              Enjoy your free time or check other days for your schedule.
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Classes</h3>
          <p className="text-3xl font-bold text-primary-600">{classes.length}</p>
          <p className="text-sm text-gray-500 mt-1">This semester</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Weekly Hours</h3>
          <p className="text-3xl font-bold text-success-600">18</p>
          <p className="text-sm text-gray-500 mt-1">Class time</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Next Class</h3>
          <p className="text-lg font-bold text-warning-600">CS 301</p>
          <p className="text-sm text-gray-500 mt-1">Tomorrow 10:00 AM</p>
        </div>
      </div>
    </div>
  );
};

export default Schedule; 