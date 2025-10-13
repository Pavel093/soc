<template>
  <div class="rating-widget">
    <!-- Состояние выбора оценки -->
    <div v-if="!isRated" class="rating-container">
      <div class="rating-title">Оцените калькулятор</div>
      <div class="stars-container">
        <button
          v-for="star in 5"
          :key="star"
          class="star-button"
          @click="selectRating(star)"
          @mouseenter="hoveredStar = star"
          @mouseleave="hoveredStar = 0"
          :class="{
            'star-button--active': star <= (hoveredStar || selectedRating),
            'star-button--hover': star <= hoveredStar
          }"
        >
          ⭐
        </button>
      </div>
      
      <!-- Кнопка подтверждения -->
      <button 
        v-if="selectedRating > 0"
        class="confirm-button"
        @click="confirmRating"
      >
        Подтвердить оценку
      </button>
    </div>

    <!-- Состояние после оценки -->
    <div v-else class="thank-you-message">
      <div class="thank-you-icon">🎉</div>
      <div class="thank-you-content">
        <div class="thank-you-text">Спасибо за оценку!</div>
        <div class="current-rating">
          Ваша оценка: 
          <span class="rating-stars">
            <span 
              v-for="star in 5" 
              :key="star"
              class="rating-star"
              :class="{'rating-star--active': star <= savedRating}"
            >
              ⭐
            </span>
          </span>
        </div>
        <button 
          class="change-rating-button"
          @click="changeRating"
        >
          Изменить оценку
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isRated = ref(false)
const selectedRating = ref(0)
const hoveredStar = ref(0)
const savedRating = ref(0)

// Загружаем сохраненную оценку при монтировании
onMounted(() => {
  const saved = localStorage.getItem('calculator-rating')
  if (saved) {
    savedRating.value = parseInt(saved)
    isRated.value = true
  }
})

const selectRating = (rating) => {
  selectedRating.value = rating
}

const confirmRating = () => {
  if (selectedRating.value > 0) {
    savedRating.value = selectedRating.value
    isRated.value = true
    
    // Сохраняем в localStorage
    localStorage.setItem('calculator-rating', selectedRating.value.toString())
    
    // Здесь можно добавить отправку оценки на сервер
    console.log(`Пользователь оценил на ${selectedRating.value} звезд`)
  }
}

const changeRating = () => {
  isRated.value = false
  selectedRating.value = savedRating.value // Показываем текущую оценку при изменении
}
</script>

<style lang="scss" scoped>
.rating-widget {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 20px 0;
}

.rating-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: rgba(23, 117, 246, 0.05);
  border: 1px solid rgba(23, 117, 246, 0.1);
  border-radius: 12px;
  max-width: 320px;
  width: 100%;
}

.rating-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
}

.stars-container {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.star-button {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  filter: grayscale(1) opacity(0.6);
  transform: scale(1);
  
  &:hover {
    transform: scale(1.1);
    filter: grayscale(0) opacity(1);
  }
  
  &--active {
    filter: grayscale(0) opacity(1);
    transform: scale(1.05);
  }
  
  &--hover {
    transform: scale(1.15);
    transition: transform 0.1s ease;
  }
}

.confirm-button {
  background: #1775F6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1463d6;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(23, 117, 246, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.thank-you-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 12px;
  max-width: 320px;
  width: 100%;
  animation: thankYouAppear 0.5s ease;
}

.thank-you-icon {
  font-size: 40px;
  animation: bounce 0.6s ease;
}

.thank-you-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.thank-you-text {
  font-size: 16px;
  font-weight: 600;
  color: #0369a1;
  text-align: center;
}

.current-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #475569;
}

.rating-stars {
  display: flex;
  gap: 4px;
}

.rating-star {
  font-size: 20px;
  filter: grayscale(1) opacity(0.4);
  transition: all 0.3s ease;
  
  &--active {
    filter: grayscale(0) opacity(1);
  }
}

.change-rating-button {
  background: transparent;
  color: #64748b;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  
  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
    color: #475569;
  }
}

// Анимации
@keyframes thankYouAppear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 20%, 60%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  80% {
    transform: translateY(-5px);
  }
}

// Адаптивность
@media (max-width: 480px) {
  .rating-widget {
    margin: 16px 0;
  }
  
  .rating-container {
    padding: 20px 16px;
    margin: 0 16px;
    gap: 14px;
  }
  
  .star-button {
    font-size: 28px;
  }
  
  .thank-you-message {
    margin: 0 16px;
    padding: 20px 16px;
    gap: 14px;
  }
  
  .thank-you-icon {
    font-size: 36px;
  }
  
  .thank-you-text {
    font-size: 15px;
  }
  
  .current-rating {
    font-size: 13px;
  }
  
  .rating-star {
    font-size: 18px;
  }
}
</style>