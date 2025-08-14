<template>
  <div class="family-step">
    <h2 class="step-title dark-text">2. Состав семьи</h2>
    
    <!-- Раздел для беременных -->
    <div class="section" v-if="!hasChildren">
      <h3 class="section-title">Беременность</h3>
      
      <label class="custom-checkbox">
        <input type="checkbox" v-model="isPregnant" />
        <span class="checkmark"></span>
        <span class="checkbox-text">
          Я беременна и встала на учет в ранние сроки
          <span class="info-badge">Пособие для беременных</span>
        </span>
      </label>
      
      <div v-if="isPregnant" class="pregnancy-details">
        <div class="input-group">
          <label class="field-label">Срок постановки на учет (недель):</label>
          <input 
            type="number" 
            v-model.number="pregnancyWeeks"
            min="1"
            max="40"
            class="number-input"
            placeholder="12"
          />
        </div>
        
        <div v-if="pregnancyWeeks > 12" class="warning-box">
          ⚠️ Для получения пособия необходимо встать на учет до 12 недель беременности
        </div>
        
        <div v-else-if="pregnancyWeeks >= 6 && pregnancyWeeks <= 12" class="success-box">
          ✅ Срок соответствует требованиям для получения пособия
        </div>
        
        <div class="info-box">
          <p><strong>Размер пособия для беременных:</strong></p>
          <ul>
            <li>50%, 75% или 100% от прожиточного минимума трудоспособного населения</li>
            <li>Выплачивается с месяца постановки на учет до месяца родов</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Раздел для детей -->
    <div class="section">
      <h3 class="section-title">Дети</h3>
      
      <div class="children-section">
        <div class="input-group">
          <label class="field-label">Количество детей до 17 лет:</label>
          <div class="counter-group">
            <button 
              class="counter-btn" 
              @click="decrementChildren" 
              :disabled="childrenCount <= 0"
            >
              -
            </button>
            <input 
              type="number" 
              v-model.number="childrenCount"
              min="0"
              max="20"
              class="counter-input"
              readonly
            />
            <button 
              class="counter-btn" 
              @click="incrementChildren" 
              :disabled="childrenCount >= 20"
            >
              +
            </button>
          </div>
        </div>
        
        <div v-if="childrenCount > 0" class="children-details">
          <div class="info-box">
            <p><strong>Единое пособие на детей назначается:</strong></p>
            <ul>
              <li>На каждого ребенка от 0 до 17 лет</li>
              <li>Размер: 50%, 75% или 100% от прожиточного минимума на ребенка</li>
              <li v-if="childrenCount > 1">У вас {{ childrenCount }} детей - пособие будет на каждого</li>
            </ul>
          </div>
          
          <!-- Возраст детей для более точного расчета -->
          <div v-if="childrenCount > 0" class="age-distribution">
            <h4>Распределение по возрасту (необязательно):</h4>
            
            <div class="age-group">
              <label class="field-label">Дети от 0 до 3 лет:</label>
              <input 
                type="number" 
                v-model.number="childrenAges.under3"
                min="0"
                :max="childrenCount"
                class="small-input"
                @input="validateAgeDistribution"
              />
            </div>
            
            <div class="age-group">
              <label class="field-label">Дети от 3 до 7 лет:</label>
              <input 
                type="number" 
                v-model.number="childrenAges.from3to7"
                min="0"
                :max="childrenCount"
                class="small-input"
                @input="validateAgeDistribution"
              />
            </div>
            
            <div class="age-group">
              <label class="field-label">Дети от 8 до 17 лет:</label>
              <input 
                type="number" 
                v-model.number="childrenAges.from8to17"
                min="0"
                :max="childrenCount"
                class="small-input"
                @input="validateAgeDistribution"
              />
            </div>
            
            <p v-if="ageSum !== childrenCount && ageSum > 0" class="error-text">
              ⚠️ Сумма детей по возрастам ({{ ageSum }}) не равна общему количеству ({{ childrenCount }})
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Раздел для студентов -->
    <div class="section">
      <h3 class="section-title">Студенты</h3>
      
      <label class="custom-checkbox">
        <input type="checkbox" v-model="hasStudents" />
        <span class="checkmark"></span>
        <span class="checkbox-text">
          В семье есть дети от 18 до 23 лет, обучающиеся очно
        </span>
      </label>
      
      <div v-if="hasStudents" class="students-details">
        <div class="input-group">
          <label class="field-label">Количество студентов очной формы (18-23 года):</label>
          <div class="counter-group">
            <button 
              class="counter-btn" 
              @click="studentsCount = Math.max(0, studentsCount - 1)" 
              :disabled="studentsCount <= 0"
            >
              -
            </button>
            <input 
              type="number" 
              v-model.number="studentsCount"
              min="0"
              max="10"
              class="counter-input"
              readonly
            />
            <button 
              class="counter-btn" 
              @click="studentsCount++" 
              :disabled="studentsCount >= 10"
            >
              +
            </button>
          </div>
        </div>
        
        <div class="info-box">
          <p>ℹ️ Студенты 18-23 лет учитываются в составе семьи, но пособие на них не назначается</p>
        </div>
      </div>
    </div>
    
    <!-- Раздел для супруга -->
    <div class="section">
      <h3 class="section-title">Супруг(а)</h3>
      
      <label class="custom-checkbox">
        <input type="checkbox" v-model="hasSpouse" />
        <span class="checkmark"></span>
        <span class="checkbox-text">
          Состою в зарегистрированном браке
        </span>
      </label>
      
      <div v-if="!hasSpouse && childrenCount > 0" class="single-parent-info">
        <label class="custom-checkbox">
          <input type="checkbox" v-model="isSingleParent" />
          <span class="checkmark"></span>
          <span class="checkbox-text">
            Я единственный родитель
            <span class="info-badge">Повышенное пособие</span>
          </span>
        </label>
        
        <div v-if="isSingleParent" class="info-box">
          <p><strong>Единственный родитель - это:</strong></p>
          <ul>
            <li>Второй родитель умер, признан безвестно отсутствующим или умершим</li>
            <li>В свидетельстве о рождении ребенка нет записи об отце</li>
            <li>Запись об отце сделана со слов матери</li>
          </ul>
          <p class="success-text">✅ Размер пособия может быть увеличен</p>
        </div>
      </div>
    </div>
    
    <!-- Итоговая информация о семье -->
    <div class="family-summary">
      <h4>Состав вашей семьи для расчета пособия:</h4>
      
      <div class="summary-grid">
        <div class="summary-item">
          <span class="label">Взрослые:</span>
          <span class="value">{{ adultsCount }}</span>
        </div>
        
        <div class="summary-item" v-if="childrenCount > 0">
          <span class="label">Дети до 17:</span>
          <span class="value">{{ childrenCount }}</span>
        </div>
        
        <div class="summary-item" v-if="hasStudents">
          <span class="label">Студенты 18-23:</span>
          <span class="value">{{ studentsCount }}</span>
        </div>
        
        <div class="summary-item total">
          <span class="label">Всего членов семьи:</span>
          <span class="value">{{ totalFamilySize }}</span>
        </div>
      </div>
      
      <div v-if="isPregnant && !hasChildren" class="special-note">
        <p>🤰 Вы можете получать пособие для беременных</p>
      </div>
      
      <div v-if="childrenCount > 0" class="special-note">
        <p>👶 Пособие будет рассчитано на {{ childrenCount }} {{ childrenText }}</p>
      </div>
      
      <div v-if="childrenCount >= 3" class="special-note bonus">
        <p>🌟 У вас многодетная семья - действуют особые условия по имуществу</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCalculatorStore } from '../stores/calculatorStore'

