const { getStore } = require("@netlify/blobs");

const headers = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
};

exports.handler = async (event) => {
  const store = getStore("lets-bean-cms");

  if (event.httpMethod === "GET") {
    const content = await store.get("content", { type: "json" });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ content: content || null }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const requiredPassword = process.env.CMS_PASSWORD;
  const providedPassword =
    event.headers["x-cms-password"] || event.headers["X-Cms-Password"];

  if (requiredPassword && providedPassword !== requiredPassword) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: "Invalid CMS password" }),
    };
  }

  const payload = JSON.parse(event.body || "{}");
  if (!payload.content || typeof payload.content !== "object") {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing CMS content" }),
    };
  }

  await store.setJSON("content", payload.content);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true, updatedAt: new Date().toISOString() }),
  };
};
