import swaggerJSDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDefinition: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JobConnect API",
      version: "1.0.0",
      description: "API documentation for JobConnect",
    },
    servers: [
      { url: "http://localhost:3000", description: "Development server" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./routes/*.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerDefinition);

const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;