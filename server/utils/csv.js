const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value).replaceAll('"', '""');
  return `"${stringValue}"`;
};

const toCsv = (rows) => {
  if (!rows.length) return '';

  const headers = Object.keys(rows[0]);
  const csvRows = [headers.join(',')];

  for (const row of rows) {
    csvRows.push(headers.map((header) => escapeCsvValue(row[header])).join(','));
  }

  return csvRows.join('\n');
};

module.exports = toCsv;