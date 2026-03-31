import PropTypes from 'prop-types';

/** Tiny badge display */
export default function Badge({ label, color }) {
  return <span className={`px-2 py-1 rounded text-xs font-semibold bg-${color}-100 text-${color}-700`}>{label}</span>;
}

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
};

Badge.defaultProps = {
  color: 'gray',
};
