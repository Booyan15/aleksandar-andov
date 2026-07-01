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
ADMIN_EMAIL="admin@kocani.gov.mk"
ADMIN_PASSWORD="promeni-ja-ovaa-lozinka"
SESSION_SECRET="promeni-ja-ovaa-sesija-so-dolga-slucajna-vrednost"
```

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
