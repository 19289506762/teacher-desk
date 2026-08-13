// functions/api/delete-account.js
export async function onRequest(context) {
    const { request, env } = context;
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const { userId, username, password } = await request.json();  // ✅ 增加 username
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

    // 验证密码（用普通登录接口）- ✅ 使用 username 构造邮箱
    const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: username + '@workbuddy.local',  // ✅ 改为 username
            password: password,
        }),
    });
    if (!authRes.ok) return new Response(JSON.stringify({ error: '密码错误' }), { status: 401 });

    // 删除用户（Admin API）
    const deleteRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${supabaseServiceKey}` },
    });
    if (!deleteRes.ok) throw new Error('删除用户失败');

    return new Response(JSON.stringify({ success: true }));
}