const slides=[
`
# Hapi

<img src="./hapi.svg" style="float:right; width:30%; margin:10px;" />

Hapi is a light weight framework for building restful services with modules/plugins to extend functionality as needed.


## Features
  * Routing
  * Server Methods
  * Validation
  * Framework Plugins

>At Brave, developing web services with hapi allows us to focus on the many problems to be solved, not on the details of the tool being used. hapi provides the right set of core APIs and extensible plugins to support the requirements of a modern service - session management, security, connectivity, and testing. 
>
> -**Brendan Eich** Creator of JavaScript & CEO, Brave

`,
`
# Creating a Server

\`\`\`javascript
'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
\`\`\`

When creating a server, you can provide a hostname, IP address, a Unix socket file, or Windows named pipe to bind the server to. For more details, see the API reference.

The host property set to localhost is likely the safest choice. In a docker container, however, the localhost may not be accessible outside of the container and using host: '0.0.0.0' may be needed.
`,
`
# Routing

\`\`\`javascript
'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    //Add one route
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, h) {

            return 'Hello World!';
        }
    });

    //Add multiple routes at a time
    server.route([
      { method: 'GET', path: '/1', handler: function (request, h) { return 'ok'; } },
      { method: 'GET', path: '/2', handler: function (request, h) { return 'ok'; } }
    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
\`\`\`
`,
  `
  # Methods

  Server methods are functions registered with the server and used throughout the application as a common utility. Their advantage is in the ability to configure them to use the built-in cache and share across multiple request handlers without having to create a common module.


  \`\`\`javascript
  const Hapi = require('@hapi/hapi');
  const server = Hapi.server();

  server.method('add', (a, b) => (a + b));
  const result = server.methods.add(1, 2);    // 3
  \`\`\`


  \`\`\`javascript
  async function someHandler(req, h){
    const user = await req.server.methods.getUser(req.params.dn);
    // do something with the user object before returning the results.
  
    return "some results"
  }
  \`\`\`

  `,
`
# Route Validation 

\`\`\`javascript
server.route({
    method: 'GET',
    path: '/hello/{name}',
    handler: function (request, h) {

        return \`Hello \${request.params.name}!\`;
    },
    options: {
        validate: {
            params: Joi.object({
                name: Joi.string().min(3).max(10)
            })
        }
    }
});
\`\`\`
`,

`
# What is Joi?

The most powerful schema description language and data validator for JavaScript.

Joi lets you describe your data using a simple, intuitive, and readable language. Like the rest of the hapi ecosystem it fits in, joi allows you to describe your data for both input and output validation, as part of a hapi HTTP server or standalone.

  \`\`\`javascript
  const Joi = require('@hapi/joi');

  const schema = Joi.object({
      username: Joi.string()
          .alphanum()
          .min(3)
          .max(30)
          .required(),

      password: Joi.string()
          .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

      repeat_password: Joi.ref('password'),

      access_token: [
          Joi.string(),
          Joi.number()
      ],

      birth_year: Joi.number()
          .integer()
          .min(1900)
          .max(2013),

      email: Joi.string()
          .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
  })
      .with('username', 'birth_year')
      .xor('password', 'access_token')
      .with('password', 'repeat_password');


  schema.validate({ username: 'abc', birth_year: 1994 });

  \`\`\`

`,
`
# Hapi Modules / Plugins

No Middleware! Hundreds of modules and plugins extends hapi's core functionality. Extend hapi directly and share with other hapi projects. Truly bolt-on modules that don't interfere with other plugins.

<iframe height="70%" width="100%" src="https://hapi.dev/module/?sort=stars" scrolling="yes" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
`,

` # hapi-swagger

 Self documents the API based on the routes and the Joi validation on each route.

  https://www.npmjs.com/package/hapi-swagger

  \`\`\`javascript
  const Hapi = require('@hapi/hapi');
  const Inert = require('@hapi/inert');
  const Vision = require('@hapi/vision');
  const HapiSwagger = require('hapi-swagger');
  const Pack = require('./package');
   
  (async () => {
      const server = await new Hapi.Server({
          host: 'localhost',
          port: 3000,
      });
   
      const swaggerOptions = {
          info: {
                  title: 'Test API Documentation',
                  version: Pack.version,
              },
          };
   
      await server.register([
          Inert,
          Vision,
          {
              plugin: HapiSwagger,
              options: swaggerOptions
          }
      ]);
   
      try {
          await server.start();
          console.log('Server running at:', server.info.uri);
      } catch(err) {
          console.log(err);
      }
   
      server.route(Routes);
  })();
\`\`\`
`,
  `
  # hapi-swagger example

  http://localhost:3000/documentation

  <iframe style="float:right; margin-left:15px;" height="70%" width="50%" src="http://localhost:3000/documentation" scrolling="yes" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

  \`\`\`javascript
  server.route([
    {
      method: "GET",
      path: "/",
      options: {
        description: "Test Endpoint",
        notes: "Just the home page",
        tags: ["api", 'Other'],
        handler: () => "Hello World",
      },
    },
    {
      method: "GET",
      path: "/todo/{id}/",
      options: {
        handler: (req, h) => {
          return todos.find((todo) => Number(todo.id) == Number(req.params.id));
        },
        description: "Get todo",
        notes: "Returns a todo item by the id passed in the path",
        tags: ["api",'TODO'],
        validate: {
          params: Joi.object({
            id: Joi.number().required().description("the id for the todo item"),
          }),
        },
      },
    }
  ]);
  \`\`\`

  `,
  `
  # Hapi Documentation & Credit

  Examples and most content borrowed Hapi's amazingly well documented website https://hapi.dev/


<iframe height="70%" width="100%" src="https://hapi.dev/api/?v=19.1.1" scrolling="yes" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

  `

  ];

export default slides;
