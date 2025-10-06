<template>
  <div class="placeholder-wrapper">
    <div class="placeholder-content">
      <div class="icon-container">
        <!-- Встроенная SVG иконка для анимации и кастомизации -->
        <svg
          class="placeholder-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V5m0 14v-1M9.5 11l-1.414-1.414M16.086 16.086L14.5 14.5m0-5l1.586-1.586m-5.362 8.452L8.086 14.5"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 18a6 6 0 100-12 6 6 0 000 12z"
          />
        </svg>
      </div>
      <h1>Калькулятор в разработке</h1>
      <p>
        Мы усердно работаем над созданием нового удобного инструмента для вас.
        Он скоро будет готов!
      </p>

      <!-- ===== НАЧАЛО: ДОБАВЛЕННАЯ КНОПКА ===== -->
      <button @click="goBack" class="back-button">
        Вернуться назад
      </button>
      <!-- ===== КОНЕЦ: ДОБАВЛЕННАЯ КНОПКА ===== -->

      <div class="footer-text">
        Следите за обновлениями!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== НАЧАЛО: ДОБАВЛЕННАЯ ЛОГИКА =====
// Используем useRouter из Nuxt 3 для навигации
const router = useRouter();

const goBack = () => {
  // Эта функция вернет пользователя на предыдущую страницу в истории браузера
  router.back();
};
// ===== КОНЕЦ: ДОБАВЛЕННАЯ ЛОГИКА =====
</script>

<style scoped>
/* Определяем переменные для легкой кастомизации */
:root {
  --primary-color: #4f46e5; /* Яркий индиго */
  --primary-color-hover: #4338ca; /* Более темный индиго для ховера */
  --text-color-heading: #111827; /* Темно-серый */
  --text-color-body: #6b7281; /* Средне-серый */
  --background-color: #f9fafb; /* Очень светлый серый */
  --card-background: #ffffff; /* Белый */
  --card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --card-border-radius: 16px;
}

.placeholder-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh; /* Занимает большую часть экрана */
  background-color: var(--background-color);
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Helvetica, Arial, sans-serif;
}

.placeholder-content {
  text-align: center;
  background-color: var(--card-background);
  padding: 3rem 2.5rem;
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
  max-width: 550px;
  width: 100%;
  transform: translateY(-20px); /* Небольшой сдвиг вверх для акцента */
  border: 1px solid #e5e7eb;
}

.icon-container {
  margin-bottom: 1.5rem;
}

.placeholder-icon {
  width: 80px;
  height: 80px;
  color: var(--primary-color);
  animation: spin 12s linear infinite; /* Плавная, медленная анимация вращения */
}

h1 {
  font-size: 2.25rem; /* 36px */
  font-weight: 700;
  color: var(--text-color-heading);
  margin: 0 0 0.75rem 0;
}

p {
  font-size: 1.125rem; /* 18px */
  color: var(--text-color-body);
  line-height: 1.6;
  max-width: 450px;
  margin: 0 auto 1.5rem auto;
}

/* ===== НАЧАЛО: ДОБАВЛЕННЫЕ СТИЛИ ДЛЯ КНОПКИ ===== */
.back-button {
  display: inline-block;
  margin-top: 1rem;
  margin-bottom: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.back-button:hover {
  background-color: #4338ca;
}

.back-button:active {
  transform: scale(0.98); /* Эффект нажатия */
  box-shadow: none;
}
/* ===== КОНЕЦ: ДОБАВЛЕННЫЕ СТИЛИ ДЛЯ КНОПКИ ===== */

.footer-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--primary-color);
  opacity: 0.8;
}

/* Анимация вращения для иконки */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Адаптивность для мобильных устройств */
@media (max-width: 640px) {
  .placeholder-content {
    padding: 2.5rem 1.5rem;
    transform: translateY(0);
  }

  h1 {
    font-size: 1.875rem; /* 30px */
  }

  p {
    font-size: 1rem; /* 16px */
  }
  
  .placeholder-icon {
    width: 64px;
    height: 64px;
  }
}
</style>