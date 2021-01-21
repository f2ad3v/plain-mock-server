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
---
## Conditional and more

```js
const plainMock = require("plain-mock-server");

const mocList = [
    {
        method: 'get',                  // HTTP verbs. Accepts ['get','post','put','delete','patch']
        route: '/v1/user/:id/service/:srvid',
        response: [
            // return when id == '1234'
            {
                status: 200,            // http status code
                conditional: {
                    source: 'path',     // parameter informed on the route
                    variableName: 'id', // parameter name
                    value: '1234'       // conditional value
                },
                body: {                 // response body
                    name: 'service 1',
                    operator: 'operator A1'
                }
            },
            // return when id != 1234
            {
                status: 500,
                body: {
                    message: 'internal server error'
                }
            }
        ]
    },
    {
        method: 'post',
        route: '/v1/user',
        response: [
            // return when user.name == 'John'
            {
                status: 201,                    // http status code
                conditional: {
                    source: 'body',             // parameter informed on the request body
                    variableName: 'user.name',  // parameter object path
                    value: 'John'               // conditional value
                },
                body: {                         // response body
                    id: 1234
                }
            },
            // return when user.name != 'John'
            {
                status: 500,
                body: {
                    message: 'internal server error'
                }
            }
        ]
    },
    {
        method: 'put',
        route: '/v1/user',
        response: [
            // return when userid == '1234'
            {
                status: 204,                    // http status code
                conditional: {
                    source: 'header',           // parameter informed on the request header
                    variableName: 'userid',     // header name
                    value: '1234'                // conditional value
                }
            },
            // return when userid > 444
            {
                status: 400,                    // http status code
                conditional: {
                    source: 'header',           // parameter informed on the request header
                    variableName: 'userid',     // header name
                    operator: '>',              // conditional operator. Accepts ['=', '!=', '<', '>']
                    value: 444                  // conditional value
                }
            },
            // return when (userid != '1234' && userid < 444)
            {
                status: 500,
                body: {
                    message: 'internal server error'
                }
            }
        ]
    }
]

plainMock(mocList, 5001)
```