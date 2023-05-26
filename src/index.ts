import { buildSchema } from 'graphql';
import { getRemoteSDL } from './getRemoteSDL';
import { readFileSync } from 'fs';
import { mergeSchemas } from '@graphql-tools/schema';
import { printSchemaWithDirectives } from '@graphql-tools/utils';

async function main() {
  const core = require('@actions/core');

  const baseServerUrls = core.getInput('base-server-urls');
  const schemaFilePathname = core.getInput('schema-file-pathname');

  const remoteSchemas = await Promise.all(JSON.parse(baseServerUrls).map((url: string) => getRemoteSDL(url)));
  const localSchema = readFileSync(schemaFilePathname, 'utf8').replace(
    'directive @link(import: [link__Import], url: String!) on SCHEMA',
    'directive @link(url: String!, import: [link__Import]) on SCHEMA',
  );

  const schemas = [...remoteSchemas.map((remoteSchema) => buildSchema(remoteSchema)), buildSchema(localSchema)];
  const mergedSchema = mergeSchemas({ schemas });

  core.setOutput('sdl', printSchemaWithDirectives(mergedSchema));
}

main();
