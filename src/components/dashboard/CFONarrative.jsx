import PropTypes from 'prop-types';

export default function CFONarrative({ text }) {
  return <p className="border-l-4 border-sky-500 bg-slate-50 p-3">{text}</p>;
}

CFONarrative.propTypes = {
  text: PropTypes.string.isRequired,
};
