// plugins/yandex-metrika.client.ts
export default defineNuxtPlugin(() => {
  if (process.client) {
    // Отложенная загрузка Яндекс.Метрики
    setTimeout(() => {
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) { return; }
        }
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document,'script','https://mc.yandex.ru/metrika/tag.js','ym');

      window.ym(104348512, 'init', {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true,
        ecommerce:"dataLayer",
        defer: true // Отложенная инициализация
      });
    }, 3000); // Загружаем через 3 секунды после загрузки страницы
  }
})
