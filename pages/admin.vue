<script setup>
import { ref, onMounted } from 'vue'

const isLoggedIn = ref(false)
const loginForm = ref({ username: '', password: '' })
const domains = ref([])
const statistics = ref({})
const activeTab = ref('domains')
const selectedDomain = ref('')

const login = async () => {
  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: loginForm.value
    })
    isLoggedIn.value = true
    await loadData()
  } catch (error) {
    alert('Неверный логин или пароль')
  }
}

const loadData = async () => {
  try {
    domains.value = await $fetch('/api/admin/domains')
    const stats = await $fetch('/api/admin/statistics')
    statistics.value = stats
  } catch (error) {
    console.error('Ошибка загрузки:', error)
  }
}

const toggleBlock = async (domain) => {
  try {
    await $fetch(`/api/admin/domains/${domain.domain}/block`, {
      method: 'POST',
      body: {
        isBlocked: !domain.isBlocked
      }
    })
    domain.isBlocked = !domain.isBlocked
  } catch (error) {
    alert('Ошибка')
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('ru-RU')
}

const copyEmbedCode = () => {
  const code = `<iframe 
  src="${window.location.origin}/embed"
  width="100%"
  height="600"
  frameborder="0"
  id="calc-iframe">
</iframe>
<script>
window.addEventListener('message', function(e) {
  if(e.data.type === 'resize') {
    document.getElementById('calc-iframe').style.height = e.data.height + 'px';
  }
});
<\/script>` // Экранируем закрывающий тег script
  
  navigator.clipboard.writeText(code)
  alert('Код скопирован!')
}

// Функция для получения кода встраивания для отображения
const getEmbedCode = () => {
  return `<iframe 
  src="${window.location.origin}/embed"
  width="100%"
  height="600"
  frameborder="0"
  id="calc-iframe">
</iframe>
<script>
// Автоматическая подстройка высоты
window.addEventListener('message', function(e) {
  if(e.data.type === 'resize') {
    document.getElementById('calc-iframe').style.height = e.data.height + 'px';
  }
});
<\/script>` // Экранируем закрывающий тег
}

onMounted(async () => {
  const token = useCookie('admin-token')
  if (token.value) {
    isLoggedIn.value = true
    await loadData()
  }
})
</script>

<template>
  <div class="admin">
    <!-- Логин -->
    <div v-if="!isLoggedIn" class="login-page">
      <form @submit.prevent="login" class="login-form">
        <h1>Админ-панель</h1>
        <input v-model="loginForm.username" placeholder="Логин (admin)" required>
        <input v-model="loginForm.password" type="password" placeholder="Пароль (admin123)" required>
        <button type="submit">Войти</button>
      </form>
    </div>

    <!-- Панель -->
    <div v-else class="dashboard">
      <header>
        <h1>Управление калькулятором</h1>
        <div class="stats-summary">
          <div>Доменов: {{ domains.length }}</div>
          <div>Просмотров: {{ statistics.summary?.totalViews || 0 }}</div>
          <div>Уникальных IP: {{ statistics.summary?.uniqueVisitors || 0 }}</div>
        </div>
      </header>

      <div class="tabs">
        <button @click="activeTab = 'domains'" :class="{active: activeTab === 'domains'}">
          Домены
        </button>
        <button @click="activeTab = 'code'" :class="{active: activeTab === 'code'}">
          Код встраивания
        </button>
        <button @click="activeTab = 'stats'" :class="{active: activeTab === 'stats'}">
          Статистика
        </button>
      </div>

      <!-- Домены -->
      <div v-if="activeTab === 'domains'" class="domains-list">
        <table>
          <thead>
            <tr>
              <th>Домен</th>
              <th>Первый визит</th>
              <th>Последний визит</th>
              <th>Просмотров</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="domain in domains" :key="domain._id">
              <td>{{ domain.domain }}</td>
              <td>{{ formatDate(domain.firstSeen) }}</td>
              <td>{{ formatDate(domain.lastSeen) }}</td>
              <td>{{ domain.totalViews }}</td>
              <td>
                <span :class="domain.isBlocked ? 'blocked' : 'active'">
                  {{ domain.isBlocked ? 'Заблокирован' : 'Активен' }}
                </span>
              </td>
              <td>
                <button @click="toggleBlock(domain)" class="btn-small">
                  {{ domain.isBlocked ? 'Разблокировать' : 'Заблокировать' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Код встраивания -->
      <div v-if="activeTab === 'code'" class="embed-code">
        <h2>Код для встраивания калькулятора</h2>
        <p>Любой сайт может встроить этот код. Вы будете видеть все домены в статистике.</p>
        
        <pre><code>{{ getEmbedCode() }}</code></pre>
        
        <button @click="copyEmbedCode" class="btn-primary">Копировать код</button>
      </div>

      <!-- Статистика -->
      <div v-if="activeTab === 'stats'" class="statistics">
        <h2>Последние просмотры</h2>
        <table>
          <thead>
            <tr>
              <th>Время</th>
              <th>Домен</th>
              <th>IP</th>
              <th>Страница</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stat in statistics.statistics" :key="stat._id">
              <td>{{ formatDate(stat.createdAt) }}</td>
              <td>{{ stat.domain }}</td>
              <td>{{ stat.ipAddress }}</td>
              <td>{{ stat.pageUrl?.substring(0, 50) }}...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: system-ui, -apple-system, sans-serif;
}

.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 300px;
}

.login-form h1 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
}

.login-form input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.login-form button {
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-form button:hover {
  background: #2563eb;
}

.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

header h1 {
  margin: 0 0 1rem 0;
}

.stats-summary {
  display: flex;
  gap: 2rem;
  font-size: 0.9rem;
  color: #666;
}

.stats-summary div {
  padding: 0.5rem 1rem;
  background: #f0f9ff;
  border-radius: 4px;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tabs button {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.tabs button:hover {
  background: #f9fafb;
}

.tabs button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

table {
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-collapse: collapse;
}

th {
  background: #f9fafb;
  padding: 0.75rem;
  text-align: left;
  font-weight: 500;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

tr:hover td {
  background: #fafafa;
}

.active {
  color: #10b981;
  font-weight: 500;
}

.blocked {
  color: #ef4444;
  font-weight: 500;
}

.btn-small {
  padding: 0.25rem 0.75rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.btn-small:hover {
  background: #4b5563;
}

.embed-code {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.embed-code h2 {
  margin: 0 0 1rem 0;
}

.embed-code p {
  color: #666;
  margin-bottom: 1.5rem;
}

.embed-code pre {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid #e5e7eb;
}

.embed-code code {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  color: #1f2937;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

.statistics {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.statistics h2 {
  margin: 0 0 1.5rem 0;
}

.statistics table {
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  
  .tabs {
    flex-direction: column;
  }
  
  .tabs button {
    width: 100%;
  }
  
  .stats-summary {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  table {
    font-size: 0.875rem;
  }
  
  th, td {
    padding: 0.5rem;
  }
  
  .embed-code pre {
    font-size: 0.75rem;
    padding: 1rem;
  }
}
</style>