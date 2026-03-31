export const GAP_TYPES = {
  NEXT_MONTH: {
    id: 'NEXT_MONTH',
    label: 'Next Month Settlement',
    color: 'blue',
    action: 'Defer to next month reconciliation run',
    severity: 'LOW',
  },
  ROUNDING: {
    id: 'ROUNDING',
    label: 'Rounding Difference',
    color: 'amber',
    action: 'Verify with payment processor rounding rules',
    severity: 'MEDIUM',
  },
  DUPLICATE: {
    id: 'DUPLICATE',
    label: 'Duplicate Settlement',
    color: 'red',
    action: 'Request bank reversal for duplicate entry',
    severity: 'HIGH',
  },
  ORPHAN: {
    id: 'ORPHAN',
    label: 'Orphan Refund',
    color: 'red',
    action: 'Escalate to finance team — no original transaction found',
    severity: 'HIGH',
  },
  UNMATCHED: {
    id: 'UNMATCHED',
    label: 'No Settlement Found',
    color: 'grey',
    action: 'Chase bank for settlement status',
    severity: 'MEDIUM',
  },
};
