import { buildSchema } from 'graphql';
import { readFileSync, writeFileSync } from 'fs';
import { mergeSchemas } from '@graphql-tools/schema';
import { printSchemaWithDirectives } from '@graphql-tools/utils';

async function main() {
  const core = require('@actions/core');
  const schemaPaths: string[] = JSON.parse(core.getInput('schema-paths'));
  const schemaSDLs = schemaPaths.map((schemaPath) =>
    readFileSync(schemaPath, 'utf8')
      .replace('directive @link(import: [link__Import], url: String!) on SCHEMA', 'directive @link(url: String!, import: [link__Import]) on SCHEMA')
      .replace(
        'directive @cacheControl(inheritMaxAge: Boolean, maxAge: Int, scope: CacheControlScope) on FIELD_DEFINITION | INTERFACE | OBJECT | UNION',
        'directive @cacheControl(maxAge: Int, scope: CacheControlScope, inheritMaxAge: Boolean) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION',
      ),
  );
  const schemas = schemaSDLs.map((sdl) => buildSchema(sdl));
  const mergedSchema = mergeSchemas({ schemas });
  core.setOutput('sdl', printSchemaWithDirectives(mergedSchema));
}

main();
