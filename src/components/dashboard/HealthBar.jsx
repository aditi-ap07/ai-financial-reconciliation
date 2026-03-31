import PropTypes from 'prop-types';

export default function HealthBar({ percentage }) {
  return (
    <div className="w-full bg-slate-200 rounded h-4">
      <div className="h-4 rounded bg-emerald-500" style={{ width: `${percentage}%` }} />
    </div>
  );
}

HealthBar.propTypes = {
  percentage: PropTypes.number.isRequired,
};
