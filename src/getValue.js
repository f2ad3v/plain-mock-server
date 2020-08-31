const compare = require('./compare');

const toStr = Object.prototype.toString;
const isObject = obj => toStr.call(obj) === '[object Object]';

const getValue = (obj, path) => {
  const paths = path.split('.');
  const keys = Object.keys(obj);

  for (let i = 0; i < paths.length; i++) {
    const currentPath = paths[i];
    const foundKey = keys.find(k => compare(k, currentPath) === 0);
    
    if (isObject(obj[foundKey]) && paths[i + 1]) {
      path = paths.slice(1).join('.')
      return getValue(obj[foundKey], path)
    } else {
      return obj[foundKey];
    }
  }
}

module.exports = getValue;