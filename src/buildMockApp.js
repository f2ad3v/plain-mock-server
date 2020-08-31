const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const logger = require('koa-logger');
const executeMock = require('./executeMock');

const addRoute = (router, moq) => {
  const method = moq.method || 'get';
  
  if (!moq.route) {
    console.log('route is required');
    return;
  } else if (typeof moq.route !== 'string') {
    console.log('route must be string');
    return;
  }

  console.log(`Adding route ${method} - ${moq.route}...`);

  if (method.toLocaleLowerCase() === 'get') {
    router.get(moq.route, executeMock(moq));
  } else if (method.toLocaleLowerCase() === 'put') {
    router.put(moq.route, executeMock(moq));
  } else if (method.toLocaleLowerCase() === 'post') {
    router.post(moq.route, executeMock(moq));
  } else if (method.toLocaleLowerCase() === 'del') {
    router.del(moq.route, executeMock(moq));
  } else if (method.toLocaleLowerCase() === 'patch') {
    router.patch(moq.route, executeMock(moq));
  } else {
    console.log(`Method ${method} not implemented`);
  }
}

const buildMockApp = (moqs) => {
  if (!moqs) {
    throw new Error('\'moqs\' is required')
  }

  const app = new Koa();
  const router = new Router();

  app.use(logger());

  app.use(koaBody());
    
  app.use(bodyParser({
    enableTypes: ['json'],
    jsonLimit: '2mb',
    strict: true
  }));

  if (Array.isArray(moqs)) {
    for (const moq of moqs) {
      addRoute(router, moq);
    }
  } else {
    addRoute(router, moqs);
  }

  app.use(router.routes());

  return app;
}

module.exports = buildMockApp;