import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

function loadEnvFile(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(resolve(root, ".env"));
loadEnvFile(resolve(root, ".env.local"));

const baseUrl = (process.env.VITE_POCKETBASE_URL ?? "").trim().replace(/\/$/, "");
const email = (process.env.POCKETBASE_ADMIN_EMAIL ?? "").trim();
const password = process.env.POCKETBASE_ADMIN_PASSWORD ?? "";

if (!baseUrl || !email || !password) {
  console.error(
    "Нужны VITE_POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL и POCKETBASE_ADMIN_PASSWORD.",
  );
  process.exit(1);
}

const content = JSON.parse(readFileSync(resolve(root, "src/content/site.default.json"), "utf8"));

function textField(name, required = false) {
  return { id: name, name, type: "text", required, min: 0, max: 0 };
}

function editorField(name, required = false) {
  return { id: name, name, type: "editor", required, maxSize: 0 };
}

function collectionBody(name, fields, indexes = []) {
  return {
    name,
    type: "base",
    fields,
    indexes,
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
  };
}

const collections = [
  collectionBody("content_meta", [
    textField("title", true),
    editorField("description", true),
    textField("telegramUrl", true),
    textField("workingHours", true),
  ]),
  collectionBody("content_hero", [
    textField("title", true),
    textField("introBefore", true),
    textField("introHighlight"),
    textField("introAfter"),
    textField("ctaLabel", true),
    textField("photoAlt", true),
  ]),
  collectionBody(
    "content_pricing_plans",
    [
      textField("planId", true),
      {
        id: "type",
        name: "type",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["individual", "group"],
      },
      textField("name", true),
      textField("description"),
      textField("price", true),
      textField("priceUnit"),
      textField("originalPrice"),
      textField("priceNote"),
      textField("featuredLabel"),
      textField("ctaLabel", true),
      { id: "isFeatured", name: "isFeatured", type: "bool" },
      editorField("features", true),
      { id: "sortOrder", name: "sortOrder", type: "number", required: true, onlyInt: true },
    ],
    [
      "CREATE UNIQUE INDEX `idx_content_pricing_plans_planId` ON `content_pricing_plans` (`planId`)",
    ],
  ),
  collectionBody("content_faq", [
    textField("question", true),
    editorField("answer", true),
    { id: "sortOrder", name: "sortOrder", type: "number", required: true, onlyInt: true },
  ]),
  collectionBody("content_lead_form", [
    textField("badge", true),
    textField("title", true),
    editorField("subtitle", true),
    textField("contactLabel", true),
    textField("contactPlaceholder", true),
    textField("submitLabel", true),
    editorField("directNote", true),
    editorField("replyNote", true),
  ]),
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function paragraphs(lines) {
  return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function paragraph(value) {
  return `<p>${escapeHtml(value)}</p>`;
}

function formatPocketBaseError(status, path, body) {
  const message =
    body && typeof body.message === "string" ? body.message : "Unknown error";
  const lines = [`${status} ${path}: ${message}`];
  if (body && body.data && typeof body.data === "object" && !Array.isArray(body.data)) {
    for (const [field, detail] of Object.entries(body.data)) {
      if (detail && typeof detail === "object" && !Array.isArray(detail)) {
        const code = detail.code ?? detail.message ?? JSON.stringify(detail);
        lines.push(`  • ${field}: ${code}`);
      } else {
        lines.push(`  • ${field}: ${JSON.stringify(detail)}`);
      }
    }
  } else if (body?.data !== undefined && body?.data !== null) {
    lines.push(`  data: ${JSON.stringify(body.data)}`);
  }
  return lines.join("\n");
}

async function request(path, token, options = {}) {
  const headers = { Accept: "application/json" };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text.slice(0, 500) };
    }
  }
  return { ok: response.ok, status: response.status, body };
}

