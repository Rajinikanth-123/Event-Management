const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default AuthCard;