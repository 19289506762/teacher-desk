// netlify/functions/api.js
const fetch = require('node-fetch');

// ⚠️ 重要：API Key 通过 Netlify 环境变量配置，不要硬编码！
const API_KEY = process.env.BAILIAN_API_KEY;
const BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';

exports.handler = async (event) => {
  // 只接受 POST 请求
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const requestBody = JSON.parse(event.body);

    // 转发请求到阿里云百炼（OpenAI 兼容模式）
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

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // 允许前端跨域
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '代理请求失败：' + error.message }),
    };
  }
};