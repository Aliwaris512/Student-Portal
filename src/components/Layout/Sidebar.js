import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  HomeIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  BookOpenIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const getNavigation = (userRole) => {
  switch (userRole) {
    case 'admin':
      return [
        { name: 'Dashboard', href: '/', icon: HomeIcon },
        { name: 'User Management', href: '/users', icon: UserIcon },
        { name: 'Departments', href: '/departments', icon: AcademicCapIcon },
        { name: 'Courses', href: '/courses', icon: AcademicCapIcon }, // CourseManagement for admin
        { name: 'Announcements', href: '/announcements', icon: DocumentTextIcon },
        { name: 'System Monitoring', href: '/monitoring', icon: ChartBarIcon },
        { name: 'Profile', href: '/profile', icon: UserIcon },
      ];
    case 'teacher':
      return [
        { name: 'Dashboard', href: '/', icon: HomeIcon },
        { name: 'Courses', href: '/courses', icon: AcademicCapIcon }, // TeacherCourses for teacher
        { name: 'Assignments', href: '/assignments', icon: DocumentTextIcon },
        { name: 'Grades', href: '/grades', icon: ChartBarIcon },
        { name: 'Attendance', href: '/attendance', icon: CalendarIcon },
        { name: 'Course Materials', href: '/materials', icon: BookOpenIcon },
        { name: 'Exams', href: '/exams', icon: DocumentTextIcon },
        { name: 'Profile', href: '/profile', icon: UserIcon },
      ];
    case 'student':
    default:
      return [
        { name: 'Dashboard', href: '/', icon: HomeIcon },
        { name: 'Courses', href: '/courses', icon: AcademicCapIcon }, // StudentCourses for student
        { name: 'Assignments', href: '/assignments', icon: DocumentTextIcon },
        { name: 'Grades', href: '/grades', icon: ChartBarIcon },
        { name: 'Schedule', href: '/schedule', icon: CalendarIcon },
        { name: 'Library', href: '/library', icon: BookOpenIcon },
        { name: 'Financial', href: '/financial', icon: CreditCardIcon },
        { name: 'Profile', href: '/profile', icon: UserIcon },
      ];
  }
};

const Sidebar = ({ open, setOpen }) => {
  const { user, logout } = useAuth();
  const navigation = getNavigation(user?.role);

  return (
    <>
      {/* Mobile sidebar */}
      <Dialog as="div" className="relative z-50 lg:hidden" open={open} onClose={setOpen}>
        <div className="fixed inset-0 bg-gray-900/80" />
        
        <div className="fixed inset-0 flex">
          <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" className="-m-2.5 p-2.5" onClick={() => setOpen(false)}>
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <h1 className="text-xl font-bold text-gradient">Student Portal</h1>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul  className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul  className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <NavLink
                            to={item.href}
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? 'active' : ''}`
                            }
                            onClick={() => setOpen(false)}
                          >
                            <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-gradient">Student Portal</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul  className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul  className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `sidebar-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center px-4 py-2">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user?.avatar}
                      alt=""
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.studentId}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="sidebar-link w-full justify-start"
                  >
                    <span>Sign out</span>
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 