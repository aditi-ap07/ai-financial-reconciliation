import PropTypes from 'prop-types';

export default function ExportButton({ url, fileName, label }) {
  return (
    <a href={url} download={fileName} className="px-3 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">
      {label}
    </a>
  );
}

ExportButton.propTypes = {
  url: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  label: PropTypes.string,
};

ExportButton.defaultProps = { label: 'Export' };
