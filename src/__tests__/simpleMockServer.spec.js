const request = require('supertest');
const buildMockApp = require('../buildMockApp');

describe('Simple Mock Server Tests', () => {
  describe('Execute Mock', () => {
    describe('Successes', () => {
      test('When request method is \'get\'', async () => {
        const app = buildMockApp({
          method: 'get',
          route: '/v1/user/:id',
          response: {
            body: {
              name: 'user name',
              age: 33
            }
          }
        });
  
        const response = await request(app.callback())
          .get('/v1/user/1234');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.name).toBe('user name');
        expect(response.body.age).toBe(33);
      });

      test('When request method is \'post\'', async () => {
        const app = buildMockApp({
          method: 'post',
          route: '/v1/user',
          response: {
            status: 201,
            body: {
              id: 12345
            }
          }
        });
  
        const response = await request(app.callback())
          .post('/v1/user')
          .send({
            name: 'user name',
            age: 33
          });

        expect(response.status).toBe(201);
        expect(response.body).toBeDefined();
        expect(response.body.id).toBe(12345);
      });

      test('When request method is \'put\'', async () => {
        const app = buildMockApp({
          method: 'put',
          route: '/v1/user',
          response: {
            status: 204
          }
        });
  
        const response = await request(app.callback())
          .put('/v1/user')
          .send({
            status: 'completed'
          });

        expect(response.status).toBe(204);
      });

      test('When request method is \'del\'', async () => {
        const app = buildMockApp({
          method: 'del',
          route: '/v1/user/:id',
          response: {
            status: 204
          }
        });
  
        const response = await request(app.callback()).del('/v1/user/123');

        expect(response.status).toBe(204);
      });

      test('When request method is \'patch\'', async () => {
        const app = buildMockApp({
          method: 'patch',
          route: '/v1/user/:id/service',
          response: {
            status: 204
          }
        });
  
        const response = await request(app.callback())
          .patch('/v1/user/123/service')
          .send({
            nickname: 'nickname',
            optionId: 67433
          });

        expect(response.status).toBe(204);
      });

      test('When coditional source is \'path\'', async () => {
        const app = buildMockApp([
          {
            method: 'get',
            route: '/v1/user/:id/service/:srvid',
            response: {
              conditional: {
                source: 'path',
                variableName: 'id',
                value: '1234'
              },
              body: {
                name: 'service 1',
                operator: 'operator A1'
              }
            }
          }
        ]);
  
        const response = await request(app.callback())
          .get('/v1/user/1234/service/987');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.name).toBe('service 1');
        expect(response.body.operator).toBe('operator A1');
      });

      test('When coditional source is \'body\'', async () => {
        const app = buildMockApp([
          {
            method: 'post',
            route: '/v1/user',
            response: {
              conditional: {
                source: 'body',
                variableName: 'user.name',
                value: 'conditional source body'
              },
              status: 201,
              body: {
                id: 1234
              }
            }
          }
        ]);
  
        const response = await request(app.callback())
          .post('/v1/user')
          .send({ user: { name: 'conditional source body', age: 42, phone: '123456789' } });
          
        expect(response.status).toBe(201);
        expect(response.body).toBeDefined();
        expect(response.body.id).toBe(1234);
      });

      test('When coditional source is \'header\'', async () => {
        const app = buildMockApp([
          {
            method: 'put',
            route: '/v1/user',
            response: {
              conditional: {
                source: 'header',
                variableName: 'userid',
                value: '123'
              },
              status: 204
            }
          }
        ]);
  
        const response = await request(app.callback())
          .put('/v1/user')
          .set({ userid: '123'})
          .send({ status: 'progress' });

        expect(response.status).toBe(204);
      });

      test('When coditional operator is \'equal\'', async () => {
        const app = buildMockApp([
          {
            method: 'get',
            route: '/v1/service/test/:id',
            response: {
              conditional: {
                source: 'path',
                operator: '=',
                variableName: 'id',
                value: '1234'
              },
              body: {
                status: true,
                operator: 'equal'
              }
            }
          }
        ]);
  
        const response = await request(app.callback()).get('/v1/service/test/1234');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.status).toBe(true);
        expect(response.body.operator).toBe('equal');
      });
  
      test('When coditional operator is \'not equal\'', async () => {
        const app = buildMockApp([
          {
            method: 'get',
            route: '/v1/service/test/:id',
            response: {
              conditional: {
                source: 'path',
                operator: '!=',
                variableName: 'id',
                value: 1234
              },
              body: {
                status: true,
                operator: 'not equal'
              }
            }
          }
        ]);
  
        const response = await request(app.callback()).get('/v1/service/test/123');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.status).toBe(true);
        expect(response.body.operator).toBe('not equal');
      });
  
      test('When coditional operator is \'greater than\'', async () => {
        const app = buildMockApp([
          {
            method: 'get',
            route: '/v1/service/test/:id',
            response: {
              conditional: {
                source: 'path',
                operator: '>',
                variableName: 'id',
                value: 1234
              },
              body: {
                status: true,
                operator: 'greater than'
              }
            }
          }
        ]);
  
        const response = await request(app.callback()).get('/v1/service/test/12345');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.status).toBe(true);
        expect(response.body.operator).toBe('greater than');
      });
  
      test('When coditional operator is \'less than\'', async () => {
        const app = buildMockApp([
          {
            method: 'get',
            route: '/v1/service/test/:id',
            response: {
              conditional: {
                source: 'path',
                operator: '<',
                variableName: 'id',
                type: 'number',
                value: 1234
              },
              body: {
                status: true,
                operator: 'less than'
              }
            }
          }
        ]);
  
        const response = await request(app.callback()).get('/v1/service/test/123');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.status).toBe(true);
        expect(response.body.operator).toBe('less than');
      });
  
      test('Returning a default response', async () => {
        const app = buildMockApp([
          {
            method: 'get',
            route: '/v1/service/test/:id',
            response: [
              {
                conditional: {
                  variableName: 'id',
                  value: 1234
                },
                body: {
                  status: true
                }
              },
              {
                status: 201,
                body: {
                  message: 'default response'
                }
              }
            ]
          }
        ]);
  
        const response = await request(app.callback()).get('/v1/service/test/123');

        expect(response.status).toBe(201);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe('default response');
      });
    });

    describe('Failures', () => {
      test('Should return 500 when response not defined', async () => {
        const app = buildMockApp({
          method: 'get',
          route: '/v1/service/test/:id'
        });
  
        const response = await request(app.callback()).get('/v1/service/test/123');
        expect(response.status).toBe(500);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe('Failure to execute mock api! \'response\' is required');
      });
  
      test('Should return 500 when send invalid response type', async () => {
        const app = buildMockApp({
          method: 'get',
          route: '/v1/service/test/:id',
          response: 'invalid type'
        });
  
        const response = await request(app.callback()).get('/v1/service/test/123');
        expect(response.status).toBe(500);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe('Failure to execute mock api! Invalid \'response\' type');
      });
  
      test('Should return 500 when send response conditional without variableName', async () => {
        const app = buildMockApp({
          method: 'get',
          route: '/v1/service/test/:id',
          response: {
            conditional: {}
          }
        });
  
        const response = await request(app.callback()).get('/v1/service/test/123');
        expect(response.status).toBe(500);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe('Invalid conditional response! \'conditional.variableName\' is required');
      });
  
      test('Should return 500 when send response conditional without value', async () => {
        const app = buildMockApp({
          method: 'get',
          route: '/v1/service/test/:id',
          response: {
            conditional: {
              variableName: 'id'
            }
          }
        });
  
        const response = await request(app.callback()).get('/v1/service/test/123');
        expect(response.status).toBe(500);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe('Invalid conditional response! \'conditional.value\' is required');
      });
  
      test('Should return 500 when response conditional variableName not found into route definition', async () => {
        const app = buildMockApp({
          method: 'get',
          route: '/v1/service/test/:id',
          response: {
            conditional: {
              variableName: 'idx',
              value: 1234
            }
          }
        });
  
        const response = await request(app.callback()).get('/v1/service/test/123');
        expect(response.status).toBe(500);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe('Invalid conditional response! \'conditional.variableName\' not found into route definition');
      });
  
      test('Should return 500 when response conditional variableName not found into body request', async () => {
        const app = buildMockApp({
          method: 'post',
          route: '/v1/service/test',
          response: {
            conditional: {
              source: 'body',
              variableName: 'user.x.id',
              value: '1234'
            }
          }
        });
  
        const response = await request(app.callback()).post('/v1/service/test').send({ user: { data: { id: 1234 }} });
        expect(response.status).toBe(500);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe('No response was handled!');
      });
  
      test('Should return 500 when send invalid response conditional operator', async () => {
        const app = buildMockApp({
          method: 'get',
          route: '/v1/service/test/:id',
          response: {
            conditional: {
              variableName: 'id',
              value: 1234,
              operator: 'x'
            }
          }
        });
  
        const response = await request(app.callback()).get('/v1/service/test/123');
        expect(response.status).toBe(500);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe('Invalid conditional operator \'x\'! Accepted operators: \'=\'; \'!=\'; \'>\'; \'<\'');
      });
  
      test('Should return 500 when send invalid response conditional source', async () => {
        const app = buildMockApp({
          method: 'get',
          route: '/v1/service/test/:id',
          response: {
            conditional: {
              source: 'abc',
              variableName: 'id',
              value: 1234
            }
          }
        });
  
        const response = await request(app.callback()).get('/v1/service/test/123');
        expect(response.status).toBe(500);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe('Invalid conditional source \'abc\'! Accepted sources: \'path\'; \'body\'; \'header\'');
      });
    });
  });

  describe('Failures - Build Mock App', () => {
    test('Must throw exception when parameter is null', () => {
      try {
        buildMockApp();
        throw new Error('test failure');
      } catch (error) {
        expect(error.message).toBe('\'moqs\' is required');
      }
    });

    test('Must return 404 when route path not specified', async () => {
      const app = buildMockApp({});
      const response = await request(app.callback()).get('/');
      expect(response.status).toBe(404);
    });

    test('Must return 404 when route path isn\'t string', async () => {
      const app = buildMockApp({ route: 123 });
      const response = await request(app.callback()).get('/');
      expect(response.status).toBe(404);
    });

    test('Should return 404 when the route method is not implemented', async () => {
      const app = buildMockApp({ route: '/', method: 'header' });
      const response = await request(app.callback()).get('/');
      expect(response.status).toBe(404);
    });
  });
});
