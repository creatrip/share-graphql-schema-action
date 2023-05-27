import { buildSchema } from 'graphql';
import { readFileSync } from 'fs';
import { mergeSchemas } from '@graphql-tools/schema';
import { printSchemaWithDirectives } from '@graphql-tools/utils';

async function main() {
  const core = require('@actions/core');

  const otherServerSchemaPaths: string[] = JSON.parse(core.getInput('other-server-schema-paths'));
  const currentServerSchemaPath: string = core.getInput('current-server-schema-path');

  const otherServerSchemasSDL = otherServerSchemaPaths.map((schemaPath) => readFileSync(schemaPath, 'utf8'));
  const currentServerSchemasSDL = readFileSync(currentServerSchemaPath, 'utf8').replace(
    'directive @link(import: [link__Import], url: String!) on SCHEMA',
    'directive @link(url: String!, import: [link__Import]) on SCHEMA',
  );

  const schemasSDL: string[] = [...otherServerSchemasSDL, currentServerSchemasSDL];
  const schemas = schemasSDL.map((sdl) => buildSchema(sdl));
  const mergedSchema = mergeSchemas({ schemas });

  core.setOutput('sdl', printSchemaWithDirectives(mergedSchema));
}

main();
