const path = require('path');

const asGlob = (dir) => `${dir.replace(/\\/g, '/')}/**/*.js`;

module.exports = {
  default: {
    require: [
      asGlob(path.resolve(__dirname, '../stepDefinitions')),
      asGlob(path.resolve(__dirname, 'support'))
    ]
  }
};
