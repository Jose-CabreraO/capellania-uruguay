const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyOjpmYaxXQaTBZrN9v1d5jYBmbjss5gTrUguODONaMHkKJuFqQiThkNRs1Rquw6Qcp/exec";

const MAX_BODY_BYTES = 24 * 1024;
const MIN_FILL_TIME_MS = 2200;
const FORWARD_TIMEOUT_MS = 15000;

const ALLOWED_FIELDS = [
  "fecha_hora",
  "formulario_origen",
  "schema_version",
  "estado",
  "nombre",
  "edad",
  "email",
  "telefono",
  "ciudad",
  "tipo_pase",
  "restriccion_gluten",
  "restriccion_lactosa",
  "restriccion_otra",
  "restriccion_detalle",
  "pareja_nombre",
  "pareja_edad",
  "pareja_email",
  "pareja_restriccion_gluten",
  "pareja_restriccion_lactosa",
  "pareja_restriccion_otra",
  "pareja_restriccion_detalle",
  "factura",
  "ruc",
  "razon_social",
  "direccion_facturacion",
  "ayuda_hospedaje",
  "comprobante_estado",
  "observaciones",
  "monto_calculado",
  "user_agent",
];

const FIELD_LIMITS = {
  fecha_hora: 40,
  formulario_origen: 80,
  schema_version: 8,
  estado: 60,
  nombre: 120,
  edad: 3,
  email: 160,
  telefono: 40,
  ciudad: 100,
  tipo_pase: 20,
  restriccion_gluten: 2,
  restriccion_lactosa: 2,
  restriccion_otra: 2,
  restriccion_detalle: 180,
  pareja_nombre: 120,
  pareja_edad: 3,
  pareja_email: 160,
  pareja_restriccion_gluten: 2,
  pareja_restriccion_lactosa: 2,
  pareja_restriccion_otra: 2,
  pareja_restriccion_detalle: 180,
  factura: 2,
  ruc: 40,
  razon_social: 160,
  direccion_facturacion: 180,
  ayuda_hospedaje: 2,
  comprobante_estado: 40,
  observaciones: 500,
  monto_calculado: 12,
  user_agent: 500,
};

const REQUIRED_FIELDS = [
  "nombre",
  "edad",
  "email",
  "telefono",
  "ciudad",
  "tipo_pase",
  "factura",
  "ayuda_hospedaje",
];

const TEXT_FIELDS_FOR_SPAM = [
  "nombre",
  "telefono",
  "ciudad",
  "restriccion_detalle",
  "pareja_nombre",
  "pareja_restriccion_detalle",
  "ruc",
  "razon_social",
  "direccion_facturacion",
  "observaciones",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /\b(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|info|io|ru|xyz|top|click|link|site|online|co|me|app|dev|py)\/)[^\s]*/gi;
const FRAUD_RE = /\b(transaction|top\s*up|balance|wallet|bitcoin|crypto|usdt|airdrop|binance|withdraw|deposit)\b/i;

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed", stage: "request_method" }, 200);
  }

  return handlePost(context);
}

async function handlePost({ request, env }) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/x-www-form-urlencoded")) {
      return json({ ok: false, error: "invalid_content_type", stage: "content_type" }, 200);
    }

    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > MAX_BODY_BYTES) {
      return json({ ok: false, error: "request_too_large", stage: "request_size" }, 200);
    }

    const body = await request.text();
    if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) {
      return json({ ok: false, error: "request_too_large", stage: "request_size" }, 200);
    }

    const raw = new URLSearchParams(body);
    const spamRisk = assessSpamRisk(raw, request, env);

    if (spamRisk.isSpam) {
      return json({ ok: false, error: "spam_filter", stage: "spam_filter" }, 200);
    }

    const validation = validatePayload(raw);
    if (!validation.ok) {
      return json({ ok: false, error: validation.error, stage: "validation" }, 200);
    }

    const sharedSecret = env.REGISTRO_SHARED_SECRET;
    if (!sharedSecret) {
      console.error("REGISTRO_SHARED_SECRET no esta configurado.");
      return json({
        ok: false,
        error: "missing_cloudflare_secret",
        stage: "cloudflare_secret",
      }, 200);
    }

    const destination = env.REGISTRO_GOOGLE_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL;
    const payload = buildForwardPayload(raw);
    payload.set("registro_shared_secret", sharedSecret);

    const response = await forwardToGoogleAppsScript(destination, payload);
    const result = await parseAppsScriptResponse(response);

    if (!response.ok || !result || result.ok !== true || !result.registro_id) {
      console.error("Google Apps Script no confirmo el registro.", {
        status: response.status,
        result,
      });
      return json({
        ok: false,
        error: result && result.error ? result.error : "upstream_not_confirmed",
        stage: "google_apps_script",
        upstream_status: response.status,
        upstream_json: Boolean(result),
      }, 200);
    }

    return json({ ok: true, registro_id: result.registro_id }, 200);
  } catch (error) {
    console.error("Error procesando registro:", error && error.message ? error.message : error);
    return json({
      ok: false,
      error: "worker_exception",
      stage: "cloudflare_function",
      detail: error && error.name ? error.name : "Error",
    }, 200);
  }
}

