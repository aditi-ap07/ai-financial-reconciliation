import PropTypes from 'prop-types';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      className="border rounded px-2 py-1 w-full"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

SearchBar.defaultProps = {
  value: '',
  placeholder: 'Search...',
};
