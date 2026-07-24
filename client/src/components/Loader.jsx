const Loader = ({ fullscreen = false, label = 'Loading' }) => {
  return (
    <div className={`loader ${fullscreen ? 'loader-fullscreen' : ''}`} role="status" aria-live="polite">
      <div className="loader-ring" />
      <span>{label}</span>
    </div>
  );
};

export default Loader;