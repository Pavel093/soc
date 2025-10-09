// plugins/metrika.client.ts

// Расширяем глобальный интерфейс Window, чтобы TypeScript знал о 'ym'
declare global {
  interface Window {
    ym: (id: number, action: string, ...args: any[]) => void;
  }
}

export default defineNuxtPlugin(() => {
  const metrikaId = 104348512;
  
  let isMetrikaInitialized = false;

  const loadMetrika = () => {
    if (isMetrikaInitialized) {
      return;
    }

    // Загружаем сам скрипт
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js','ym');

    // Инициализируем счетчик
    window.ym(metrikaId, 'init', {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true,
      ecommerce:"dataLayer"
    });

    console.log('Yandex Metrika Initialized'); // Для отладки в консоли браузера

    isMetrikaInitialized = true;
    
    // ----- САМОЕ ВАЖНОЕ ИЗМЕНЕНИЕ -----
    // Получаем доступ к роутеру Nuxt
    const router = useRouter();

    // Подписываемся на каждое изменение маршрута
    router.afterEach((to, from) => {
      // Проверяем, что Метрика доступна и это не первый переход (он уже учтен в 'init')
      if (typeof window.ym !== 'undefined') {
        // Отправляем данные о просмотре новой страницы
        window.ym(metrikaId, 'hit', to.fullPath, {
            referer: from.fullPath,
            // title: document.title // можно также передавать заголовок страницы
        });
        console.log(`Metrika hit: ${to.fullPath}`); // Для отладки
      }
    });

    // Убираем ненужные обработчики
    window.removeEventListener('scroll', loadMetrika, { passive: true });
    window.removeEventListener('mousemove', loadMetrika, { passive: true });
    window.removeEventListener('touchstart', loadMetrika, { passive: true });
    window.removeEventListener('click', loadMetrika, { passive: true });
  };

  // Триггеры для первоначальной загрузки (остаются без изменений)
  window.addEventListener('scroll', loadMetrika, { passive: true, once: true });
  window.addEventListener('mousemove', loadMetrika, { passive: true, once: true });
  window.addEventListener('touchstart', loadMetrika, { passive: true, once: true });
  window.addEventListener('click', loadMetrika, { passive: true, once: true });

  setTimeout(() => {
    loadMetrika();
  }, 3000);
});
