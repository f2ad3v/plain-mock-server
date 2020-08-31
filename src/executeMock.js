const { pathToRegexp } = require("path-to-regexp");
const getValue = require('./getValue');
const compare = require('./compare');

const defaultResponseType = 'application/json';
const defaultStatusCode = 200;
const conditionalSourcePath = 'path';
const conditionalSourceBody = 'body';
const conditionalSourceHeader = 'header';
const conditionalOperadorEqual = '=';
const conditionalOperadorNotEqual = '!=';
const conditionalOperadorGreaterThan = '>';
const conditionalOperadorLessThan = '<';

const isSourcePath = source => compare(source, conditionalSourcePath) === 0;
const isSourceBody = source => compare(source, conditionalSourceBody) === 0;
const isSourceHeader = source => compare(source, conditionalSourceHeader) === 0;

const buildResponse = (ctx) => ({ status, body, type }) => {
  ctx.status = status;
  ctx.body = body;
  ctx.response.type = type;
  console.log(`Response body: ${body ? JSON.stringify(body) : 'undefined'}`);
}

const mockFailResponse = (message) => {
  return {
    status: 500,
    body: {
      message
    },
    type: defaultResponseType
  }
}

const buildFailResponse = (ctx) => (message) => {
  buildResponse(ctx)(mockFailResponse(message));

  return handlerResponse(false, true, true);
}

const isNumber = (type, value) => {
  if (type === undefined) {
    return !isNaN(value);
  }

  return compare('number', type) === 0;
}

const validateConditional = (operator, pathValue, conditionalValue, compareNumber) => {
  const compareResult = compare(pathValue, conditionalValue, compareNumber);

  if (operator === conditionalOperadorEqual) {
    return compareResult === 0;
  }
  else if (operator == conditionalOperadorNotEqual) {
    return compareResult !== 0;
  }
  else if (operator == conditionalOperadorGreaterThan) {
    return compareResult === 1;
  }
  else if (operator == conditionalOperadorLessThan) {
    return compareResult === -1;
  }
  
  return undefined;
}

const handlerResponse = (isValid, handled = false, failure = false) => {
  return {
    isValid,
    handled,
    failure
  }
}

const responseHandler = (route) => (ctx, response) => {
  const responseBuilder = buildResponse(ctx);

  const status = response.status || defaultStatusCode;
  const type = response.type || defaultResponseType;
  const body = response.body;

  if (!response.conditional) {
    responseBuilder({ status, body, type });
    return handlerResponse(true, true);
  }

  const variableName = response.conditional.variableName;
  const conditionalValue = response.conditional.value;

  if (!variableName || variableName === '') {
    return buildFailResponse(ctx)('Invalid conditional response! \'conditional.variableName\' is required');
  }

  if (!conditionalValue || conditionalValue === '') {
    return buildFailResponse(ctx)('Invalid conditional response! \'conditional.value\' is required');
  }

  const compareNumber = isNumber(response.conditional.type, conditionalValue);
  const source = response.conditional.source || conditionalSourcePath;
  const operator = response.conditional.operator || conditionalOperadorEqual;

  let value = undefined;

  if (isSourcePath(source)) {
    const keys = [];
    pathToRegexp(route, keys);
    
    const variable = keys.find(k => compare(k.name, variableName) === 0);

    if (!variable) {
      return buildFailResponse(ctx)('Invalid conditional response! \'conditional.variableName\' not found into route definition');
    }

    value = ctx.params[variable.name];
  } else if (isSourceBody(source) || isSourceHeader(source)) {
    const originValue = isSourceBody(source) ? ctx.request.body : ctx.request.headers;
    
    value = getValue(originValue, variableName);

    if (!value) {
      console.log(`Conditional variableName '${variableName}' not found into request ${source}`);
      return handlerResponse(false);
    }

  } else {
    return buildFailResponse(ctx)(`Invalid conditional source \'${source}\'! Accepted sources: \'path\'; \'body\'; \'header\'`);
  }

  const conditionalIsValid = validateConditional(operator, value, conditionalValue, compareNumber);
  
  if (conditionalIsValid === undefined) {
    return buildFailResponse(ctx)(`Invalid conditional operator \'${operator}\'! Accepted operators: '='; '!='; '>'; '<'`);
  }

  if (conditionalIsValid) {
    console.log(`Conditional: ${source}Value=[${variableName}]=${value}; conditional.value=${conditionalValue}; (${source}Value ${operator} conditional.value) = true`);
    responseBuilder({ status, body, type });
    return handlerResponse(true, true);
  }

  return handlerResponse(false);
}

const executeMock = ({ route, response }) => (ctx) => {
  if (!response) {
    buildFailResponse(ctx)('Failure to execute mock api! \'response\' is required');
    return;
  } else if (!Array.isArray(response) && !(typeof response === 'object')) {
    buildFailResponse(ctx)('Failure to execute mock api! Invalid \'response\' type');
    return;
  }

  const handler = responseHandler(route);

  let responseHandled;
  if (Array.isArray(response)) {
    for (const responseItem of response) {
      responseHandled = handler(ctx, responseItem);
      if (responseHandled.isValid || responseHandled.failure) {
        break;
      }
    }
  } else {
    responseHandled = handler(ctx, response);
  }

  if (!responseHandled.handled) {
    buildFailResponse(ctx)('No response was handled!');
  }
}

module.exports = executeMock;