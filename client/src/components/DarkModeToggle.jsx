import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? <MoonStar size={18} /> : <SunMedium size={18} />}
    </button>
  );
};

export default DarkModeToggle;