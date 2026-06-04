// Table & List Utilities
// Helpers for interacting with HTML tables and lists

/**
 * Get all rows from a table as array of objects
 */
async function getTableData(page, tableSelector) {
  return await page.evaluate((selector) => {
    const table = document.querySelector(selector);
    if (!table) return [];

    const headers = Array.from(table.querySelectorAll('thead th, thead td'))
      .map(th => th.textContent.trim());

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    return rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      const obj = {};
      cells.forEach((cell, i) => {
        obj[headers[i] || `col${i}`] = cell.textContent.trim();
      });
      return obj;
    });
  }, tableSelector);
}

/**
 * Get row count in a table
 */
async function getTableRowCount(page, tableSelector) {
  return await page.locator(`${tableSelector} tbody tr`).count();
}

/**
 * Click on a specific cell in a table
 */
async function clickTableCell(page, tableSelector, rowIndex, colIndex) {
  await page.locator(`${tableSelector} tbody tr`).nth(rowIndex)
    .locator('td').nth(colIndex).click();
}

/**
 * Find a row in table by cell text and click it
 */
async function clickRowByText(page, tableSelector, searchText) {
  await page.locator(`${tableSelector} tbody tr`)
    .filter({ hasText: searchText }).first().click();
}

/**
 * Get all items from a list (ul/ol)
 */
async function getListItems(page, listSelector) {
  return await page.locator(`${listSelector} li`).allTextContents();
}

/**
 * Sort table by clicking a column header
 */
async function sortTableByColumn(page, tableSelector, columnName) {
  await page.locator(`${tableSelector} thead th, ${tableSelector} thead td`)
    .filter({ hasText: columnName }).click();
}

module.exports = {
  getTableData,
  getTableRowCount,
  clickTableCell,
  clickRowByText,
  getListItems,
  sortTableByColumn
};
