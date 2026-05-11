# University Events & Student Achievements

MVP веб-платформы университета на Next.js, TypeScript, Supabase, PostgreSQL, Supabase Auth, Supabase Storage, Tailwind CSS, shadcn-style UI, React Hook Form и Zod.

## Запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Заполните `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase setup

1. Создайте Supabase project.
2. Откройте SQL Editor и выполните `supabase/database.sql`.
3. В Authentication включите Email provider.
4. После регистрации профиль создается автоматически через trigger `handle_new_user`.
5. Первый admin: вручную обновите роль в таблице `profiles`.

```sql
update public.profiles
set role = 'admin'
where id = 'USER_UUID';
```

## Основные маршруты

- `/` главная
- `/events` события с фильтром по типу
- `/achievements` публичные approved достижения
- `/news` новости
- `/gallery` галерея
- `/dashboard` личный кабинет студента
- `/admin` админ-панель
- `/admin/achievements` модерация заявок
- `/admin/events` управление событиями
- `/admin/news` управление новостями
- `/admin/users` пользователи
