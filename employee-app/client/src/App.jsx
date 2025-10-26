import React, { useEffect, useState } from 'react';

// Helper functions for API calls
const API = 'http://localhost:4000/api/employees';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', position: '', department: '', salary: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    setLoading(true);
    const res = await fetch(API);
    const data = await res.json();
    setEmployees(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API}/${editing.id}` : API;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setForm({ first_name: '', last_name: '', email: '', position: '', department: '', salary: '' });
    setEditing(null);
    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setEditing(emp);
    setForm(emp);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      fetchEmployees();
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#5b21b6' }}>Employee Management System</h1>

      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: 20,
        borderRadius: 12,
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginBottom: 30
      }}>
        <h2>{editing ? 'Edit Employee' : 'Add New Employee'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" required />
          <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input name="position" value={form.position} onChange={handleChange} placeholder="Position" />
          <input name="department" value={form.department} onChange={handleChange} placeholder="Department" />
          <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary" type="number" />
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="submit" style={{ background: '#5b21b6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8 }}>
            {editing ? 'Update' : 'Add'}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm({ first_name: '', last_name: '', email: '', position: '', department: '', salary: '' }); }}
              style={{ marginLeft: 10, background: '#ccc', border: 'none', padding: '10px 20px', borderRadius: 8 }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 style={{ marginBottom: 10 }}>Employee List</h2>
      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {employees.length === 0 ? (
            <p style={{ color: '#888' }}>No employees found.</p>
          ) : employees.map(emp => (
            <div key={emp.id} style={{
              background: '#fff',
              padding: 15,
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div>
                <h3 style={{ margin: 0 }}>{emp.first_name} {emp.last_name}</h3>
                <p style={{ margin: 0, color: '#555' }}>{emp.position || '—'} • {emp.department || '—'}</p>
                <p style={{ margin: 0, fontSize: 13, color: '#777' }}>{emp.email}</p>
              </div>
              <div>
                <button onClick={() => handleEdit(emp)} style={{ marginRight: 10, background: '#2563eb', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6 }}>Edit</button>
                <button onClick={() => handleDelete(emp.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
