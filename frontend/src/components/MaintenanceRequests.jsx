import React, { useState, useEffect } from 'react';

const MaintenanceRequests = () => {
  // State for maintenance requests
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  
  // State for new request form
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'medium',
    category: 'plumbing',
  });

  // Mock data for initial state - in a real app, you would fetch this from an API
  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        title: 'Leaking Tap',
        description: 'The kitchen tap is leaking continuously.',
        location: 'Flat 101, Building A',
        category: 'plumbing',
        priority: 'medium',
        status: 'pending',
        dateSubmitted: '2025-03-01',
        submittedBy: 'John Doe',
        assignedTo: '',
        comments: []
      },
      {
        id: 2,
        title: 'Broken Window',
        description: 'Window glass cracked in living room.',
        location: 'Flat 205, Building B',
        category: 'carpentry',
        priority: 'high',
        status: 'in-progress',
        dateSubmitted: '2025-03-05',
        submittedBy: 'Jane Smith',
        assignedTo: 'Mike Technician',
        comments: [
          { text: 'Scheduled for tomorrow', author: 'Admin', date: '2025-03-06' }
        ]
      },
      {
        id: 3,
        title: 'Light Fixture Not Working',
        description: 'Hallway light not working despite changing bulb.',
        location: 'Common area, Building C',
        category: 'electrical',
        priority: 'medium',
        status: 'completed',
        dateSubmitted: '2025-02-28',
        submittedBy: 'David Wilson',
        assignedTo: 'Electrical Team',
        completedDate: '2025-03-02',
        comments: [
          { text: 'Wiring issue identified', author: 'Electrical Team', date: '2025-03-01' },
          { text: 'Fixed and tested', author: 'Electrical Team', date: '2025-03-02' }
        ]
      }
    ];

    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
  }, []);

  // Filter requests
  const filterRequests = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(request => request.status === filter));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({
      ...newRequest,
      [name]: value
    });
  };

  // Submit new request
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRequestData = {
      ...newRequest,
      id: requests.length + 1,
      status: 'pending',
      dateSubmitted: new Date().toISOString().slice(0, 10),
      submittedBy: 'Current User', // In a real app, this would be the logged-in user
      comments: []
    };
    
    setRequests([...requests, newRequestData]);
    setFilteredRequests(activeFilter === 'all' || activeFilter === 'pending' 
      ? [...filteredRequests, newRequestData] 
      : filteredRequests);
    
    // Reset form
    setNewRequest({
      title: '',
      description: '',
      location: '',
      priority: 'medium',
      category: 'plumbing',
    });
    setShowForm(false);
  };

  // Update request status
  const updateStatus = (id, newStatus) => {
    const updatedRequests = requests.map(request => {
      if (request.id === id) {
        return { 
          ...request, 
          status: newStatus,
          ...(newStatus === 'completed' ? { completedDate: new Date().toISOString().slice(0, 10) } : {})
        };
      }
      return request;
    });
    
    setRequests(updatedRequests);
    filterRequests(activeFilter);
  };

  // Get status badge style
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending':
        return 'status-badge status-pending';
      case 'in-progress':
        return 'status-badge status-progress';
      case 'completed':
        return 'status-badge status-completed';
      default:
        return 'status-badge';
    }
  };

  // Get priority badge style
  const getPriorityBadgeClass = (priority) => {
    switch(priority) {
      case 'low':
        return 'priority-badge priority-low';
      case 'medium':
        return 'priority-badge priority-medium';
      case 'high':
        return 'priority-badge priority-high';
      default:
        return 'priority-badge';
    }
  };

  return (
    <div className="admin-container">
      {/* Navbar */}
      <div className="admin-navbar">
        <div className="admin-navbar-brand">eSociety Management</div>
        <div className="admin-nav-links">
          <button className="admin-nav-link">
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </button>
          <button className="admin-nav-link">
            <i className="fas fa-tools"></i>
            <span>Maintenance</span>
          </button>
          <button className="admin-nav-link">
            <i className="fas fa-calendar"></i>
            <span>Facilities</span>
          </button>
          <button className="admin-nav-link">
            <i className="fas fa-user-shield"></i>
            <span>Security</span>
          </button>
          <button className="admin-nav-link">
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-dashboard">
        <h1 className="admin-heading">Maintenance Requests</h1>
        <p className="admin-subtext">
          Track, manage, and resolve maintenance issues across your residential society
        </p>

        {/* Filter and Add New buttons */}
        <div className="maintenance-actions">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => filterRequests('all')}
            >
              All Requests
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
              onClick={() => filterRequests('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'in-progress' ? 'active' : ''}`}
              onClick={() => filterRequests('in-progress')}
            >
              In Progress
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => filterRequests('completed')}
            >
              Completed
            </button>
          </div>
          <button className="admin-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Request'} 
            <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
          </button>
        </div>

        {/* New Request Form */}
        {showForm && (
          <div className="maintenance-form-container">
            <form className="maintenance-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Issue Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newRequest.title}
                  onChange={handleInputChange}
                  placeholder="Brief title of the issue"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newRequest.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of the maintenance issue"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={newRequest.location}
                    onChange={handleInputChange}
                    placeholder="Building, flat number, or area"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={newRequest.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="painting">Painting</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={newRequest.priority}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="form-btn cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="form-btn submit-btn">
                  Submit Request <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Maintenance Requests List */}
        <div className="maintenance-list">
          {filteredRequests.length === 0 ? (
            <div className="no-requests">
              <i className="fas fa-clipboard-check"></i>
              <p>No maintenance requests found.</p>
            </div>
          ) : (
            filteredRequests.map(request => (
              <div className="maintenance-card" key={request.id}>
                <div className="maintenance-card-header">
                  <div className="request-title-section">
                    <h3 className="request-title">{request.title}</h3>
                    <span className={getStatusBadgeClass(request.status)}>
                      {request.status === 'in-progress' ? 'In Progress' : 
                       request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <span className={getPriorityBadgeClass(request.priority)}>
                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                  </span>
                </div>
                
                <div className="request-details">
                  <p className="request-description">{request.description}</p>
                  
                  <div className="request-meta">
                    <div className="meta-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{request.location}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-tag"></i>
                      <span>{request.category.charAt(0).toUpperCase() + request.category.slice(1)}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Submitted: {request.dateSubmitted}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-user"></i>
                      <span>By: {request.submittedBy}</span>
                    </div>
                    {request.assignedTo && (
                      <div className="meta-item">
                        <i className="fas fa-user-cog"></i>
                        <span>Assigned: {request.assignedTo}</span>
                      </div>
                    )}
                    {request.completedDate && (
                      <div className="meta-item">
                        <i className="fas fa-check-circle"></i>
                        <span>Completed: {request.completedDate}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Comments section */}
                  {request.comments.length > 0 && (
                    <div className="comments-section">
                      <h4 className="comments-title">
                        <i className="fas fa-comments"></i> Updates
                      </h4>
                      <div className="comments-list">
                        {request.comments.map((comment, index) => (
                          <div className="comment" key={index}>
                            <div className="comment-header">
                              <span className="comment-author">{comment.author}</span>
                              <span className="comment-date">{comment.date}</span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  {request.status !== 'completed' && (
                    <div className="request-actions">
                      {request.status === 'pending' && (
                        <>
                          <button 
                            className="action-btn assign-btn"
                            onClick={() => alert('Assign functionality would open a modal to select staff')}
                          >
                            <i className="fas fa-user-plus"></i> Assign
                          </button>
                          <button 
                            className="action-btn progress-btn"
                            onClick={() => updateStatus(request.id, 'in-progress')}
                          >
                            <i className="fas fa-tools"></i> Mark In Progress
                          </button>
                        </>
                      )}
                      {request.status === 'in-progress' && (
                        <button 
                          className="action-btn complete-btn"
                          onClick={() => updateStatus(request.id, 'completed')}
                        >
                          <i className="fas fa-check"></i> Mark Complete
                        </button>
                      )}
                      <button 
                        className="action-btn comment-btn"
                        onClick={() => alert('Comment functionality would open a text input')}
                      >
                        <i className="fas fa-comment"></i> Add Comment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequests;


