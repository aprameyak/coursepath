const fs = require('fs');
const path = require('path');

const validateNumber = (val, min = 0, max = Infinity) => {
  const num = parseInt(val);
  if (isNaN(num) || num < min || num > max) {
    throw new Error(`Invalid number: must be between ${min} and ${max}`);
  }
  return num;
};

const validateFloat = (val, min = 0, max = Infinity) => {
  const num = parseFloat(val);
  if (isNaN(num) || num < min || num > max) {
    throw new Error(`Invalid number: must be between ${min} and ${max}`);
  }
  return num;
};

const validateString = (val, minLen = 1, maxLen = 500) => {
  if (typeof val !== 'string') throw new Error('Must be a string');
  if (val.trim().length < minLen || val.length > maxLen) {
    throw new Error(`String must be ${minLen}-${maxLen} chars`);
  }
  return val.trim();
};

const validateSelect = (val, allowed) => {
  if (!allowed.includes(val)) {
    throw new Error(`Invalid option. Must be one of: ${allowed.join(', ')}`);
  }
  return val;
};

const validateDate = (val) => {
  const date = new Date(val);
  if (isNaN(date.getTime())) throw new Error('Invalid date');
  return date.toISOString();
};

const safeFileRead = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return null;
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('File read error:', err);
    throw new Error('Failed to read data');
  }
};

const safeFileWrite = (filePath, data) => {
  try {
    const tempFile = filePath + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
    fs.renameSync(tempFile, filePath);
  } catch (err) {
    console.error('File write error:', err);
    throw new Error('Failed to write data');
  }
};

const calculateStats = (numbers) => {
  if (!numbers || numbers.length === 0) return null;

  const sorted = [...numbers].filter(n => typeof n === 'number' && !isNaN(n)).sort((a, b) => a - b);
  if (sorted.length === 0) return null;

  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / sorted.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  return {
    count: sorted.length,
    median: Math.round(median),
    mean: Math.round(mean),
    min: Math.round(min),
    max: Math.round(max),
    p25: Math.round(sorted[Math.floor(sorted.length * 0.25)]),
    p75: Math.round(sorted[Math.floor(sorted.length * 0.75)])
  };
};

const escapeHtml = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const errorHandler = (err, res) => {
  console.error(err);
  if (err.message.includes('Invalid')) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Server error' });
};

module.exports = {
  validateNumber,
  validateFloat,
  validateString,
  validateSelect,
  validateDate,
  safeFileRead,
  safeFileWrite,
  calculateStats,
  escapeHtml,
  errorHandler
};
