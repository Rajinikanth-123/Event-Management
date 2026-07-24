const StatisticsCard = ({ label, value, icon, tone = 'default' }) => {
  return (
    <div className={`stats-card tone-${tone}`}>
      <div className="stats-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
};

export default StatisticsCard;