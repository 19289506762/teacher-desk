export async function onRequest(context) {
  return new Response('Hello from Functions!', {
    headers: { 'Content-Type': 'text/plain' }
  });
}