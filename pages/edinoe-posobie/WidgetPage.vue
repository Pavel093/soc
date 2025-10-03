<template>
  <section class="widget-page">
    <div class="container">
      <div class="widget-header">
        <h2 class="widget-subtitle">Для веб-мастеров и организаций</h2>
        <h1 class="widget-title">Бесплатный виджет калькулятора для вашего сайта</h1>
        <p class="widget-description">
          Помогите своим посетителям узнать о пособиях. Разместите наш точный и актуальный калькулятор у себя — это бесплатно и займет 5 минут.
        </p>
      </div>

      <div class="widget-demo">
        <h3 class="demo-title">Пример работы виджета</h3>
        <div class="iframe-container">
          <iframe 
            :src="iframeSrc"
            width="100%"
            height="600"
            frameborder="0"
            id="calc-iframe">
          </iframe>
        </div>
      </div>

      <div class="widget-instructions">
        <h3 class="instructions-title">Как установить виджет на ваш сайт</h3>
        <p class="instructions-text">
          Скопируйте код ниже и вставьте на ваш сайт в нужном месте. Виджет автоматически подстроится под размеры контейнера.
        </p>
        
        <div class="code-container">
          <pre class="embed-code"><code ref="codeElement">{{ embedCode }}</code></pre>
          <button class="copy-button" @click="copyCode">
            <span v-if="!copied">Копировать код</span>
            <span v-else>Скопировано!</span>
          </button>
        </div>
      </div>

      <div class="support-section">
        <h3 class="support-title">Нужна помощь?</h3>
        <p class="support-text">
          По любым вопросам установки и настройки виджета обращайтесь к нам:
        </p>
        <a href="mailto:support@calculator.ru" class="support-email">support@calculator.ru</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const embedCode = `<iframe 
  src="http://localhost:3000/embed"
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
<\/script>`

const copied = ref(false)
const codeElement = ref(null)
const iframeSrc = ref('')

// Устанавливаем src только на клиенте
onMounted(() => {
  iframeSrc.value = 'http://localhost:3000/embed'
  
  // Обработчик сообщений для изменения высоты iframe
  if (typeof window !== 'undefined') {
    window.addEventListener('message', handleIframeMessage)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('message', handleIframeMessage)
  }
})

const handleIframeMessage = (e) => {
  if (e.data.type === 'resize') {
    const iframe = document.getElementById('calc-iframe')
    if (iframe) {
      iframe.style.height = e.data.height + 'px'
    }
  }
}

const copyCode = async () => {
  if (typeof navigator === 'undefined') return
  
  try {
    await navigator.clipboard.writeText(embedCode)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Ошибка при копировании: ', err)
    // Fallback для старых браузеров
    const textArea = document.createElement('textarea')
    textArea.value = embedCode
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

useHead({
  // 1. Тег <title>
  title: 'Бесплатный виджет калькулятора единого пособия 2025 для сайта | ВсеПособия',

  // 2. Теги <meta>
  meta: [
    // Description
    { name: 'description', content: 'Установите бесплатный и точный виджет калькулятора единого пособия на ваш сайт. Помогите посетителям рассчитать выплаты. Установка за 5 минут — просто скопируйте готовый код.' },
    // Keywords
    { name: 'keywords', content: 'виджет калькулятора, калькулятор пособий для сайта, установить калькулятор на сайт, код для вставки, единое пособие 2025, iframe калькулятор, виджет для вебмастеров, социальный калькулятор' },
  ],
})

</script>

<style scoped lang="scss">
.widget-page {
  padding: 80px 0;
  background-color: #f9fafb;
  min-height: 100vh;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
}

.widget-header {
  text-align: center;
  margin-bottom: 60px;
}

.widget-subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #2b7bf6;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
}

.widget-title {
  font-size: 42px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
  
  @media (max-width: 480px) {
    font-size: 28px;
  }
}

.widget-description {
  font-size: 18px;
  color: #6b7280;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
}

.widget-demo {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
}

.demo-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
  text-align: center;
}

.iframe-container {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.widget-instructions {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
}

.instructions-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.instructions-text {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

.code-container {
  position: relative;
  background: #1f2937;
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
}

.embed-code {
  color: #e5e7eb;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
  margin-bottom: 20px;
  white-space: pre-wrap;
}

.copy-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #2b7bf6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1a6ad8;
    transform: translateY(-2px);
  }
}

.support-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.support-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.support-text {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
}

.support-email {
  font-size: 18px;
  color: #2b7bf6;
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: 768px) {
  .widget-page {
    padding: 40px 0;
  }
  
  .widget-demo,
  .widget-instructions,
  .support-section {
    padding: 20px;
  }
  
  .embed-code {
    font-size: 12px;
  }
}
</style>