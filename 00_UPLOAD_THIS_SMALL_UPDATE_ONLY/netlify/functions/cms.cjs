const headers = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
};

const siteId = "lets-bean-coffee";
const tableName = process.env.SUPABASE_CMS_TABLE || "site_content";
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "cms-uploads";

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function missingSupabaseConfig() {
  return ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"].filter(
    (key) => !process.env[key],
  );
}

function supabaseUrl(path) {
  return `${process.env.SUPABASE_URL.replace(/\/$/, "")}${path}`;
}

function supabaseHeaders(extra = {}) {
  return {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    ...extra,
  };
}

async function getSupabaseContent() {
  const response = await fetch(
    supabaseUrl(`/rest/v1/${tableName}?id=eq.${encodeURIComponent(siteId)}&select=content&limit=1`),
    {
      headers: supabaseHeaders({ accept: "application/json" }),
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase read failed: ${response.status}`);
  }

  const rows = await response.json();
  return rows?.[0]?.content || null;
}

async function saveSupabaseContent(content) {
  const response = await fetch(supabaseUrl(`/rest/v1/${tableName}`), {
    method: "POST",
    headers: supabaseHeaders({
      "content-type": "application/json",
      prefer: "resolution=merge-duplicates",
    }),
    body: JSON.stringify({
      id: siteId,
      content,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`Supabase save failed: ${response.status} ${message}`);
  }
}

async function uploadSupabasePhoto(payload) {
  if (!payload.dataUrl || typeof payload.dataUrl !== "string") {
    throw new Error("Missing photo data");
  }

  const match = payload.dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid photo data");
  }

  const contentType = payload.contentType || match[1] || "image/webp";
  const extension = contentType.includes("png")
    ? "png"
    : contentType.includes("jpeg") || contentType.includes("jpg")
      ? "jpg"
      : "webp";
  const safeName = String(payload.fileName || "photo")
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 54) || "photo";
  const objectPath = `${siteId}/${Date.now()}-${safeName}.${extension}`;
  const binary = Buffer.from(match[2], "base64");

  const uploadResponse = await fetch(
    supabaseUrl(`/storage/v1/object/${bucketName}/${objectPath}`),
    {
      method: "POST",
      headers: supabaseHeaders({
        "cache-control": "31536000",
        "content-type": contentType,
        "x-upsert": "true",
      }),
      body: binary,
    },
  );

  if (!uploadResponse.ok) {
    const message = await uploadResponse.text().catch(() => "");
    throw new Error(`Supabase upload failed: ${uploadResponse.status} ${message}`);
  }

  return {
    url: supabaseUrl(`/storage/v1/object/public/${bucketName}/${objectPath}`),
    path: objectPath,
  };
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "GET" && event.queryStringParameters?.diagnostics === "1") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          ok: true,
          cmsPasswordSet: Boolean(process.env.CMS_PASSWORD),
          supabaseUrlSet: Boolean(process.env.SUPABASE_URL),
          supabaseServiceRoleKeySet: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
          tableName,
          bucketName,
        }),
      };
    }

    if (event.httpMethod === "GET") {
      let content = null;

      if (hasSupabaseConfig()) {
        content = await getSupabaseContent();
      } else {
        const { getStore } = require("@netlify/blobs");
        const store = getStore("lets-bean-cms");
        content = await store.get("content", { type: "json" });
      }

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

    if (payload.action === "upload") {
      if (!hasSupabaseConfig()) {
        return {
          statusCode: 501,
          headers,
          body: JSON.stringify({ error: "Supabase photo storage is not configured yet" }),
        };
      }

      const upload = await uploadSupabasePhoto(payload);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, ...upload }),
      };
    }

    if (!payload.content || typeof payload.content !== "object") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing CMS content" }),
      };
    }

    if (hasSupabaseConfig()) {
      await saveSupabaseContent(payload.content);
    } else {
      const missing = missingSupabaseConfig();
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: `Supabase is not configured in Netlify. Missing: ${missing.join(", ")}`,
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, updatedAt: new Date().toISOString() }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "CMS function failed",
      }),
    };
  }
};