async function authToken() {
  const attempts = [
    ["/api/collections/_superusers/auth-with-password", { identity: email, password }],
    ["/api/admins/auth-with-password", { identity: email, password }],
    ["/api/admins/auth-with-password", { email, password }],
  ];
  for (const [path, payload] of attempts) {
    const result = await request(path, "", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (result.ok && result.body && typeof result.body.token === "string") {
      return result.body.token;
    }
  }
  throw new Error("Не удалось войти суперпользователем PocketBase.");
}

async function api(token, path, options = {}) {
  const result = await request(path, token, options);
  if (!result.ok) {
    throw new Error(formatPocketBaseError(result.status, path, result.body));
  }
  return result.body;
}

function planRecord(plan, type, index) {
  return {
    planId: plan.id,
    type,
    name: plan.name,
    description: plan.description,
    price: plan.price,
    priceUnit: plan.priceUnit ?? "",
    originalPrice: plan.originalPrice ?? "",
    priceNote: plan.priceNote,
    featuredLabel: plan.featuredLabel ?? "",
    ctaLabel: plan.ctaLabel,
    isFeatured: plan.ctaPrimary === true,
    features: paragraphs(plan.features),
    // PocketBase treats 0 as empty for required number fields.
    sortOrder: index + 1,
  };
}

async function upsertSingleton(token, name, record) {
  const list = await api(token, `/api/collections/${name}/records?perPage=1`);
  const existing = list.items?.[0];
  if (existing?.id) {
    await api(token, `/api/collections/${name}/records/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify(record),
    });
    return "updated";
  }
  await api(token, `/api/collections/${name}/records`, {
    method: "POST",
    body: JSON.stringify(record),
  });
  return "created";
}

async function upsertByKey(token, name, key, records) {
  const list = await api(token, `/api/collections/${name}/records?perPage=200`);
  const byKey = new Map(
    (list.items ?? [])
      .filter((item) => item && item[key] !== undefined && item[key] !== null)
      .map((item) => [String(item[key]), item.id]),
  );
  let created = 0;
  let updated = 0;
  for (const record of records) {
    const id = byKey.get(String(record[key]));
    if (id) {
      await api(token, `/api/collections/${name}/records/${id}`, {
        method: "PATCH",
        body: JSON.stringify(record),
      });
      updated += 1;
    } else {
      await api(token, `/api/collections/${name}/records`, {
        method: "POST",
        body: JSON.stringify(record),
      });
      created += 1;
    }
  }
  return { created, updated };
}

const token = await authToken();
const existing = await api(token, "/api/collections?perPage=200");
const byName = new Map((existing.items ?? []).map((item) => [item.name, item]));

for (const body of collections) {
  const found = byName.get(body.name);
  if (!found) {
    const created = await api(token, "/api/collections", {
      method: "POST",
      body: JSON.stringify(body),
    });
    byName.set(body.name, created);
    console.log(`collection created: ${body.name}`);
    continue;
  }
  await api(token, `/api/collections/${found.id}`, {
    method: "PATCH",
    body: JSON.stringify({ listRule: "", viewRule: "" }),
  });
  console.log(`collection exists, public read kept: ${body.name}`);
}

const meta = await upsertSingleton(token, "content_meta", {
  title: content.meta.title,
  description: paragraph(content.meta.description),
  telegramUrl: content.meta.telegramUrl,
  workingHours: content.meta.workingHours,
});
const hero = await upsertSingleton(token, "content_hero", content.hero);
const lead = await upsertSingleton(token, "content_lead_form", {
  badge: content.leadForm.badge,
  title: content.leadForm.title,
  subtitle: paragraph(content.leadForm.subtitle),
  contactLabel: content.leadForm.contactLabel,
  contactPlaceholder: content.leadForm.contactPlaceholder,
  submitLabel: content.leadForm.submitLabel,
  directNote: paragraph(content.leadForm.directNote),
  replyNote: paragraph(content.leadForm.replyNote),
});

const plans = await upsertByKey(token, "content_pricing_plans", "planId", [
  ...content.pricing.plansIndividual.map((plan, index) => planRecord(plan, "individual", index)),
  ...content.pricing.plansGroup.map((plan, index) => planRecord(plan, "group", index)),
]);
const faq = await upsertByKey(
  token,
  "content_faq",
  "question",
  content.faq.items.map((item, index) => ({
    question: item.question,
    answer: paragraph(item.answer),
    sortOrder: index + 1,
  })),
);

console.log(
  `records: meta ${meta}, hero ${hero}, lead ${lead}, plans +${plans.created}/~${plans.updated}, faq +${faq.created}/~${faq.updated}`,
);

const counts = await Promise.all(
  collections.map(async ({ name }) => {
    const list = await api(token, `/api/collections/${name}/records?perPage=1&skipTotal=0`);
    const total = typeof list.totalItems === "number" ? list.totalItems : (list.items?.length ?? 0);
    return `${name}: ${total}`;
  }),
);
console.log(`verified — ${counts.join(", ")}`);
