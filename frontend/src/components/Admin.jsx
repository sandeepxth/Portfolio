import React, { useState, useEffect } from 'react';
import { LogOut, MessageSquare, Folder, Award, Plus, Trash2, Edit, Check, Eye, X, Lock, CheckCircle, EyeOff, FileText, Upload, Download } from 'lucide-react';

const Admin = ({ backendUrl }) => {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [activeTab, setActiveTab] = useState('messages');
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data States
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [resumeExists, setResumeExists] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const [resumeDownloads, setResumeDownloads] = useState(0);
  const [resumeLastDownloaded, setResumeLastDownloaded] = useState(null);
  
  // Loading & Error States
  const [loadingData, setLoadingData] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Form States (for Add/Edit)
  const [projectForm, setProjectForm] = useState({
    _id: '',
    title: '',
    description: '',
    techStack: '',
    features: '',
    githubUrl: '',
    liveUrl: '',
    order: 0
  });
  
  const [certForm, setCertForm] = useState({
    _id: '',
    title: '',
    issuer: '',
    date: '',
    credentialUrl: '',
    order: 0
  });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isEditingCert, setIsEditingCert] = useState(false);

  // Auto-clear success message
  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => setActionSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccess]);

  // Load backend data if authenticated
  useEffect(() => {
    if (token) {
      fetchDashboardData();
      fetchResumeStatus();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setUsername('');
        setPassword('');
      } else {
        setLoginError(data.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setLoginError('Server connection error.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
    setMessages([]);
    setProjects([]);
    setCerts([]);
    setResumeExists(false);
  };

  const fetchResumeStatus = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/resume/status`);
      const data = await res.json();
      if (data.success) {
        setResumeExists(data.exists);
      }

      if (token) {
        const statsRes = await fetch(`${backendUrl}/api/resume/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        if (statsData.success) {
          setResumeDownloads(statsData.downloads);
          setResumeLastDownloaded(statsData.updatedAt);
        }
      }
    } catch (err) {
      console.warn('Could not check resume status/stats:', err);
    }
  };

  const fetchDashboardData = async () => {
    setLoadingData(true);
    const headers = { 'Authorization': `Bearer ${token}` };
    
    try {
      // 1. Fetch Contacts
      const contactsRes = await fetch(`${backendUrl}/api/contacts`, { headers });
      const contactsData = await contactsRes.json();
      if (contactsData.success) setMessages(contactsData.data);

      // 2. Fetch Projects
      const projectsRes = await fetch(`${backendUrl}/api/projects`);
      const projectsData = await projectsRes.json();
      if (projectsData.success) setProjects(projectsData.data);

      // 3. Fetch Certs
      const certsRes = await fetch(`${backendUrl}/api/certifications`);
      const certsData = await certsRes.json();
      if (certsData.success) setCerts(certsData.data);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Contacts Actions
  const toggleReadMessage = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(messages.map(msg => msg._id === id ? { ...msg, isRead: !msg.isRead } : msg));
        setActionSuccess('Message status updated.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this contact message permanently?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        handleLogout();
        alert('Session expired. Please log in again.');
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(messages.filter(msg => msg._id !== id));
        setActionSuccess('Message deleted successfully.');
      } else {
        alert(data.message || 'Failed to delete message.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to the server.');
    }
  };

  // Projects CRUD Actions
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Parse CSV values to array
    const techStackArray = projectForm.techStack.split(',').map(s => s.trim()).filter(Boolean);
    const featuresArray = projectForm.features.split('\n').map(s => s.trim()).filter(Boolean);

    const payload = {
      ...projectForm,
      techStack: techStackArray,
      features: featuresArray
    };

    const method = isEditingProject ? 'PUT' : 'POST';
    const url = isEditingProject 
      ? `${backendUrl}/api/projects/${projectForm._id}` 
      : `${backendUrl}/api/projects`;

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setActionSuccess(isEditingProject ? 'Project updated!' : 'Project created!');
        setShowProjectModal(false);
        fetchDashboardData();
        resetProjectForm();
      } else {
        alert(data.errors ? data.errors.join('\n') : data.message || 'Operation failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEditProject = (proj) => {
    setIsEditingProject(true);
    setProjectForm({
      _id: proj._id,
      title: proj.title,
      description: proj.description,
      techStack: proj.techStack.join(', '),
      features: proj.features.join('\n'),
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      order: proj.order || 0
    });
    setShowProjectModal(true);
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        handleLogout();
        alert('Session expired. Please log in again.');
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess('Project deleted successfully.');
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to delete project.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to the server.');
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      _id: '',
      title: '',
      description: '',
      techStack: '',
      features: '',
      githubUrl: '',
      liveUrl: '',
      order: 0
    });
    setIsEditingProject(false);
  };

  // Certifications CRUD Actions
  const handleCertSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const method = isEditingCert ? 'PUT' : 'POST';
    const url = isEditingCert 
      ? `${backendUrl}/api/certifications/${certForm._id}` 
      : `${backendUrl}/api/certifications`;

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(certForm)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setActionSuccess(isEditingCert ? 'Certification updated!' : 'Certification added!');
        setShowCertModal(false);
        fetchDashboardData();
        resetCertForm();
      } else {
        alert(data.errors ? data.errors.join('\n') : data.message || 'Operation failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEditCert = (cert) => {
    setIsEditingCert(true);
    setCertForm({
      _id: cert._id,
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      credentialUrl: cert.credentialUrl || '',
      order: cert.order || 0
    });
    setShowCertModal(true);
  };

  const deleteCert = async (id) => {
    if (!window.confirm('Delete this certification permanently?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/certifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        handleLogout();
        alert('Session expired. Please log in again.');
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess('Certification deleted successfully.');
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to delete certification.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to the server.');
    }
  };

  const resetCertForm = () => {
    setCertForm({
      _id: '',
      title: '',
      issuer: '',
      date: '',
      credentialUrl: '',
      order: 0
    });
    setIsEditingCert(false);
  };

  // Helper reader to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Resume File Handlers
  const handleResumeSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    setUploadingResume(true);
    setResumeError('');

    try {
      const base64String = await fileToBase64(resumeFile);
      const res = await fetch(`${backendUrl}/api/resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fileData: base64String })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResumeExists(true);
        setResumeFile(null);
        setActionSuccess('Resume uploaded and activated.');
        fetchResumeStatus();
      } else {
        setResumeError(data.message || 'Failed to upload resume file.');
      }
    } catch (error) {
      setResumeError('Network error uploading file.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Delete custom resume? The portfolio will fall back to serving the default resume.')) return;
    
    try {
      const res = await fetch(`${backendUrl}/api/resume`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        handleLogout();
        alert('Session expired. Please log in again.');
        return;
      }

      const data = await res.json();

      if (res.ok && data.success) {
        setResumeExists(false);
        setActionSuccess('Custom resume deleted successfully.');
        fetchResumeStatus();
      } else {
        alert(data.message || 'Failed to delete resume.');
      }
    } catch (error) {
      alert('Error connecting to backend server.');
    }
  };

  // Login View
  if (!token) {
    return (
      <section className="admin-login-section">
        <div className="glow-effect" style={{ top: '30%', left: '35%' }}></div>
        <div className="container login-container">
          <div className="login-card glass animate-fade-in">
            <div className="login-icon-header">
              <Lock size={32} />
            </div>
            <h2>Admin Login</h2>
            <p>Access the developer portfolio control panel</p>

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input"
                />
              </div>

              {loginError && <div className="form-alert alert-error">{loginError}</div>}

              <button type="submit" className="btn btn-primary btn-block" disabled={loginLoading}>
                {loginLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // Dashboard View
  return (
    <section className="admin-dashboard-section">
      <div className="container dashboard-container">
        
        {/* Dashboard Header */}
        <div className="dashboard-header glass">
          <div className="header-meta">
            <h2>Control Panel</h2>
            <p>Welcome, Sandeep (Admin Mode)</p>
          </div>
          
          <div className="header-actions">
            <button onClick={handleLogout} className="btn btn-outline btn-logout">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {actionSuccess && (
          <div className="form-alert alert-success toast-success">
            <CheckCircle size={18} /> <span>{actionSuccess}</span>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="dashboard-tabs glass">
          <button 
            onClick={() => setActiveTab('messages')} 
            className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          >
            <MessageSquare size={18} /> Messages ({messages.length})
          </button>
          <button 
            onClick={() => setActiveTab('projects')} 
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          >
            <Folder size={18} /> Projects ({projects.length})
          </button>
          <button 
            onClick={() => setActiveTab('certs')} 
            className={`tab-btn ${activeTab === 'certs' ? 'active' : ''}`}
          >
            <Award size={18} /> Certifications ({certs.length})
          </button>
          <button 
            onClick={() => setActiveTab('resume')} 
            className={`tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
          >
            <FileText size={18} /> Resume Manager
          </button>
        </div>

        {/* Tab Contents */}
        <div className="dashboard-body glass">
          {loadingData ? (
            <div className="dashboard-loading">
              <p>Fetching database metrics...</p>
            </div>
          ) : (
            <>
              {/* MESSAGES TAB */}
              {activeTab === 'messages' && (
                <div className="admin-table-container">
                  {messages.length === 0 ? (
                    <p className="empty-message-text">No message logs in database.</p>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Sender</th>
                          <th>Subject</th>
                          <th>Message Body</th>
                          <th>Submitted</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((msg) => (
                          <tr key={msg._id} className={msg.isRead ? 'row-read' : 'row-unread'}>
                            <td>
                              <strong>{msg.name}</strong>
                              <br />
                              <span className="sub-text">{msg.email}</span>
                            </td>
                            <td>{msg.subject}</td>
                            <td className="msg-cell" title={msg.message}>{msg.message}</td>
                            <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`status-badge ${msg.isRead ? 'status-read' : 'status-unread'}`}>
                                {msg.isRead ? 'Read' : 'New'}
                              </span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button 
                                  onClick={() => toggleReadMessage(msg._id)} 
                                  className="action-icon-btn" 
                                  title={msg.isRead ? "Mark Unread" : "Mark Read"}
                                >
                                  {msg.isRead ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button onClick={() => deleteMessage(msg._id)} className="action-icon-btn delete" title="Delete Message">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="admin-crud-panel">
                  <div className="crud-header">
                    <h3>Manage Portfolio Projects</h3>
                    <button onClick={() => { resetProjectForm(); setShowProjectModal(true); }} className="btn btn-primary btn-sm">
                      <Plus size={16} /> Add Project
                    </button>
                  </div>

                  <div className="admin-list-grid">
                    {projects.map((proj) => (
                      <div key={proj._id} className="admin-item-card glass">
                        <div className="item-meta">
                          <h4>{proj.title}</h4>
                          <p>{proj.description.substring(0, 80)}...</p>
                        </div>
                        <div className="item-actions">
                          <button onClick={() => startEditProject(proj)} className="action-icon-btn" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => deleteProject(proj._id)} className="action-icon-btn delete" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CERTIFICATIONS TAB */}
              {activeTab === 'certs' && (
                <div className="admin-crud-panel">
                  <div className="crud-header">
                    <h3>Manage Credentials</h3>
                    <button onClick={() => { resetCertForm(); setShowCertModal(true); }} className="btn btn-primary btn-sm">
                      <Plus size={16} /> Add Cert
                    </button>
                  </div>

                  <div className="admin-list-grid">
                    {certs.map((cert) => (
                      <div key={cert._id} className="admin-item-card glass">
                        <div className="item-meta">
                          <h4>{cert.title}</h4>
                          <p>{cert.issuer} | {cert.date}</p>
                        </div>
                        <div className="item-actions">
                          <button onClick={() => startEditCert(cert)} className="action-icon-btn" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => deleteCert(cert._id)} className="action-icon-btn delete" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RESUME MANAGER TAB */}
              {activeTab === 'resume' && (
                <div className="admin-resume-panel">
                  <h3>Manage PDF Resume File</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    Upload your latest resume PDF here. The portfolio's "Download Resume" link will automatically update to retrieve it. If deleted, it defaults to the pre-packaged static file.
                  </p>

                  <div className="admin-list-grid">
                    <div className="admin-item-card glass" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'stretch' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <FileText size={32} style={{ color: resumeExists ? 'var(--success)' : 'var(--text-muted)' }} />
                          <div>
                            <h4 style={{ fontSize: '1.2rem' }}>Resume Status</h4>
                            <p style={{ color: resumeExists ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600 }}>
                              {resumeExists ? 'Custom resume (resume.pdf) is active.' : 'No custom resume. Serving default fallback.'}
                            </p>
                          </div>
                        </div>

                        {resumeExists && (
                          <button 
                            onClick={handleDeleteResume} 
                            className="btn btn-outline btn-logout" 
                            style={{ borderColor: 'var(--error)', padding: '8px 16px', fontSize: '0.9rem' }}
                          >
                            <Trash2 size={16} /> Delete Resume
                          </button>
                        )}
                      </div>

                      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '10px 0' }} />

                      <form onSubmit={handleResumeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="form-group">
                          <label>Select Resume PDF</label>
                          <input 
                            type="file" 
                            accept="application/pdf"
                            onChange={(e) => setResumeFile(e.target.files[0])}
                            required
                            style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                          />
                        </div>

                        {resumeError && (
                          <div className="form-alert alert-error">
                            <span>{resumeError}</span>
                          </div>
                        )}

                        <button 
                          type="submit" 
                          className="btn btn-primary" 
                          disabled={uploadingResume || !resumeFile}
                          style={{ alignSelf: 'flex-start' }}
                        >
                          <Upload size={18} /> {uploadingResume ? 'Uploading...' : 'Upload PDF'}
                        </button>
                      </form>
                    </div>

                    {/* Resume Download Tracking Stats Card */}
                    <div className="admin-item-card glass" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'stretch' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          background: 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid rgba(99, 102, 241, 0.25)',
                          borderRadius: '50%',
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent)'
                        }}>
                          <Download size={24} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.2rem' }}>Resume Downloads</h4>
                          <p style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '1.8rem', margin: '4px 0 0' }}>
                            {resumeDownloads}
                          </p>
                        </div>
                      </div>

                      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '10px 0' }} />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Tracking Status:</span>
                          <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Last Downloaded:</span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {resumeLastDownloaded ? new Date(resumeLastDownloaded).toLocaleString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* PROJECT FORM MODAL */}
        {showProjectModal && (
          <div className="modal-backdrop">
            <div className="modal-content glass animate-fade-in">
              <div className="modal-header">
                <h3>{isEditingProject ? 'Edit Project Details' : 'Add New Project'}</h3>
                <button onClick={() => setShowProjectModal(false)} className="close-btn"><X size={20} /></button>
              </div>
              <form onSubmit={handleProjectSubmit} className="modal-form">
                <div className="form-group">
                  <label>Project Title</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    required
                    rows="3"
                    className="form-input"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Tech Stack (comma separated values)</label>
                  <input
                    type="text"
                    value={projectForm.techStack}
                    onChange={(e) => setProjectForm({...projectForm, techStack: e.target.value})}
                    placeholder="React, Node.js, MongoDB"
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Key Features (one per line)</label>
                  <textarea
                    value={projectForm.features}
                    onChange={(e) => setProjectForm({...projectForm, features: e.target.value})}
                    placeholder="Feature 1&#10;Feature 2"
                    rows="3"
                    className="form-input"
                  ></textarea>
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>GitHub URL</label>
                    <input
                      type="url"
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({...projectForm, githubUrl: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Live Demo URL</label>
                    <input
                      type="url"
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({...projectForm, liveUrl: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input
                    type="number"
                    value={projectForm.order}
                    onChange={(e) => setProjectForm({...projectForm, order: parseInt(e.target.value) || 0})}
                    className="form-input"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* CERTIFICATE FORM MODAL */}
        {showCertModal && (
          <div className="modal-backdrop">
            <div className="modal-content glass animate-fade-in">
              <div className="modal-header">
                <h3>{isEditingCert ? 'Edit Certification' : 'Add New Certification'}</h3>
                <button onClick={() => setShowCertModal(false)} className="close-btn"><X size={20} /></button>
              </div>
              <form onSubmit={handleCertSubmit} className="modal-form">
                <div className="form-group">
                  <label>Certification Title</label>
                  <input
                    type="text"
                    value={certForm.title}
                    onChange={(e) => setCertForm({...certForm, title: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Issuer / Provider</label>
                  <input
                    type="text"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({...certForm, issuer: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Date Issued</label>
                  <input
                    type="text"
                    value={certForm.date}
                    onChange={(e) => setCertForm({...certForm, date: e.target.value})}
                    placeholder="June 2026"
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Credential Verification URL</label>
                  <input
                    type="url"
                    value={certForm.credentialUrl}
                    onChange={(e) => setCertForm({...certForm, credentialUrl: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input
                    type="number"
                    value={certForm.order}
                    onChange={(e) => setCertForm({...certForm, order: parseInt(e.target.value) || 0})}
                    className="form-input"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Admin;
