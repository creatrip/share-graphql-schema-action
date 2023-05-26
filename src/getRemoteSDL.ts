import fetch from 'node-fetch';

export async function getRemoteSDL(endpoint: string): Promise<string> {
  const result = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{"query":"query __ApolloGetServiceDefinition__ { _service { sdl } }"}`,
  });
  const json = await result.json();
  return json.data._service.sdl;
}
