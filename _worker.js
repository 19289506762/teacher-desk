export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 只有 /api 路径才处理
    if (url.pathname === '/api') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }

      try {
        const requestBody = await request.json();
        const API_KEY = env.BAILIAN_API_KEY;
        const BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';

        const response = await fetch(`${BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: requestBody.model || 'qwen-plus',
            messages: requestBody.messages || [],
            temperature: requestBody.temperature || 0.7,
            max_tokens: requestBody.max_tokens || 2000,
          }),
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
        });
      }
    }

    // 其他请求走静态托管
    return new Response('Not Found', { status: 404 });
  }
};