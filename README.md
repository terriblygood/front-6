
1. Установите зависимости:
```bash
npm install
```

2. Запустите сервер:
```bash
npm start
```

3. Откройте в браузере: `http://localhost:3000`

## Маршруты API

- `POST /register` - Регистрация пользователя
- `POST /login` - Авторизация и создание сессии
- `GET /profile` - Получение данных профиля (защищённый маршрут)
- `POST /logout` - Выход из системы
- `GET /data` - Получение данных с кэшированием (1 минута)

## Безопасность

- Пароли хешируются с помощью bcrypt
- Сессии хранятся на сервере
- Cookies имеют флаги httpOnly, sameSite=lax
- Защита от основных атак (CSRF, XSS)