const crypto = require('crypto');

const generateTicketNumber = () => {
  const time = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TKT-${time}-${random}`;
};

module.exports = generateTicketNumber;