import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await resetPassword({ token, ...form });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <AuthCard title="Set a new password" subtitle="Choose a strong password to protect your account.">
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>New Password</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          <label>
            <span>Confirm Password</span>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
          </label>
          <button className="primary-button full-width" type="submit" disabled={loading || !token}>
            {loading ? 'Updating...' : 'Reset password'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login">Back to login</Link>
        </div>
      </AuthCard>
    </section>
  );
};

export default ResetPassword;