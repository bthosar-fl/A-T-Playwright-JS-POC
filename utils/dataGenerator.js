// Test Data Generation Utilities
// Dynamic data generators to avoid conflicts in parallel/repeated runs

const crypto = require('crypto');

/**
 * Generate a unique string with prefix
 */
function uniqueId(prefix = 'Auto') {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(3).toString('hex');
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Generate a random number within range
 */
function randomNumber(min = 1000, max = 99999) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random email address
 */
function randomEmail(prefix = 'test') {
  return `${prefix}_${Date.now()}@automation.test`;
}

/**
 * Generate a random phone number (10 digits)
 */
function randomPhone() {
  return `9${randomNumber(100000000, 999999999)}`;
}

/**
 * Generate a random PIN (5 digits)
 */
function randomPin() {
  return String(randomNumber(10000, 99999));
}

/**
 * Format date as MM/DD/YYYY
 */
function formatDate(date) {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

/**
 * Get today's date formatted
 */
function today() {
  return formatDate(new Date());
}

/**
 * Get a future date (days from now)
 */
function futureDate(daysFromNow = 1) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return formatDate(date);
}

/**
 * Get a past date (days ago)
 */
function pastDate(daysAgo = 1) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return formatDate(date);
}

/**
 * Generate random first name from a pool
 */
function randomFirstName() {
  const names = ['Alex', 'Jordan', 'Morgan', 'Taylor', 'Casey', 'Riley', 'Quinn', 'Drew', 'Avery', 'Sage'];
  return names[Math.floor(Math.random() * names.length)];
}

/**
 * Generate random last name from a pool
 */
function randomLastName() {
  const names = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Clark', 'Hall', 'Lee', 'Young', 'King'];
  return names[Math.floor(Math.random() * names.length)];
}

/**
 * Generate a full employee test data object with unique values
 */
function generateEmployee(overrides = {}) {
  const empId = String(randomNumber(1000, 9999));
  return {
    firstName: overrides.firstName || empId,
    lastName: overrides.lastName || `Emp_Auto_${empId}`,
    empId: overrides.empId || empId,
    email: overrides.email || randomEmail('emp'),
    phone: overrides.phone || randomPhone(),
    pin: overrides.pin || randomPin(),
    startDate: overrides.startDate || pastDate(365),
    endDate: overrides.endDate || futureDate(365),
    birthDate: overrides.birthDate || '03/15/1990',
    ...overrides
  };
}

/**
 * Generate a unique absence reason name
 */
function generateAbsenceReasonName(prefix = 'AR_Auto') {
  return `${prefix}_${randomNumber(1000, 9999)}`;
}

module.exports = {
  uniqueId,
  randomNumber,
  randomEmail,
  randomPhone,
  randomPin,
  formatDate,
  today,
  futureDate,
  pastDate,
  randomFirstName,
  randomLastName,
  generateEmployee,
  generateAbsenceReasonName
};
