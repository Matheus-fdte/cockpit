const stripComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const argumentNames = /([^\s,]+)/g;
function getParamNames(func) {
  const fnStr = func.toString().replace(stripComments, '');
  let result = fnStr.slice(
    fnStr.indexOf('(') + 1, fnStr.indexOf(')'),
  ).match(argumentNames);
  if (result === null) { result = []; }
  return result;
}

function extensionTypeIdentifier(fn) {
  if (fn && fn instanceof Function && fn.length > 0) {
    const params = getParamNames(fn) || [];
    if (params.includes('ctx' || 'next')) {
      return 'middleware';
    }
    // TODO: extensions for cockpit
    throw new Error('you must pass a valid function');
  } else {
    throw new Error('you must pass a valid function');
  }
}

module.exports = extensionTypeIdentifier;
