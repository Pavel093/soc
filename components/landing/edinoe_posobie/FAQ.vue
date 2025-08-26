<template>
  <section class="faq-section">
    <div class="container">
      <h2 class="title">
        Частые <span class="title__accent">вопросы</span>
      </h2>

      <div class="faq-list">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="faq-item"
          :class="{ 'faq-item--active': item.isOpen }"
          @click="toggleFaq(index)"
        >
          <div class="faq-item__header">
            <h3 class="faq-item__question">{{ item.question }}</h3>
            <div class="faq-item__icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path v-if="!item.isOpen" d="M10 4V16M16 10H4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path v-else d="M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          <transition
            name="faq-slide"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
          >
            <div v-if="item.isOpen" class="faq-item__answer">
              <p>{{ item.answer }}</p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Используем реактивные данные для управления открытием/закрытием
const faqItems = ref([
  {
    question: "Нужно ли платить или регистрироваться?",
    answer: "Нет! Калькулятор полностью бесплатный, анонимный и не требует регистрации. Мы зарабатываем только на партнерстве с банками.",
    isOpen: false
  },
  {
    question: "Вы даете 100% гарантию суммы?",
    answer: "Мы гарантируем, что расчет производится по актуальным на 2025 год правилам. Окончательное решение всегда остается за органами соцзащиты, но наш расчет — это надежный ориентир.",
    isOpen: false
  },
  {
    question: "Куда вводятся мои данные? Это безопасно?",
    answer: "ВСЕ РАСЧЕТЫ происходят прямо в вашем браузере. Мы не собираем и не можем сохранить ваши персональные и финансовые данные. Ваша конфиденциальность под защитой.",
    isOpen: false
  },
  {
    question: "Почему вы спрашиваете про доход и имущество?",
    answer: "Единое пособие — это адресная мера поддержки. Его назначение и размер напрямую зависят от критериев нуждаемости, установленных государством.",
    isOpen: false
  }
]);

// Функция для переключения состояния FAQ
const toggleFaq = (index) => {
  // Закрываем все остальные элементы при открытии нового (опционально)
  // faqItems.value.forEach((item, i) => {
  //   if (i !== index) item.isOpen = false;
  // });

  // Просто переключаем текущий элемент
  faqItems.value[index].isOpen = !faqItems.value[index].isOpen;
};

// Анимации для плавного раскрытия
const enter = (el) => {
  el.style.height = 'auto';
  const height = getComputedStyle(el).height;
  el.style.height = '0';
  getComputedStyle(el);
  setTimeout(() => {
    el.style.height = height;
  });
};

const afterEnter = (el) => {
  el.style.height = 'auto';
};

const leave = (el) => {
  el.style.height = getComputedStyle(el).height;
  getComputedStyle(el);
  setTimeout(() => {
    el.style.height = '0';
  });
};
</script>

<style scoped lang="scss">
.faq-section {
  padding: 80px 0;

  .container {
    max-width: 900px; // Уже контейнер для лучшего чтения
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .title {
    font-size: 48px;
    font-weight: 700;
    text-align: center;
    color: #1a1a1a;
    margin-bottom: 60px;
    line-height: 1.2;
    
    &__accent {
      color: #1775F6;
    }
    
    @media (max-width: 768px) {
      font-size: 32px;
      margin-bottom: 40px;
    }
  }
  
  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .faq-item {
    background: #ffff;
    border-radius: 25px;
    padding: 25px 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #eef2f7;
    }
    
    &--active {
      .faq-item__icon {
        transform: rotate(180deg);
      }
    }
    
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }
    
    &__question {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
      flex: 1;
      
      @media (max-width: 480px) {
        font-size: 16px;
      }
    }
    
    &__icon {
      color: #2b7bf6;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }
    
    &__answer {
      overflow: hidden;
      transition: height 0.3s ease;
      
      p {
        font-size: 16px;
        line-height: 1.6;
        color: #6b7280;
        margin: 0;
        padding-top: 20px;
        
        @media (max-width: 480px) {
          font-size: 14px;
        }
      }
    }
    
    // Стили для активного состояния ответа
    &--active &__answer p {
      color: rgba(255, 255, 255, 0.95);
    }
  }
  
  // Transition styles
  .faq-slide-enter-active,
  .faq-slide-leave-active {
    transition: height 0.3s ease;
  }
}

// Адаптивность
@media (max-width: 768px) {
  .faq-item {
    padding: 20px;
  }
}
</style>