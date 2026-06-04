module.exports = {
  /**
   * Formats a date value into MM/DD/YYYY string.
   * @param {string|Date} date - The date to format.
   * @returns {string} The formatted date string.
   */
  formatDate(date) {
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yy = d.getFullYear();
    return `${mm}/${dd}/${yy}`;
  },

  /**
   * Safely retrieves a nested property from an object using a dot-notation path.
   * @param {Object} obj - The source object.
   * @param {string} path - Dot-separated path to the property (e.g., 'user.address.city').
   * @param {*} defaultValue - Value to return if the path does not resolve.
   * @returns {*} The resolved value or the default.
   */
  safeGet(obj, path, defaultValue) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj) ?? defaultValue;
  }
};
