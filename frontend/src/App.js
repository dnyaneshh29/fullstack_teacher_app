import React, { useState, useEffect, useCallback } from 'react';

// --- Style Component ---
const AppStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    :root {
      --primary-color: #4a90e2; --secondary-color: #50e3c2; --background-color: #f0f2f5;
      --card-background: #ffffff; --text-color: #333; --text-light: #777;
      --border-color: #e0e0e0; --error-color: #e74c3c; --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    body { font-family: 'Poppins', sans-serif; background-color: var(--background-color); color: var(--text-color); }
    .app-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
    .auth-page { display: flex; justify-content: center; align-items: center; width: 100%; }
    .auth-card { background: var(--card-background); padding: 40px; border-radius: 12px; box-shadow: var(--shadow); width: 100%; max-width: 400px; text-align: center; animation: fadeIn 0.5s ease-out; }
    .auth-card h2 { margin-top: 0; margin-bottom: 10px; font-weight: 600; }
    .auth-card p { color: var(--text-light); margin-bottom: 30px; }
    .input-group { text-align: left; margin-bottom: 20px; }
    .input-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px; }
    .input-group input, .input-group select { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid var(--border-color); font-size: 16px; box-sizing: border-box; transition: border-color 0.3s, box-shadow 0.3s; }
    .input-group input:focus, .input-group select:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2); }
    .auth-button { width: 100%; padding: 15px; border: none; border-radius: 8px; background: var(--primary-color); color: white; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s, transform 0.2s; }
    .auth-button:hover { background-color: #357ABD; transform: translateY(-2px); }
    .auth-button:disabled { background-color: #a0c3e8; cursor: not-allowed; }
    .switch-auth { margin-top: 20px; font-size: 14px; }
    .switch-auth span { color: var(--primary-color); font-weight: 600; cursor: pointer; }
    .error-message { color: var(--error-color) !important; background-color: rgba(231, 76, 60, 0.1); padding: 10px; border-radius: 6px; font-size: 14px; margin-bottom: 20px !important; }
    .form-step { animation: slideIn 0.5s forwards; }
    .step-buttons { display: flex; gap: 10px; }
    .secondary-button { flex: 1; padding: 15px; border: 1px solid var(--primary-color); background: transparent; color: var(--primary-color); border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s, color 0.3s; }
    .secondary-button:hover { background-color: var(--primary-color); color: white; }
    .dashboard-page { width: 100%; max-width: 1200px; animation: fadeIn 0.5s ease-out; }
    .dashboard-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: var(--card-background); border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 20px; }
    .dashboard-header h1 { margin: 0; font-size: 24px; }
    .user-info { display: flex; align-items: center; gap: 15px; }
    .user-info button { padding: 10px 20px; border: none; background-color: var(--primary-color); color: white; border-radius: 8px; cursor: pointer; transition: background-color 0.3s; }
    .user-info button:hover { background-color: #357ABD; }
    .dashboard-content { background: var(--card-background); border-radius: 12px; box-shadow: var(--shadow); }
    .tabs { display: flex; border-bottom: 1px solid var(--border-color); }
    .tab { padding: 15px 20px; cursor: pointer; font-weight: 500; color: var(--text-light); border-bottom: 3px solid transparent; }
    .tab.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
    .table-container { overflow-x: auto; padding: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 15px; text-align: left; border-bottom: 1px solid var(--border-color); }
    thead { background-color: #f9fafb; }
    th { font-weight: 600; }
    tbody tr:hover { background-color: #f9fafb; }
    .loading-fullscreen { font-size: 24px; font-weight: 500; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  `}</style>
);


// --- API Object ---
const api = {
    login: async (email, password) => {
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ messages: { error: 'An unknown login error occurred.' } }));
            throw new Error(errorData.messages?.error || 'Login failed');
        }
        return response.json();
    },
    register: async (formData) => {
        const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
        });
        if (!response.ok) {
            const text = await response.text();
            try {
                const errorData = JSON.parse(text);
                throw new Error(errorData.messages?.error || 'Registration failed');
            } catch (e) {
                console.error("Could not parse error JSON:", text);
                throw new Error('An unexpected server error occurred. Check the backend logs.');
            }
        }
        return response.json();
    },
    fetchUsers: async (token) => {
        const response = await fetch('http://localhost:8080/api/users', {
            method: 'GET', headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },
    fetchTeachers: async (token) => {
        const response = await fetch('http://localhost:8080/api/teachers', {
            method: 'GET', headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch teachers');
        return response.json();
    }
};


// --- Main App Component ---
function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [usersData, setUsersData] = useState([]);
  const [teachersData, setTeachersData] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(() => {
    setUser(null); setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setPage('login');
  }, []);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
      
      Promise.all([api.fetchUsers(token), api.fetchTeachers(token)])
        .then(([usersResponse, teachersResponse]) => {
          setUsersData(usersResponse.data);
          setTeachersData(teachersResponse.data);
          setPage('dashboard');
        })
        .catch(err => {
          console.error(err);
          setError('Session expired. Please log in again.');
          handleLogout();
        })
        .finally(() => setIsLoading(false));
    } else {
        setPage('login');
    }
  }, [token, handleLogout]);

  const handleLogin = async (email, password) => {
    setError(''); setIsLoading(true);
    try {
      const data = await api.login(email, password);
      // We don't get the user details back from the login anymore, just the token
      // We will rely on the useEffect to fetch the user's data
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      // We will set the user info after fetching all data.
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setError(''); setIsLoading(true);
    try {
      await api.register(formData);
      setPage('login');
      alert('Registration successful! Please log in.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPage = () => {
    if (isLoading && !token) return <div className="loading-fullscreen">Loading...</div>;
    switch (page) {
      case 'register': return <RegisterPage onRegister={handleRegister} switchToLogin={() => setPage('login')} error={error} isLoading={isLoading} />;
      case 'dashboard': return <DashboardPage user={user} onLogout={handleLogout} usersData={usersData} teachersData={teachersData} isLoading={isLoading} />;
      default: return <LoginPage onLogin={handleLogin} switchToRegister={() => setPage('register')} error={error} isLoading={isLoading} />;
    }
  };

  return <><AppStyles /><div className="app-container">{renderPage()}</div></>;
}


// --- Page Components ---
function LoginPage({ onLogin, switchToRegister, error, isLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); onLogin(email, password); };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2><p>Please enter your details to sign in.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group"><label htmlFor="email">Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="input-group"><label htmlFor="password">Password</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button" disabled={isLoading}>{isLoading ? 'Signing In...' : 'Sign In'}</button>
        </form>
        <p className="switch-auth">Don't have an account? <span onClick={switchToRegister}>Sign Up</span></p>
      </div>
    </div>
  );
}

function RegisterPage({ onRegister, switchToLogin, error, isLoading }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', password: '',
        university_name: '', gender: 'Male', year_joined: new Date().getFullYear().toString(),
    });
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);
    const handleSubmit = (e) => { e.preventDefault(); onRegister(formData); };
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Create an Account (Step {step} of 2)</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="form-step active">
                            <div className="input-group"><label>First Name</label><input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required /></div>
                            <div className="input-group"><label>Last Name</label><input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required /></div>
                            <div className="input-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                            <div className="input-group"><label>Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} required /></div>
                            <button type="button" className="auth-button" onClick={nextStep}>Next</button>
                        </div>
                    )}
                    {step === 2 && (
                         <div className="form-step active">
                            <div className="input-group"><label>University Name</label><input type="text" name="university_name" value={formData.university_name} onChange={handleChange} required /></div>
                            <div className="input-group"><label>Gender</label><select name="gender" value={formData.gender} onChange={handleChange}><option>Male</option><option>Female</option><option>Other</option></select></div>
                            <div className="input-group"><label>Year Joined</label><input type="number" name="year_joined" value={formData.year_joined} onChange={handleChange} required /></div>
                             <div className="step-buttons">
                                <button type="button" className="secondary-button" onClick={prevStep}>Back</button>
                                <button type="submit" className="auth-button" disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</button>
                            </div>
                        </div>
                    )}
                </form>
                <p className="switch-auth">Already have an account? <span onClick={switchToLogin}>Sign In</span></p>
            </div>
        </div>
    );
}

function DashboardPage({ user, onLogout, usersData, teachersData, isLoading }) {
  const [activeTab, setActiveTab] = useState('users');

  if (isLoading) return <div className="loading-fullscreen">Loading Dashboard...</div>;
  
  // Find the current logged-in user from the usersData list
  const currentUser = usersData.find(u => u.email === user?.email);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          {/* Display the first name of the logged-in user */}
          <span>Welcome, {currentUser?.first_name || 'User'}!</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="tabs">
          <div className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users Data</div>
          <div className={`tab ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>Teachers Data</div>
        </div>
        <div className="table-container">
          {activeTab === 'users' && (
            <table>
              <thead><tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th></tr></thead>
              <tbody>
                {usersData.length > 0 ? usersData.map(u => (
                  <tr key={u.id}><td>{u.id}</td><td>{u.first_name}</td><td>{u.last_name}</td><td>{u.email}</td></tr>
                )) : <tr><td colSpan="4">No user data available.</td></tr>}
              </tbody>
            </table>
          )}
          {activeTab === 'teachers' && (
            <table>
              <thead><tr><th>ID</th><th>User ID</th><th>University</th><th>Gender</th><th>Year Joined</th></tr></thead>
              <tbody>
                {teachersData.length > 0 ? teachersData.map(t => (
                  <tr key={t.id}><td>{t.id}</td><td>{t.user_id}</td><td>{t.university_name}</td><td>{t.gender}</td><td>{t.year_joined}</td></tr>
                )) : <tr><td colSpan="5">No teacher data available.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

