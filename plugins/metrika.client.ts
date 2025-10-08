// plugins/metrika.client.ts

export default defineNuxtPlugin(() => {
  // Ваш ID счетчика
  const metrikaId = 104348512;
  
  // Переменная для проверки, была ли метрика уже инициализирована
  let isMetrikaInitialized = false;

  // Функция для загрузки и инициализации метрики
  const loadMetrika = () => {
    // Если уже инициализировали, ничего не делаем
    if (isMetrikaInitialized) {
      return;
    }

    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js','ym');

    ym(metrikaId, 'init', {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true,
      ecommerce:"dataLayer"
    });

    // Отмечаем, что инициализация прошла
    isMetrikaInitialized = true;

    // Убираем обработчики событий, чтобы они не висели в памяти без дела
    window.removeEventListener('scroll', loadMetrika, { passive: true });
    window.removeEventListener('mousemove', loadMetrika, { passive: true });
    window.removeEventListener('touchstart', loadMetrika, { passive: true });
    window.removeEventListener('click', loadMetrika, { passive: true });
  };

  // ----- Триггеры для загрузки метрики -----

  // 1. Загружаем по первому взаимодействию пользователя (скролл, движение мыши, тап, клик).
  // Опция { once: true } гарантирует, что обработчик сработает только один раз.
  window.addEventListener('scroll', loadMetrika, { passive: true, once: true });
  window.addEventListener('mousemove', loadMetrika, { passive: true, once: true });
  window.addEventListener('touchstart', loadMetrika, { passive: true, once: true });
  window.addEventListener('click', loadMetrika, { passive: true, once: true });

  // 2. Фолбэк: если пользователь неактивен, загружаем метрику через 3 секунды после загрузки страницы.
  setTimeout(() => {
    loadMetrika();
  }, 3000);
});
