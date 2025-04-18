const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


const users = [];


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 часа
  }
}));


const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}


const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'Требуется авторизация' });
};


app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
 
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }
    
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    
    const newUser = { id: users.length + 1, username, password: hashedPassword };
    users.push(newUser);
    
    res.status(201).json({ message: 'Пользователь зарегистрирован успешно' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }
    
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }
    
    
    req.session.userId = user.id;
    
    res.status(200).json({ message: 'Авторизация успешна' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});


app.get('/profile', isAuthenticated, (req, res) => {
  const user = users.find(user => user.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }
  
  
  res.json({
    id: user.id,
    username: user.username
  });
});


app.post('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.status(200).json({ message: 'Выход выполнен успешно' });
});


const fetchData = () => {
  return {
    items: [
      { id: 1, name: 'Элемент 1', description: 'Описание 1' },
      { id: 2, name: 'Элемент 2', description: 'Описание 2' },
      { id: 3, name: 'Элемент 3', description: 'Описание 3' }
    ],
    timestamp: new Date().toISOString()
  };
};


app.get('/data', (req, res) => {
  const cacheFile = path.join(cacheDir, 'api_data.json');
  
  try {
    
    if (fs.existsSync(cacheFile)) {
      const stats = fs.statSync(cacheFile);
      const cacheTime = new Date(stats.mtime);
      const currentTime = new Date();
      
      // Проверка актуальности кэша (1 минута)
      if ((currentTime - cacheTime) < 60000) {
        const cachedData = JSON.parse(fs.readFileSync(cacheFile));
        return res.json({ ...cachedData, fromCache: true });
      }
    }
    
    
    const newData = fetchData();
    fs.writeFileSync(cacheFile, JSON.stringify(newData));
    
    res.json({ ...newData, fromCache: false });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});


app.use(express.static('public'));


app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 