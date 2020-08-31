# plain-mock-server
Create mock services simply and quickly using koa web framework

## Installation

```
npm install plain-mock-server --save
```

## Usage

##### index.js
```js
const plainMock = require("plain-mock-server");

const mockUser = {
    method: 'get',
    route: '/v1/user/:id',
    response: {
        body: {
            name: 'user name',
            age: 33
        }
    }
}

plainMock(mockUser, 5001)
```

## Running
```shell
node index.js
```

## Testing
```shell
curl http://localhost:5001/v1/user/12345
```
##### response
```
StatusCode        : 200
StatusDescription : OK
Content           : {"name":"user name","age":33}
Headers           : {[Connection, keep-alive], [Content-Length, 29], [Content-Type, application/json; charset=utf-8], [Date, Sun, 30 Aug 2020 14:25:32 GMT]}
```