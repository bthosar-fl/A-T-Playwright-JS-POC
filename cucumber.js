module.exports = {
  format: [
    'progress',
    'allure-cucumberjs/reporter'
          ],
  default: `--require stepDefinitions/**/*.js --require support/**/*.js --format progress`
};
