# PocketBase: плоские коллекции контента

Фронтенд читает пять коллекций параллельно и собирает из них `SiteContent`. Тексты, которых нет в этих коллекциях (кейсы, шапка тарифов, подписи формы), берутся из `src/content/site.default.json`.

Длинные тексты — поле Editor. Сайт показывает их как обычный текст, без HTML. Список пунктов тарифа — тоже Editor: один абзац на пункт.

Запись и удаление закрыты для гостей (`createRule` / `updateRule` / `deleteRule` пустые, то есть только суперпользователь). Чтение публичное.

## Коллекции

| Коллекция | Записей | Поля |
|-----------|---------|------|
| `content_meta` | 1 | `title` text, `description` editor, `telegramUrl` text, `workingHours` text |
| `content_hero` | 1 | `title`, `introBefore`, `introHighlight`, `introAfter`, `ctaLabel`, `photoAlt` — text |
| `content_pricing_plans` | список | `planId` text unique, `type` select `individual` / `group`, `name` text, `description` text, `price` text, `priceUnit` text, `originalPrice` text, `priceNote` text, `featuredLabel` text, `ctaLabel` text, `isFeatured` bool, `features` editor, `sortOrder` number |
| `content_faq` | список | `question` text, `answer` editor, `sortOrder` number |
| `content_lead_form` | 1 | `badge` text, `title` text, `subtitle` editor, `contactLabel` text, `contactPlaceholder` text, `submitLabel` text, `directNote` editor, `replyNote` editor |

`description` у тарифа — строка под ценой на карточке. `isFeatured` включает основную кнопку тарифа.

## API rules

| Правило | Значение |
|---------|----------|
| List | `""` |
| View | `""` |
| Create | `null` |
| Update | `null` |
| Delete | `null` |

## Запросы с сайта

```
GET {VITE_POCKETBASE_URL}/api/collections/content_meta/records?perPage=1&sort=-created
GET {VITE_POCKETBASE_URL}/api/collections/content_hero/records?perPage=1&sort=-created
GET {VITE_POCKETBASE_URL}/api/collections/content_pricing_plans/records?perPage=200&sort=sortOrder
GET {VITE_POCKETBASE_URL}/api/collections/content_faq/records?perPage=200&sort=sortOrder
GET {VITE_POCKETBASE_URL}/api/collections/content_lead_form/records?perPage=1&sort=-created
```

## Создание и заполнение

В `.env` (не коммитить) добавьте почту и пароль суперпользователя:

```
POCKETBASE_ADMIN_EMAIL=
POCKETBASE_ADMIN_PASSWORD=
```

`VITE_POCKETBASE_URL` уже указывает на сервер. Затем:

```
npm run pocketbase:setup
```

Скрипт `scripts/setup-pocketbase-content.mjs` создаёт коллекции, открывает чтение и записывает тексты из `site.default.json`. Повторный запуск обновляет те же записи.

Старая коллекция `site_content` скриптом не удаляется. Сайт её больше не читает.

## Nginx

Проксируйте PocketBase отдельно от статики Vite и задайте этот origin в `VITE_POCKETBASE_URL` на этапе сборки фронтенда. Для браузерного `fetch` включите CORS в PocketBase на домен визитки.
