<template>
  <footer class="app-footer">
    <div class="container">
      <!-- Верхняя часть футера -->
      <div class="footer-main">
        <div class="footer-brand">
          <div class="logo">
            <img src="/assets/global-image/Logo.png" alt="ВсеПособия.рф" class="logo-image">
            <div class="brand-content">
              <span class="logo-text">ВсеПособия.рф</span>
              <p class="footer-description">
                Помогаем узнать о ваших правах на государственную поддержку
              </p>
            </div>
          </div>
        </div>

        <nav class="footer-nav">
          <h4 class="nav-title">Навигация</h4>
          <ul class="nav-list">
            <li v-for="(item, index) in navigation" :key="index">
              <!-- Используем NuxtLink для внутренних ссылок -->
              <NuxtLink :to="item.link" class="nav-link">
                <span class="nav-link-text">{{ item.title }}</span>
                <div class="nav-link-underline"></div>
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="footer-info">
          <h4 class="info-title">Информация</h4>
          <ul class="info-list">
            <li>
              <!-- Ссылка на Политику конфиденциальности -->
              <NuxtLink to="/privacy" class="info-link">
                <span>Политика конфиденциальности</span>
                <div class="info-link-underline"></div>
              </NuxtLink>
            </li>
            <li>
              <!-- Ссылка на Пользовательское соглашение -->
              <NuxtLink to="/terms" class="info-link">
                <span>Пользовательское соглашение</span>
                <div class="info-link-underline"></div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Разделитель -->
      <div class="footer-divider"></div>

      <!-- Контактная информация -->
      <div class="footer-contacts">
        <div class="contact-item">
          <p class="contact-text">
            Нашли ошибку или хотите оставить пожелание? 
            <a href="mailto:support@wseposobiya.ru" class="contact-link">support@wseposobiya.ru</a>
          </p>
        </div>
        
        <div class="contact-item">
          <p class="contact-text">
            По поводу сотрудничества и рекламы: 
            <a href="https://t.me/pavel0779" target="_blank" class="contact-link">@pavel0779</a>
            (telegram)
          </p>
        </div>
        
        <div class="contact-item">
          <p class="contact-text">
            По поводу виджетов калькулятора: 
            <a href="mailto:widgets@wseposobiya.ru" class="contact-link">widgets@wseposobiya.ru</a>
          </p>
        </div>
      </div>

      <!-- Разделитель -->
      <div class="footer-divider"></div>

      <!-- Нижняя часть футера -->
      <div class="footer-bottom">
        <div class="disclaimers">
          <p class="disclaimer">
            Данный расчет является предварительным и носит ознакомительный характер. 
            За точной информацией обращайтесь в органы социальной защиты населения по месту жительства. 
            Сервис не является государственным.
          </p>
          
          <p class="legal-disclaimer">
            Сервис является информационным проектом. Мы не являемся государственным учреждением 
            и не предоставляем официальных консультаций. Реклама и партнерские отношения помогают 
            поддерживать работу сервиса бесплатной для пользователей.
          </p>
        </div>

        <div class="copyright">
          <p>© 2025 ВсеПособия.рф. Все права защищены.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const navigation = [
  // Якорные ссылки лучше делать без полного пути, если они на той же странице
  { title: 'На главную', link: '/#main' },
  { title: 'Ответы на вопросы', link: '/#faq' },
  { title: 'Калькуляторы', link: '/#all-calculators' },
  { title: 'Виджет на сайт', link: '/#widget' }
];
</script>

<style scoped lang="scss">
.app-footer {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: white;
  padding: 80px 0 40px;
  border-top: 1px solid #2d2d2d;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
}

.footer-main {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 60px;
  margin-bottom: 50px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 35px;
    text-align: left;
  }
}

