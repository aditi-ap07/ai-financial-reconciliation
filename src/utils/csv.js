/** convert array of objects to csv text */
export function exportToCSV(records, columns) {
  const header = columns.join(',');
  const rows = records.map((row) =>
    columns
      .map((col) => {
        const value = row[col] == null ? '' : String(row[col]);
        const escaped = value.replace(/"/g, '""');
        if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
          return `"${escaped}"`;
        }
        return escaped;
      })
      .join(',')
  );
  return `${header}\n${rows.join('\n')}`;
}

/** parse csv to array of object (simple loader) */
export function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const parts = line.split(',');
    return headers.reduce((obj, key, idx) => {
      obj[key] = parts[idx] || '';
      return obj;
    }, {});
  });
}
