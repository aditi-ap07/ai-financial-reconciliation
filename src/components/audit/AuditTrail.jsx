import PropTypes from 'prop-types';

export default function AuditTrail({ actions }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Audit Trail</h2>
      <ul className="list-disc list-inside text-sm">
        {actions.map((a, idx) => (
          <li key={idx}>{a.timestamp}: {a.actionType} {a.itemId} {a.note}</li>
        ))}
      </ul>
    </div>
  );
}

AuditTrail.propTypes = {
  actions: PropTypes.array.isRequired,
};
