import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <AuthCard title="Create your account" subtitle="Start managing events with a secure workspace.">
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Full Name</span>
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            <span>Password</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          <label>
            <span>Confirm Password</span>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
          </label>
          <button className="primary-button full-width" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login">Already have an account?</Link>
        </div>
      </AuthCard>
    </section>
  );
};

export default Register;