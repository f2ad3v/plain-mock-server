const simpleMockServer = require('../index');

const mockListen = jest.fn();

describe('Server execute', () => {
  afterEach(() => {
    mockListen.mockReset();
  });

  test('Server works', async () => {
    simpleMockServer({
        method: 'get',
        route: '/v1/user/:id',
        response: {
          body: {
            name: 'user name',
            age: 33
          }
        }
      }, 5234, mockListen);

    expect(mockListen.mock.calls.length).toBe(1);
    expect(mockListen.mock.calls[0][0]).toBe(5234);
  });
});