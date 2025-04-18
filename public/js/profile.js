
document.addEventListener('DOMContentLoaded', () => {

  const userInfoElement = document.getElementById('user-info');
  const dataContentElement = document.getElementById('data-content');
  const cacheStatusElement = document.getElementById('cache-status');
  const refreshDataButton = document.getElementById('refresh-data');
  const logoutButton = document.getElementById('logout-btn');
  

  async function loadProfile() {
    try {
      const response = await fetch('/profile', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {

        window.location.href = '/';
        return;
      }
      
      const userData = await response.json();
      

      userInfoElement.innerHTML = `
        <p><strong>ID:</strong> ${userData.id}</p>
        <p><strong>Имя пользователя:</strong> ${userData.username}</p>
      `;
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      userInfoElement.innerHTML = '<p class="error">Ошибка загрузки данных профиля</p>';
    }
  }
  
  
  async function loadData() {
    try {
      refreshDataButton.disabled = true;
      dataContentElement.innerHTML = '<p>Загрузка данных...</p>';
      
      const response = await fetch('/data', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Ошибка получения данных');
      }
      
      const data = await response.json();
      
      
      if (data.fromCache) {
        cacheStatusElement.textContent = 'Данные загружены из кэша';
      } else {
        cacheStatusElement.textContent = 'Данные обновлены с сервера';
      }
      
      
      let itemsHtml = '<ul>';
      data.items.forEach(item => {
        itemsHtml += `<li>
          <strong>${item.name}</strong>
          <p>${item.description}</p>
        </li>`;
      });
      itemsHtml += '</ul>';
      
      dataContentElement.innerHTML = `
        <div class="timestamp">Время обновления: ${new Date(data.timestamp).toLocaleString()}</div>
        ${itemsHtml}
      `;
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      dataContentElement.innerHTML = '<p class="error">Ошибка загрузки данных</p>';
      cacheStatusElement.textContent = '';
    } finally {
      refreshDataButton.disabled = false;
    }
  }
  
  
  async function logout() {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        window.location.href = '/';
      } else {
        alert('Ошибка при выходе из системы');
      }
    } catch (error) {
      console.error('Ошибка выхода:', error);
      alert('Ошибка соединения с сервером');
    }
  }
  
  
  loadProfile();
  
  
  refreshDataButton.addEventListener('click', loadData);
  logoutButton.addEventListener('click', logout);
}); 