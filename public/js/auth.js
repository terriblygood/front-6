
document.addEventListener('DOMContentLoaded', () => {

  const tabButtons = document.querySelectorAll('.tab-btn');
  const authForms = document.querySelectorAll('.auth-form');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {

      tabButtons.forEach(btn => btn.classList.remove('active'));
      

      button.classList.add('active');
      

      authForms.forEach(form => form.style.display = 'none');
      

      const targetForm = document.getElementById(button.dataset.target);
      if (targetForm) {
        targetForm.style.display = 'block';
      }
    });
  });
  

  const loginForm = document.getElementById('login-form');
  const loginMessage = document.getElementById('login-message');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
      showMessage(loginMessage, 'Пожалуйста, заполните все поля', 'error');
      return;
    }
    
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage(loginMessage, 'Авторизация успешна, перенаправление...', 'success');
        // Перенаправление на профиль
        setTimeout(() => {
          window.location.href = '/profile.html';
        }, 1000);
      } else {
        showMessage(loginMessage, data.message || 'Ошибка авторизации', 'error');
      }
    } catch (error) {
      showMessage(loginMessage, 'Ошибка соединения с сервером', 'error');
      console.error('Ошибка:', error);
    }
  });
  

  const registerForm = document.getElementById('register-form');
  const registerMessage = document.getElementById('register-message');
  
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!username || !password || !confirmPassword) {
      showMessage(registerMessage, 'Пожалуйста, заполните все поля', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showMessage(registerMessage, 'Пароли не совпадают', 'error');
      return;
    }
    
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage(registerMessage, 'Регистрация успешна! Теперь вы можете войти.', 'success');
        
        registerForm.reset();
        
        setTimeout(() => {
          document.querySelector('.tab-btn[data-target="login-form"]').click();
        }, 2000);
      } else {
        showMessage(registerMessage, data.message || 'Ошибка регистрации', 'error');
      }
    } catch (error) {
      showMessage(registerMessage, 'Ошибка соединения с сервером', 'error');
      console.error('Ошибка:', error);
    }
  });
  
  
  checkAuth();
});


function showMessage(element, message, type) {
  element.textContent = message;
  element.className = 'message';
  element.classList.add(type);
}


async function checkAuth() {
  try {
    const response = await fetch('/profile', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (response.ok) {
  
      window.location.href = '/profile.html';
    }
  } catch (error) {
    console.error('Ошибка проверки авторизации:', error);
  }
} 