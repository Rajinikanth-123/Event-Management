import { useEffect, useState } from 'react';

const getRemaining = (targetDate) => {
  const distance = new Date(targetDate).getTime() - Date.now();
  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60)
  };
};

const CountdownTimer = ({ targetDate }) => {
  const [remaining, setRemaining] = useState(getRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setRemaining(getRemaining(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="countdown-timer">
      {Object.entries(remaining).map(([label, value]) => (
        <div key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;