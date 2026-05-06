import neo4j, { Driver } from "neo4j-driver";
import { ENV } from "../../../../config/env-config";

let driver: Driver;

/**
 * Obtém a instância do driver Neo4j
 * @returns Driver
 */
export const getNeo4jDriver = () => {
  if (!driver) {
    driver = neo4j.driver(
      ENV.URI_NEO4J,
      neo4j.auth.basic(
        ENV.USER_NEO4J,
        ENV.PASSWORD_NEO4J
      )
    );
  }
  return driver;
};