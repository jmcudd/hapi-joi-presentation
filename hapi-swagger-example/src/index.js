const Hapi = require("@hapi/hapi");
const Joi = require("@hapi/joi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("../package");

(async () => {
  const server = await new Hapi.Server({
    host: "localhost",
    port: 3000,
  });

  const swaggerOptions = {
    info: {
      title: "Test API Documentation",
      version: Pack.version,
    },
    grouping: 'tags'
  };

  const todos = [
    { id: 1, task: "Do your homework", dt: +new Date() },
    { id: 2, task: "Take out the trash", dt: +new Date() },
    { id: 3, task: "Exercise", dt: +new Date() },
    { id: 4, task: "Wash the car", dt: +new Date() },
    { id: 5, task: "Mow the lawn", dt: +new Date() },
    { id: 6, task: "Clean the bathroom", dt: +new Date() },
  ];

  server.route([
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
    },
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
  ]);

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  try {
    await server.start();
    console.log("Server running at:", server.info.uri);
  } catch (err) {
    console.log(err);
  }
})();