const store = useCalculatorStore()

// Состояние компонента
const isPregnant = ref(false)
const pregnancyWeeks = ref(0)
const childrenCount = ref(0)
const hasStudents = ref(false)
const studentsCount = ref(0)
const hasSpouse = ref(false)
const isSingleParent = ref(false)

// Распределение детей по возрастам
const childrenAges = ref({
  under3: 0,
  from3to7: 0,
  from8to17: 0
})

// Вычисляемые свойства
const hasChildren = computed(() => childrenCount.value > 0)

const adultsCount = computed(() => {
  return (hasSpouse.value ? 2 : 1)
})

const totalFamilySize = computed(() => {
  return adultsCount.value + childrenCount.value + (hasStudents.value ? studentsCount.value : 0)
})

const ageSum = computed(() => {
  return childrenAges.value.under3 + 
         childrenAges.value.from3to7 + 
         childrenAges.value.from8to17
})

const childrenText = computed(() => {
  const count = childrenCount.value
  if (count === 1) return 'ребенка'
  if (count >= 2 && count <= 4) return 'детей'
  return 'детей'
})

// Методы
const incrementChildren = () => {
  if (childrenCount.value < 20) {
    childrenCount.value++
  }
}

const decrementChildren = () => {
  if (childrenCount.value > 0) {
    childrenCount.value--
    // Сбрасываем распределение по возрастам
    if (childrenCount.value === 0) {
      childrenAges.value = {
        under3: 0,
        from3to7: 0,
        from8to17: 0
      }
    }
  }
}

