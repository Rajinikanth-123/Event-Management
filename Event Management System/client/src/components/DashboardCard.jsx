const DashboardCard = ({ title, value, subtitle, action }) => {
  return (
    <div className="dashboard-card">
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
      <div className="dashboard-card-footer">
        <span>{subtitle}</span>
        {action}
      </div>
    </div>
  );
};

export default DashboardCard;