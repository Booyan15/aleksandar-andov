# Претседател на Советот на Општина Кочани

Модерна Next.js App Router апликација со TypeScript, Tailwind CSS, Prisma и Neon PostgreSQL.

## Локално стартување

1. Инсталирајте ги зависностите:

```bash
npm install
```

2. Проверете го `.env` фајлот и поставете ги администраторските податоци:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_EMAIL="admin@kocani.gov.mk"
ADMIN_PASSWORD_HASH="$2b$12$replace-with-a-bcrypt-hash"
SESSION_SECRET="replace-with-at-least-32-random-characters"
```

Администраторската лозинка се поставува како bcrypt hash, не како обичен текст. Генерирајте hash локално и поставете го само во Vercel environment variables.

3. Подгответе ја PostgreSQL базата:

```bash
npx prisma migrate dev --name init
```

4. Стартувајте го проектот:

```bash
npm run dev
```

Јавната страница е достапна на `http://localhost:3000`.
Администрацијата е достапна на `http://localhost:3000/admin/login`.

## Структура

- `src/app/page.tsx` - јавна почетна страница
- `src/app/actions.ts` - server actions за јавните форми
- `src/app/admin/*` - админ најава, преглед и детална страница
- `src/middleware.ts` - заштита на админ рутите
- `prisma/schema.prisma` - модел `Submission` со тип и статус
- `public/` - placeholder слики за грб и претседател