function buildForwardPayload(raw) {
  const payload = new URLSearchParams();

  ALLOWED_FIELDS.forEach((field) => {
    payload.set(field, normalize(raw.get(field) || ""));
  });

  return payload;
}

function validatePayload(raw) {
  for (const field of REQUIRED_FIELDS) {
    if (!normalize(raw.get(field) || "")) {
      return { ok: false, error: "Faltan campos obligatorios" };
    }
  }

  for (const field of ALLOWED_FIELDS) {
    const value = normalize(raw.get(field) || "");
    const limit = FIELD_LIMITS[field] || 500;
    if (value.length > limit) {
      return { ok: false, error: "Uno de los campos supera el tamano permitido" };
    }
  }

  if (!EMAIL_RE.test(normalize(raw.get("email") || ""))) {
    return { ok: false, error: "Correo electronico no valido" };
  }

  const edad = Number(raw.get("edad"));
  if (!Number.isInteger(edad) || edad < 18 || edad > 120) {
    return { ok: false, error: "Edad no valida" };
  }

  const tipoPase = normalize(raw.get("tipo_pase") || "");
  if (!["individual", "pareja"].includes(tipoPase)) {
    return { ok: false, error: "Tipo de pase no valido" };
  }

  if (tipoPase === "pareja") {
    const parejaEdad = Number(raw.get("pareja_edad"));
    if (!normalize(raw.get("pareja_nombre") || "") || !EMAIL_RE.test(normalize(raw.get("pareja_email") || ""))) {
      return { ok: false, error: "Faltan datos de la segunda persona" };
    }
    if (!Number.isInteger(parejaEdad) || parejaEdad < 18 || parejaEdad > 120) {
      return { ok: false, error: "Edad de la segunda persona no valida" };
    }
  }

  const factura = normalize(raw.get("factura") || "");
  if (!["si", "no"].includes(factura)) {
    return { ok: false, error: "Valor de facturacion no valido" };
  }

  if (factura === "si") {
    if (
      !normalize(raw.get("ruc") || "") ||
      !normalize(raw.get("razon_social") || "") ||
      !normalize(raw.get("direccion_facturacion") || "")
    ) {
      return { ok: false, error: "Faltan datos de facturacion" };
    }
  }

  const ayudaHospedaje = normalize(raw.get("ayuda_hospedaje") || "");
  if (!["si", "no"].includes(ayudaHospedaje)) {
    return { ok: false, error: "Valor de hospedaje no valido" };
  }

  return { ok: true };
}

function assessSpamRisk(raw, request, env) {
  let score = 0;

  if (normalize(raw.get("company_website") || "")) {
    return { score: 100, isSpam: true };
  }

  const startedAt = Number(raw.get("form_started_at") || "0");
  if (startedAt > 0) {
    const elapsed = Date.now() - startedAt;
    if (elapsed >= 0 && elapsed < MIN_FILL_TIME_MS) score += 2;
  }

  if (!isAllowedRequestSource(request, env)) {
    score += 2;
  }

  const combinedText = TEXT_FIELDS_FOR_SPAM
    .map((field) => normalize(raw.get(field) || ""))
    .filter(Boolean)
    .join(" ");

  const urls = combinedText.match(URL_RE) || [];
  if (urls.length === 1) score += 2;
  if (urls.length > 1) score += 4;

  if (FRAUD_RE.test(combinedText)) score += 2;
  if (/graph\.org\/balance/i.test(combinedText)) score += 4;
  if (hasAbnormalSymbolDensity(combinedText)) score += 1;
  if (hasRepetitiveContent(combinedText)) score += 1;

  return { score, isSpam: score >= 4 };
}

function isAllowedRequestSource(request, env) {
  const configured = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allowedOrigins = configured.length
    ? configured
    : [
        "https://www.capellania.org.py",
        "https://capellania.org.py",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
      ];

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origin) {
    return allowedOrigins.includes(origin);
  }

  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      return allowedOrigins.includes(refererOrigin);
    } catch (_) {
      return false;
    }
  }

  return true;
}

async function forwardToGoogleAppsScript(url, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FORWARD_TIMEOUT_MS);

  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: payload.toString(),
      signal: controller.signal,
      redirect: "follow",
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function parseAppsScriptResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
}

function hasAbnormalSymbolDensity(value) {
  if (value.length < 24) return false;
  const symbolCount = (value.match(/[>$*_={}[\]|~`^]/g) || []).length;
  return symbolCount / value.length > 0.12;
}

function hasRepetitiveContent(value) {
  if (value.length < 40) return false;
  return /(.{8,})\1{2,}/i.test(value);
}

function normalize(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function neutralSuccess() {
  return json({ ok: true });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "no-store",
    },
  });
}
