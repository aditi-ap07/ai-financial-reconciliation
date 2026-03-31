/**
 * Seed data for reconciliation demo. Deterministic pseudo-random values.
 */
const seedData = (() => {
  let seed = 123456;
  function rand() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  const platformTransactions = [];
  const statuses = ['settled', 'captured'];
  const customerPrefixes = ['ACCT', 'CUST'];

  for (let i = 1; i <= 50; i += 1) {
    const id = `txn_${String(i).padStart(3, '0')}`;
    const day = String((i % 31) + 1).padStart(2, '0');
    let amount = Number((5 + rand() * 495).toFixed(2));
    if (id === 'txn_017') {
      amount = 142.87;
    }
    platformTransactions.push({
      transaction_id: id,
      customer_id: `${customerPrefixes[i % customerPrefixes.length]}_${String(i).padStart(3, '0')}`,
      amount,
      currency: 'GBP',
      created_at: `2025-03-${day}T0${(i % 24) + 1}:00:00Z`,
      status: i % 10 === 0 ? 'pending' : statuses[i % statuses.length],
    });
  }

  const bankSettlements = [];

  const tPlusN = (createdAt, n = 2) => {
    const d = new Date(createdAt);
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  };

  for (const tx of platformTransactions) {
    if (tx.transaction_id === 'txn_010') {
      continue; // unmatched
    }

    let settled_amount = tx.amount;
    let settlement_date = tPlusN(tx.created_at, 2);

    if (tx.transaction_id === 'txn_017') {
      settled_amount = 142.86;
    }
    if (tx.transaction_id === 'txn_031') {
      settlement_date = '2025-04-02';
    }

    bankSettlements.push({
      settlement_id: `stl_${tx.transaction_id}`,
      transaction_ref: tx.transaction_id,
      settled_amount,
      settlement_date,
      batch_id: `batch_${String((Number(tx.transaction_id.split('_')[1]) % 5) + 1).padStart(2, '0')}`,
    });

    if (tx.transaction_id === 'txn_022') {
      bankSettlements.push({
        settlement_id: `stl_${tx.transaction_id}_dup`,
        transaction_ref: tx.transaction_id,
        settled_amount,
        settlement_date,
        batch_id: `batch_${String((Number(tx.transaction_id.split('_')[1]) % 5) + 1).padStart(2, '0')}`,
      });
    }
  }

  bankSettlements.push({
    settlement_id: 'stl_orphan_001',
    transaction_ref: 'txn_orphan_refund',
    settled_amount: -67.5,
    settlement_date: '2025-03-28',
    batch_id: 'batch_09',
  });

  return { platformTransactions, bankSettlements };
})();

export const { platformTransactions, bankSettlements } = seedData;
