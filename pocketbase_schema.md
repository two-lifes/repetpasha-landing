# PocketBase: коллекция `site_content`

Фронтенд читает **одну** запись с `section = "main"`. Поле `data` — JSON целиком по схеме `SiteContent` (`src/types/content.ts`). Если API недоступен или JSON не проходит Zod, сайт показывает `src/content/site.default.json`.

## Коллекция

| Параметр | Значение |
|----------|----------|
| Name | `site_content` |
| Type | Base |
| API | REST, без SDK |

## Поля

| Имя | Тип | Опции |
|-----|-----|--------|
| `section` | Plain text | Required, Unique. Для визитки одно значение: `main` |
| `data` | JSON | Required. Объект со ключами `meta`, `hero`, `cases`, `wheelModules`, `pricing`, `faq`, `leadForm` |

Тексты — строки и массивы строк. HTML в `data` не используется: вёрстка остаётся в React.

## API rules

| Правило | Выражение |
|---------|-----------|
| List | `""` (публичное чтение) |
| View | `""` |
| Create | `@request.auth.id != ""` |
| Update | `@request.auth.id != ""` |
| Delete | `@request.auth.id != ""` |

Пустая строка в List/View в PocketBase означает «доступно без авторизации».

## Запрос с сайта

```
GET {VITE_POCKETBASE_URL}/api/collections/site_content/records?filter=section%3D%22main%22&perPage=1
```

Ожидаемый фрагмент ответа:

```json
{
  "items": [
    {
      "section": "main",
      "data": {}
    }
  ]
}
```

`data` — копия структуры `src/content/site.default.json`.

## Nginx

Проксируйте PocketBase отдельно от статики Vite, например `https://pb.example.com` → `127.0.0.1:8090`, и задайте этот origin в `VITE_POCKETBASE_URL` на этапе сборки фронтенда. Для браузерного `fetch` включите CORS в PocketBase на домен визитки.
