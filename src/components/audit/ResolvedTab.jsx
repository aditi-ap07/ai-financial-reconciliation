import PropTypes from 'prop-types';

export default function ResolvedTab({ resolvedItems }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Resolved Exceptions</h2>
      <ul className="list-disc list-inside text-sm">
        {resolvedItems.map((item) => (
          <li key={item.transaction_id}>{item.transaction_id}: {item.gap_type}</li>
        ))}
      </ul>
    </div>
  );
}

ResolvedTab.propTypes = {
  resolvedItems: PropTypes.array.isRequired,
};