const validateAgeDistribution = () => {
  const sum = childrenAges.value.under3 + 
              childrenAges.value.from3to7 + 
              childrenAges.value.from8to17
  
  if (sum > childrenCount.value) {
    // Корректируем значения пропорционально
    const ratio = childrenCount.value / sum
    childrenAges.value.under3 = Math.floor(childrenAges.value.under3 * ratio)
    childrenAges.value.from3to7 = Math.floor(childrenAges.value.from3to7 * ratio)
    childrenAges.value.from8to17 = Math.floor(childrenAges.value.from8to17 * ratio)
  }
}

// Синхронизация с хранилищем
watch(isPregnant, (value) => {
  store.isPregnant = value
  if (!value) {
    pregnancyWeeks.value = 0
    store.pregnancyWeeks = 0
  }
})

watch(pregnancyWeeks, (value) => {
  store.pregnancyWeeks = value
})

watch(childrenCount, (value) => {
  store.childrenCount = value
})

watch(hasStudents, (value) => {
  store.hasStudents = value
  if (!value) {
    studentsCount.value = 0
    store.studentsCount = 0
  }
})

watch(studentsCount, (value) => {
  store.studentsCount = value
})

watch(hasSpouse, (value) => {
  store.hasSpouse = value
  if (value) {
    isSingleParent.value = false
  }
})

watch(isSingleParent, (value) => {
  store.isSingleParent = value
})

// Инициализация из хранилища
isPregnant.value = store.isPregnant
pregnancyWeeks.value = store.pregnancyWeeks
childrenCount.value = store.childrenCount
hasStudents.value = store.hasStudents
studentsCount.value = store.studentsCount
hasSpouse.value = store.hasSpouse
</script>


<style scoped lang="scss">
.family-step{
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  margin-top: 24px;
  h2{
    position: absolute;
    top: 15px;
    left: calc(15px + 69px + 15px);
    font-weight: 300;
    font-size: 25px;
    max-width: 90%;
    letter-spacing: 1.02px;
    line-height: 0.9;
  }
  .spouse-section{
    width: 100%;
    label{
      display: flex;
      align-items: center;
      min-height: 22px;
      padding-left: 30px;
    }
  }
  .children-section, .students-section {
    width: 100%;
    .input-group{
      display: flex;
      flex-wrap: nowrap;
      gap: 6px;
      align-items: center;
      .input-numbers{
        display: flex;
        align-items: center;
        gap: 6px;
        input[type="number"] {
          width: 60px;
          height: 38px;
          border: 1px solid #C4C2FF;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 17px;
          padding-left: 0px; 
          -moz-appearance: textfield; 
          appearance: textfield; 
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .minus, .plus{
          width: 32px;
          height: 32px;
          background-color: #008CFF;
          display: flex;
          border: none;
          border-radius: 7px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &:disabled {
            background-color: #31a3ff;
            cursor: not-allowed;
          }
        }
      }
    }
  }

  .students-section{
    display: flex;
    flex-wrap: wrap;
    height: max-content;
    label{
      display: flex;
      align-items: center;
      min-height: 22px;
      padding-left: 30px;
    }
    .two{
      margin-top:18px;
    }
  }
}
</style>