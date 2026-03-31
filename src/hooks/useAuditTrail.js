/**
 * Hook for audit trail actions over exceptions
 */
import { useState } from 'react';

export function useAuditTrail() {
  const [actions, setActions] = useState([]);

  function record(actionType, itemId, note) {
    setActions((prev) => [...prev, { actionType, itemId, note, timestamp: new Date().toISOString() }]);
  }

  return { actions, record };
}
