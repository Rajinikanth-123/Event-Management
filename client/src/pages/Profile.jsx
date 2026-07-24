import { useState } from 'react';
import toast from 'react-hot-toast';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (file) formData.append('profileImage', file);

    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile saved');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-panel">
      <span className="eyebrow">Profile</span>
      <ProfileCard user={user} onEdit={() => document.getElementById('profile-form').scrollIntoView({ behavior: 'smooth' })} />
      <form id="profile-form" className="form-shell" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label><span>Full Name</span><input name="name" value={form.name} onChange={handleChange} /></label>
          <label><span>Email</span><input name="email" type="email" value={form.email} onChange={handleChange} /></label>
          <label><span>Phone</span><input name="phone" value={form.phone} onChange={handleChange} /></label>
          <label><span>Profile Image</span><input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} /></label>
          <label><span>Current Password</span><input name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} /></label>
          <label><span>New Password</span><input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} /></label>
          <label><span>Confirm Password</span><input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} /></label>
        </div>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </section>
  );
};

export default Profile;