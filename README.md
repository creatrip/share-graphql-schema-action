```yml
steps:
  - uses: creatrip/share-graphql-schema-action@main
    with:
      issue-number: ${{ github.event.number }}
      baseServerUrls: '["https://server-a.com/graphql", "https://server-a.com/graphql"]'
      schemaFilePathname: './schema.graphql'
```
