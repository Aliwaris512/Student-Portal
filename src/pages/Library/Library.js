import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  BookOpenIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:8000/api/v1/library', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setResources(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error('Failed to load library resources');
        setResources([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const filters = [
    { id: 'all', name: 'All Resources' },
    { id: 'books', name: 'Books' },
    { id: 'journals', name: 'Journals' },
    { id: 'digital', name: 'Digital Resources' },
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'computer-science', name: 'Computer Science' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'literature', name: 'Literature' },
    { id: 'history', name: 'History' },
  ];

  const borrowedBooks = [
    {
      id: 1,
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '978-0262033848',
      dueDate: '2024-02-25',
      status: 'borrowed',
      category: 'computer-science',
      type: 'book',
    },
    {
      id: 2,
      title: 'Calculus: Early Transcendentals',
      author: 'James Stewart',
      isbn: '978-1285741550',
      dueDate: '2024-03-01',
      status: 'borrowed',
      category: 'mathematics',
      type: 'book',
    },
    {
      id: 3,
      title: 'The Art of Computer Programming',
      author: 'Donald E. Knuth',
      isbn: '978-0201896831',
      dueDate: '2024-02-18',
      status: 'overdue',
      category: 'computer-science',
      type: 'book',
    },
  ];

  const searchResults = [
    {
      id: 1,
      title: 'Data Structures and Algorithms in Java',
      author: 'Robert Lafore',
      isbn: '978-0133008846',
      category: 'computer-science',
      type: 'book',
      available: true,
      location: 'Main Library - Floor 2, Section CS',
      description: 'Comprehensive guide to data structures and algorithms with Java implementations.',
    },
    {
      id: 2,
      title: 'Journal of Computer Science',
      author: 'Various Authors',
      isbn: 'ISSN: 1549-3636',
      category: 'computer-science',
      type: 'journal',
      available: true,
      location: 'Digital Library',
      description: 'Peer-reviewed journal covering latest developments in computer science.',
    },
    {
      id: 3,
      title: 'Linear Algebra and Its Applications',
      author: 'Gilbert Strang',
      isbn: '978-0030105678',
      category: 'mathematics',
      type: 'book',
      available: false,
      location: 'Main Library - Floor 1, Section MATH',
      description: 'Classic textbook on linear algebra with practical applications.',
    },
  ];

  const digitalResources = [
    {
      id: 1,
      title: 'IEEE Xplore Digital Library',
      description: 'Access to IEEE journals, conferences, and standards',
      type: 'database',
      url: 'https://ieeexplore.ieee.org',
    },
    {
      id: 2,
      title: 'ACM Digital Library',
      description: 'Comprehensive collection of computing literature',
      type: 'database',
      url: 'https://dl.acm.org',
    },
    {
      id: 3,
      title: 'Springer Link',
      description: 'Scientific and technical books and journals',
      type: 'database',
      url: 'https://link.springer.com',
    },
  ];

  const filteredResults = resources.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'borrowed':
        return 'text-primary-600 bg-primary-50';
      case 'overdue':
        return 'text-danger-600 bg-danger-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const getUrgencyColor = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-danger-600';
    if (diffDays <= 1) return 'text-danger-600';
    if (diffDays <= 3) return 'text-warning-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search books, manage borrowings, and access digital resources
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary">
            <BookOpenIcon className="h-4 w-4 mr-2" />
            My Account
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Search Library Resources</h3>
        <div className="space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, ISBN, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field w-full sm:w-auto"
            >
              {filters.map((filterOption) => (
                <option key={filterOption.id} value={filterOption.id}>
                  {filterOption.name}
                </option>
              ))}
            </select>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field w-full sm:w-auto"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Borrowed Books */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Currently Borrowed</h3>
        {borrowedBooks.length > 0 ? (
          <div className="space-y-4">
            {borrowedBooks.map((book) => (
              <div key={book.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{book.title}</h4>
                      <span className={`badge ${getStatusColor(book.status)}`}>
                        {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                    <p className="text-xs text-gray-500 mb-2">ISBN: {book.isbn}</p>
                    <div className={`text-sm font-medium ${getUrgencyColor(book.dueDate)}`}>
                      {getDaysUntilDue(book.dueDate)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <button className="btn-primary text-sm">
                      Renew
                    </button>
                    <button className="btn-secondary text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No borrowed books</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start exploring the library to borrow books.
            </p>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Search Results ({filteredResults.length})
          </h3>
          {filteredResults.length > 0 ? (
            <div className="space-y-4">
              {filteredResults.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                        <span className={`badge ${item.available ? 'badge-success' : 'badge-danger'}`}>
                          {item.available ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">by {item.author}</p>
                      <p className="text-xs text-gray-500 mb-2">ISBN: {item.isbn}</p>
                      <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                      <p className="text-sm text-gray-600">Location: {item.location}</p>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      {item.available ? (
                        <button className="btn-primary text-sm">
                          Borrow
                        </button>
                      ) : (
                        <button className="btn-secondary text-sm">
                          Place Hold
                        </button>
                      )}
                      <button className="btn-secondary text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Digital Resources */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Digital Resources</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {digitalResources.map((resource) => (
            <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <DocumentTextIcon className="h-6 w-6 text-primary-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{resource.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    Access Resource →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Library Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Books Borrowed</h3>
          <p className="text-3xl font-bold text-primary-600">{borrowedBooks.length}</p>
          <p className="text-sm text-gray-500 mt-1">Currently</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Overdue</h3>
          <p className="text-3xl font-bold text-danger-600">
            {borrowedBooks.filter(book => book.status === 'overdue').length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Items</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Fines</h3>
          <p className="text-3xl font-bold text-warning-600">$0.00</p>
          <p className="text-sm text-gray-500 mt-1">Current balance</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Digital Access</h3>
          <p className="text-3xl font-bold text-success-600">{digitalResources.length}</p>
          <p className="text-sm text-gray-500 mt-1">Resources available</p>
        </div>
      </div>
    </div>
  );
};

export default Library; 