// _worker.js - 完整版（API 代理 + 静态页面托管）
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ----- 1. AI API 代理 -----
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

    // ----- 2. 静态页面托管（重要！） -----
    // 尝试从静态资源中获取请求的文件
    try {
      // 如果是根路径，直接返回 index.html
      if (url.pathname === '/' || url.pathname === '') {
        return await env.ASSETS.fetch(new Request(url.origin + '/index.html', request));
      }
      // 其他静态资源（.html, .css, .js, .png 等）正常返回
      return await env.ASSETS.fetch(request);
    } catch (error) {
      // 如果静态资源不存在，返回 404
      return new Response('Not Found', { status: 404 });
    }
  }
};