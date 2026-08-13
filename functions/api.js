// functions/api.js - Cloudflare Pages 兼容版
export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const requestBody = await context.request.json();
    const API_KEY = context.env.BAILIAN_API_KEY;
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
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '代理请求失败：' + error.message }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}