.footer-contacts {
  margin: 30px 0;
  
  .contact-item {
    margin-bottom: 15px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .contact-text {
    color: #b4b4b4;
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
    
    @media (max-width: 768px) {
      font-size: 13px;
    }
  }
  
  .contact-link {
    color: #2b7bf6;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    
    &:hover {
      color: #4a90e2;
      text-decoration: underline;
    }
  }
}

.footer-brand {
  .logo {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    
    @media (max-width: 768px) {
      flex-direction: row;
      align-items: flex-start;
      text-align: left;
    }
    
    @media (max-width: 480px) {
      flex-direction: column;
      gap: 12px;
    }
    
    .logo-image {
      width: 48px;
      height: 48px;
      object-fit: contain;
      flex-shrink: 0;
      
      @media (max-width: 768px) {
        width: 40px;
        height: 40px;
      }
    }
    
    .brand-content {
      .logo-text {
        font-size: 24px;
        font-weight: 700;
        color: white;
        display: block;
        margin-bottom: 8px;
        background: linear-gradient(135deg, #2b7bf6 0%, #1775F6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        
        @media (max-width: 768px) {
          font-size: 22px;
        }
      }
    }
    
    .footer-description {
      color: #b4b4b4;
      font-size: 15px;
      line-height: 1.5;
      margin: 0;
      max-width: 280px;
      
      @media (max-width: 768px) {
        max-width: none;
        font-size: 14px;
      }
    }
  }
}

.footer-nav {
  .nav-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 24px;
    color: white;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    
    @media (max-width: 768px) {
      margin-bottom: 20px;
    }
  }
  
  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  .nav-link {
    color: #b4b4b4;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    display: inline-block;
    position: relative;
    transition: all 0.3s ease;
    
    &:hover {
      color: white;
      
      .nav-link-underline {
        width: 100%;
        background: #2b7bf6;
      }
    }
  }
  
  .nav-link-text {
    position: relative;
    z-index: 2;
  }
  
  .nav-link-underline {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: transparent;
    transition: all 0.3s ease;
    border-radius: 1px;
  }
}

/* --- ИЗМЕНЕНИЯ ЗДЕСЬ --- */
.footer-info {
  .info-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 24px;
    color: white;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    
    @media (max-width: 768px) {
      margin-bottom: 20px;
    }
  }
  
  // Добавляем список для семантики
  .info-list {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  // Общий стиль для ссылок в этом блоке
  .info-link {
    color: #b4b4b4;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    display: inline-block;
    position: relative;
    transition: all 0.3s ease;
    
    &:hover {
      color: white;
      
      .info-link-underline {
        width: 100%;
        background: #2b7bf6;
      }
    }
  }
  
  .info-link-underline {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: transparent;
    transition: all 0.3s ease;
    border-radius: 1px;
  }
}
/* --- КОНЕЦ ИЗМЕНЕНИЙ --- */

.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(43, 123, 246, 0.3) 50%, 
    transparent 100%);
  margin: 40px 0;
  
  @media (max-width: 768px) {
    margin: 30px 0;
  }
}

.footer-bottom {
  .disclaimers {
    margin-bottom: 30px;
  }
  
  .disclaimer,
  .legal-disclaimer {
    font-size: 13px;
    color: #888;
    line-height: 1.6;
    margin: 0 0 20px 0;
    font-weight: 400;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    @media (max-width: 768px) {
      font-size: 12px;
      text-align: left;
    }
  }
  
  .disclaimer {
    color: #999;
    font-style: italic;
  }
}

.copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #2d2d2d;
  
  p {
    font-size: 13px;
    color: #666;
    margin: 0;
    font-weight: 500;
    
    @media (max-width: 768px) {
      text-align: left;
      font-size: 12px;
    }
  }
}

// Анимации
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer-main {
  animation: slideIn 0.6s ease-out;
}

.footer-contacts {
  animation: slideIn 0.6s ease-out 0.1s both;
}

.footer-bottom {
  animation: slideIn 0.6s ease-out 0.2s both;
}

// Адаптивность
@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 1fr 1fr;
    
    .footer-brand {
      grid-column: 1 / -1;
      text-align: left;
    }
  }
}

@media (max-width: 768px) {
  .app-footer {
    padding: 60px 0 30px;
  }
  
  .footer-main {
    gap: 30px;
  }
  
  .logo {
    align-items: flex-start;
    
    .logo-text {
      font-size: 22px;
    }
    
    .footer-description {
      font-size: 14px;
    }
  }
  
  .nav-title,
  .info-title {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .app-footer {
    padding: 50px 0 25px;
  }
  
  .footer-main {
    gap: 25px;
  }
  
  .logo-text {
    font-size: 20px;
  }
  
  .copyright p {
    text-align: center;
  }
}
</style>