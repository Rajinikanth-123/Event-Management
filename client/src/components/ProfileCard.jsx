const ProfileCard = ({ user, onEdit }) => {
  return (
    <div className="profile-card">
      <div className="profile-avatar">
        {user?.profileImage ? <img src={user.profileImage} alt={user.name} /> : <span>{user?.name?.slice(0, 1).toUpperCase()}</span>}
      </div>
      <div>
        <h3>{user?.name}</h3>
        <p>{user?.email}</p>
        <p>{user?.phone || 'No phone number added'}</p>
      </div>
      <button type="button" className="primary-button" onClick={onEdit}>
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;