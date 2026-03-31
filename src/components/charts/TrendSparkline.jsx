import PropTypes from 'prop-types';

export default function TrendSparkline({ points }) {
  return <div className="text-xs text-slate-600">Trend sparkline unavailable (demo). Points: {points.join(', ')}</div>;
}

TrendSparkline.propTypes = {
  points: PropTypes.array.isRequired,
};
