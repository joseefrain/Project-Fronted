import './styles.scss';

export const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader">
        <div className="loader-wave"></div>
        <span className="loading-text">Loading...</span>
      </div>
    </div>
  );
};
