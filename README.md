# 🎓 Smart Campus

> Современная full-stack платформа для студентов колледжа и университета

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

## 📸 Screenshots

| Dashboard | Tasks | Events |
|-----------|-------|--------|
| ![Dashboard](https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Dashboard) | ![Tasks](https://via.placeholder.com/300x200/2EC4B6/FFFFFF?text=Tasks) | ![Events](https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Events) |

## ✨ Возможности

### 🔐 Аутентификация
- Регистрация и вход через email/пароль
- Восстановление пароля
- Управление профилем (ФИО, специальность, группа, аватар, био)
- Роли: студент и администратор

### 📋 Задания (CRUD)
- Создание, редактирование, удаление заданий
- Приоритеты: низкий, средний, высокий
- Статусы: в ожидании, в процессе, выполнено, просрочено
- Поиск, фильтрация по статусу/приоритету, сортировка
- Отметка выполнения одним кликом

### 📅 Мероприятия
- Создание мероприятий с категориями
- Регистрация/отмена регистрации
- Отслеживание количества участников
- Фильтрация по категориям и дате

### 💬 Realtime Chat
- Групповые чаты
- Realtime обновления сообщений
- Аватары и временные метки

### 📰 Новости
- Лента новостей кампуса
- Категории и фильтрация
- Авторы и даты публикации

### 🔔 Уведомления
- Realtime уведомления
- Типы: задания, мероприятия, сообщения, системные
- Индикатор непрочитанных

### 🎨 UI/UX
- **Dark/Light режим** с переключением
- **Glassmorphism** дизайн
- **Анимации** Framer Motion
- **Responsive** layout (mobile, tablet, desktop)
- **Coral (#FF6B6B)** и **Turquoise (#2EC4B6)** палитра

### 👨‍💼 Админ панель
- Статистика платформы
- Управление пользователями
- Аналитика с графиками (Recharts)
- Таблица пользователей с поиском

## 🛠 Технологии

### Frontend
- **Next.js 15** — React фреймворк с App Router
- **React 19** — UI библиотека
- **TypeScript** — типизация
- **Tailwind CSS** — стилизация
- **Framer Motion** — анимации
- **Lucide React** — иконки
- **Recharts** — графики и диаграммы
- **Radix UI** — примитивы интерфейса

### Backend
- **Supabase** — Backend-as-a-Service
  - PostgreSQL база данных
  - Authentication
  - Realtime subscriptions
  - Row Level Security (RLS)
  - Storage для аватаров

### State Management
- **Zustand** — глобальное состояние

### Инструменты
- **ESLint** — линтинг
- **Git** — версионирование

## 📁 Структура проекта

```
smart-campus/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── reset-password/
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── events/
│   │   ├── chat/
│   │   ├── news/
│   │   ├── profile/
│   │   ├── notifications/
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── analytics/
│   │       └── users/
│   ├── components/
│   │   ├── ui/                 # UI компоненты (Button, Input, Card, etc.)
│   │   ├── layout/             # Navbar, Sidebar
│   │   ├── dashboard/          # StatsCard, ActivityChart, RecentTasks
│   │   ├── chat/               # ChatRoomList, ChatMessages
│   │   └── modals/             # TaskModal, EventModal
│   ├── lib/
│   │   ├── utils.ts            # Утилиты (cn, formatDate, etc.)
│   │   └── supabase/
│   │       ├── client.ts       # Browser client
│   │       ├── server.ts       # Server client
│   │       └── middleware.ts   # Auth middleware
│   ├── services/
│   │   ├── auth.ts             # Auth API
│   │   ├── tasks.ts            # Tasks CRUD
│   │   ├── events.ts           # Events CRUD
│   │   ├── messages.ts         # Chat API
│   │   └── notifications.ts    # Notifications API
│   ├── store/
│   │   ├── useAuthStore.ts     # Auth state
│   │   ├── useThemeStore.ts    # Theme state
│   │   └── useNotificationStore.ts
│   ├── hooks/
│   │   ├── useRealtime.ts      # Realtime subscriptions
│   │   ├── useTasks.ts         # Tasks data
│   │   └── useEvents.ts        # Events data
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   └── styles/
│       └── globals.css         # Global styles
├── database/
│   └── schema.sql              # Supabase schema
├── public/
│   ├── images/
│   └── icons/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── .env.example
```

## 🚀 Установка и запуск

### Предварительные требования
- Node.js 18+
- npm или yarn
- Аккаунт [Supabase](https://supabase.com)

### 1. Клонирование репозитория

```bash
git clone https://github.com/yourusername/smart-campus.git
cd smart-campus
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка Supabase

1. Создайте новый проект в [Supabase Dashboard](https://app.supabase.com)
2. Перейдите в SQL Editor
3. Выполните скрипт из `database/schema.sql`
4. Включите Authentication → Email provider
5. Создайте Storage bucket `avatars` (public)
6. Включите Realtime для таблиц `messages` и `notifications`

### 4. Настройка переменных окружения

```bash
cp .env.example .env.local
```

Заполните файл `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Запуск development сервера

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

### 6. Сборка для production

```bash
npm run build
npm start
```

## 🌐 Деплой

### Vercel (рекомендуется)

1. Импортируйте репозиторий на [Vercel](https://vercel.com)
2. Добавьте переменные окружения в Project Settings
3. Deploy!

### Netlify

1. Подключите репозиторий на [Netlify](https://netlify.com)
2. Настройте переменные окружения
3. Deploy!

## 🗄 Структура базы данных

### Таблицы

| Таблица | Описание |
|---------|----------|
| `users` | Профили пользователей |
| `tasks` | Учебные задания |
| `events` | Мероприятия |
| `event_registrations` | Регистрации на мероприятия |
| `chat_rooms` | Комнаты чатов |
| `chat_room_participants` | Участники чатов |
| `messages` | Сообщения |
| `notifications` | Уведомления |
| `news` | Новости кампуса |

### Relations

```
users ||--o{ tasks : создает
users ||--o{ events : организует
users ||--o{ event_registrations : регистрируется
users ||--o{ messages : отправляет
users ||--o{ notifications : получает
users ||--o{ news : публикует
events ||--o{ event_registrations : имеет
chat_rooms ||--o{ chat_room_participants : содержит
chat_rooms ||--o{ messages : содержит
```

## 🔐 Безопасность

- **Row Level Security (RLS)** — политики доступа на уровне строк
- **Auth middleware** — защита маршрутов
- **Password hashing** — через Supabase Auth
- **Input validation** — на клиенте и сервере

## 📝 Git commits

Примеры commit messages:

```
feat: add dark mode toggle
fix: resolve navbar responsive issue
refactor: optimize task filtering logic
docs: update README with setup instructions
style: improve card hover animations
```

## 👤 Автор

**Smart Campus Team**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@campus.edu

## 📄 Лицензия

MIT License — свободное использование и модификация.

---

<p align="center">
  Сделано с ❤️ для студентов
</p>
