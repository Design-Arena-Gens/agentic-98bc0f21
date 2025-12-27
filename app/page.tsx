'use client';

import { useState, useEffect } from 'react';

interface UserData {
  name: string;
  age: string;
  address: string;
  email?: string;
  phone?: string;
  city?: string;
  zipCode?: string;
  country?: string;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    age: '',
    address: '',
    email: '',
    phone: '',
    city: '',
    zipCode: '',
    country: ''
  });

  const [jsonInput, setJsonInput] = useState('');
  const [savedProfiles, setSavedProfiles] = useState<UserData[]>([]);
  const [currentProfile, setCurrentProfile] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('autoFillProfiles');
    if (saved) {
      const profiles = JSON.parse(saved);
      setSavedProfiles(profiles);
      if (profiles.length > 0) {
        setUserData(profiles[0]);
      }
    }
  }, []);

  const handleJsonLoad = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setUserData(parsed);
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const saveProfile = () => {
    const newProfiles = [...savedProfiles, userData];
    setSavedProfiles(newProfiles);
    localStorage.setItem('autoFillProfiles', JSON.stringify(newProfiles));
    alert('Profile saved successfully!');
  };

  const loadProfile = (index: number) => {
    setCurrentProfile(index);
    setUserData(savedProfiles[index]);
  };

  const deleteProfile = (index: number) => {
    const newProfiles = savedProfiles.filter((_, i) => i !== index);
    setSavedProfiles(newProfiles);
    localStorage.setItem('autoFillProfiles', JSON.stringify(newProfiles));
    if (newProfiles.length > 0) {
      setUserData(newProfiles[0]);
      setCurrentProfile(0);
    }
  };

  const updateField = (field: keyof UserData, value: string) => {
    setUserData({ ...userData, [field]: value });
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    alert('Copied to clipboard!');
  };

  const exportData = () => {
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'autofill-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const generateBookmarklet = () => {
    const code = `
(function() {
  const data = ${JSON.stringify(userData)};
  const inputs = document.querySelectorAll('input, textarea');

  inputs.forEach(input => {
    const name = (input.name || input.id || input.placeholder || '').toLowerCase();
    const type = input.type?.toLowerCase() || '';

    if (name.includes('name') || name.includes('fullname') || type === 'text' && !input.value) {
      input.value = data.name || '';
    } else if (name.includes('age')) {
      input.value = data.age || '';
    } else if (name.includes('address') || name.includes('street')) {
      input.value = data.address || '';
    } else if (name.includes('email') || type === 'email') {
      input.value = data.email || '';
    } else if (name.includes('phone') || name.includes('tel') || type === 'tel') {
      input.value = data.phone || '';
    } else if (name.includes('city')) {
      input.value = data.city || '';
    } else if (name.includes('zip') || name.includes('postal')) {
      input.value = data.zipCode || '';
    } else if (name.includes('country')) {
      input.value = data.country || '';
    }

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  alert('Form auto-filled!');
})();
    `.trim();

    return 'javascript:' + encodeURIComponent(code);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          fontSize: '3rem',
          textAlign: 'center',
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          🚀 Auto-Fill Master
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
          Load your data and auto-fill any form on the web
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Left Panel - Data Input */}
          <div>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <h2 style={{ marginBottom: '15px', color: '#333' }}>📥 Load JSON Data</h2>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"name":"John Doe","age":"30","address":"123 Main St","email":"john@example.com","phone":"555-0123"}'
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  marginBottom: '10px'
                }}
              />
              <button
                onClick={handleJsonLoad}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                Load JSON
              </button>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px'
            }}>
              <h2 style={{ marginBottom: '15px', color: '#333' }}>✏️ Edit Your Data</h2>
              {Object.entries(userData).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '12px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: '600',
                    color: '#555',
                    textTransform: 'capitalize'
                  }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateField(key as keyof UserData, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '6px',
                        border: '2px solid #ddd',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={() => copyToClipboard(value)}
                      style={{
                        padding: '10px 15px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      📋
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={saveProfile}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  💾 Save Profile
                </button>
                <button
                  onClick={exportData}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  📤 Export JSON
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Auto-Fill Tools */}
          <div>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <h2 style={{ marginBottom: '15px', color: '#333' }}>🎯 Saved Profiles</h2>
              {savedProfiles.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                  No saved profiles yet. Save your first profile!
                </p>
              ) : (
                <div>
                  {savedProfiles.map((profile, index) => (
                    <div
                      key={index}
                      style={{
                        background: currentProfile === index ? '#667eea' : 'white',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '2px solid #ddd'
                      }}
                    >
                      <div style={{ color: currentProfile === index ? 'white' : '#333' }}>
                        <strong>{profile.name || 'Unnamed'}</strong>
                        <br />
                        <small>{profile.email || 'No email'}</small>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => loadProfile(index)}
                          style={{
                            padding: '8px 12px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteProfile(index)}
                          style={{
                            padding: '8px 12px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{
              background: '#fff3cd',
              padding: '20px',
              borderRadius: '10px',
              border: '2px solid #ffc107'
            }}>
              <h2 style={{ marginBottom: '15px', color: '#333' }}>⚡ Bookmarklet</h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                Drag this button to your bookmarks bar, then click it on any page to auto-fill forms:
              </p>
              <a
                href={generateBookmarklet()}
                style={{
                  display: 'block',
                  padding: '15px',
                  background: '#ffc107',
                  color: '#333',
                  textAlign: 'center',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  border: '3px dashed #ff9800'
                }}
                onClick={(e) => e.preventDefault()}
              >
                🔥 Auto-Fill Forms
              </a>
              <p style={{
                color: '#666',
                fontSize: '12px',
                marginTop: '15px',
                fontStyle: 'italic'
              }}>
                Drag the button above to your bookmarks bar. Click it on any website to instantly fill forms with your data!
              </p>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              marginTop: '20px'
            }}>
              <h2 style={{ marginBottom: '15px', color: '#333' }}>📋 Current Data Preview</h2>
              <pre style={{
                background: '#282c34',
                color: '#61dafb',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '300px'
              }}>
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#e7f3ff',
          borderRadius: '10px',
          border: '2px solid #2196f3'
        }}>
          <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>📖 How to Use</h3>
          <ol style={{ color: '#555', lineHeight: '1.8' }}>
            <li>Enter your data in JSON format or edit the fields manually</li>
            <li>Save multiple profiles for different use cases</li>
            <li>Drag the "Auto-Fill Forms" button to your bookmarks bar</li>
            <li>Visit any website with a form</li>
            <li>Click the bookmarklet to instantly fill the form</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
