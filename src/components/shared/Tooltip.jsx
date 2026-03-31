import PropTypes from 'prop-types';

export default function Tooltip({ text, children }) {
  return (
    <span className="group relative inline-block">
      {children}
      <span className="absolute hidden group-hover:block -mt-8 w-max bg-slate-700 text-white text-xs p-1 rounded">{text}</span>
    </span>
  );
}

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
