<template>
  <div class="income-step">
    <h2 class="step-title dark-text">3. Доходы семьи и правило нулевого дохода</h2>
    
    <!-- Блок информации о правиле нулевого дохода -->
    <div class="info-block">
      <p class="info-text">
        ℹ️ Каждый трудоспособный член семьи должен иметь доход не менее 
        <strong>89 760 руб. в год</strong> (4 МРОТ) или уважительную причину его отсутствия
      </p>
    </div>

    <!-- Раздел 1: Трудоспособные члены семьи -->
    <div class="section">
      <h3 class="section-title">Трудоспособные члены семьи</h3>
      
      <!-- Заявитель -->
      <div class="income-person">
        <h4>Заявитель (Вы)</h4>
        
        <div class="input-group">
          <label class="field-label">Годовой доход от трудовой деятельности (руб.):</label>
          <input 
            type="number" 
            v-model.number="applicantIncome"
            min="0"
            class="number-input"
            placeholder="0"
          />
        </div>

        <div v-if="applicantIncome < 89760" class="reason-block">
          <label class="field-label warning">
            ⚠️ Доход меньше минимального. Укажите уважительную причину:
          </label>
          <div class="reason-checkboxes">
            <label class="custom-checkbox" v-for="reason in validReasons" :key="reason.id">
              <input 
                type="checkbox" 
                :value="reason.id"
                v-model="applicantReasons"
              />
              <span class="checkmark"></span>
              <span class="checkbox-text">{{ reason.text }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Супруг(а) -->
      <div class="income-person" v-if="store.hasSpouse">
        <h4>Супруг(а)</h4>
        
        <div class="input-group">
          <label class="field-label">Годовой доход супруга(и) (руб.):</label>
          <input 
            type="number" 
            v-model.number="spouseIncome"
            min="0"
            class="number-input"
            placeholder="0"
          />
        </div>

        <div v-if="spouseIncome < 89760" class="reason-block">
          <label class="field-label warning">
            ⚠️ Доход меньше минимального. Укажите уважительную причину:
          </label>
          <div class="reason-checkboxes">
            <label class="custom-checkbox" v-for="reason in validReasons" :key="reason.id">
              <input 
                type="checkbox" 
                :value="reason.id"
                v-model="spouseReasons"
              />
              <span class="checkmark"></span>
              <span class="checkbox-text">{{ reason.text }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Раздел 2: Дополнительные доходы семьи -->
    <div class="section">
      <h3 class="section-title">Дополнительные доходы семьи (за последние 12 месяцев)</h3>
      
      <div class="additional-income">
        <div class="input-group">
          <label class="field-label">
            <span class="icon">👶</span>
            Алименты на детей (руб./год):
          </label>
          <input 
            type="number" 
            v-model.number="additionalIncome.alimony"
            min="0"
            class="number-input"
            placeholder="0"
          />
        </div>

        <div class="input-group">
          <label class="field-label">
            <span class="icon">👴</span>
            Пенсии (руб./год):
          </label>
          <input 
            type="number" 
            v-model.number="additionalIncome.pension"
            min="0"
            class="number-input"
            placeholder="0"
          />
        </div>

        <div class="input-group">
          <label class="field-label">
            <span class="icon">🎓</span>
            Стипендии (руб./год):
          </label>
          <input 
            type="number" 
            v-model.number="additionalIncome.scholarship"
            min="0"
            class="number-input"
            placeholder="0"
          />
        </div>

        <div class="input-group">
          <label class="field-label">
            <span class="icon">🏠</span>
            Доход от сдачи имущества в аренду (руб./год):
          </label>
          <input 
            type="number" 
            v-model.number="additionalIncome.rental"
            min="0"
            class="number-input"
            placeholder="0"
          />
        </div>

        <div class="input-group">
          <label class="field-label">
            <span class="icon">💼</span>
            Доход от предпринимательской деятельности (руб./год):
          </label>
          <input 
            type="number" 
            v-model.number="additionalIncome.business"
            min="0"
            class="number-input"
            placeholder="0"
          />
        </div>

        <div class="input-group">
          <label class="field-label">
            <span class="icon">💰</span>
            Проценты по вкладам (руб./год):
          </label>
          <input 
            type="number" 
            v-model.number="additionalIncome.deposits"
            min="0"
            class="number-input"
            placeholder="0"
          />
        </div>

        <div class="input-group">
          <label class="field-label">
            <span class="icon">📄</span>
            Прочие доходы (руб./год):
          </label>
          <input 
            type="number" 
            v-model.number="additionalIncome.other"
            min="0"
            class="number-input"
            placeholder="0"
          />
        </div>
      </div>
    </div>

    <!-- Раздел 3: Доходы, НЕ учитываемые при расчете -->
    <div class="section">
      <h3 class="section-title">Доходы, которые НЕ учитываются (необязательно)</h3>
      
      <div class="excluded-income">
        <label class="custom-checkbox">
          <input type="checkbox" v-model="hasExcludedIncome.svo" />
          <span class="checkmark"></span>
          <span class="checkbox-text">Получаем выплаты за участие в СВО</span>
        </label>
        
        <div v-if="hasExcludedIncome.svo" class="input-group indent">
          <label class="field-label">Сумма выплат СВО (руб./год):</label>
          <input 
            type="number" 
            v-model.number="excludedIncome.svoPayments"
            min="0"
            class="number-input"
            placeholder="0"
          />
        </div>

        <label class="custom-checkbox">
          <input type="checkbox" v-model="hasExcludedIncome.maternity" />
          <span class="checkmark"></span>
          <span class="checkbox-text">Использовали материнский капитал</span>
        </label>

        <label class="custom-checkbox">
          <input type="checkbox" v-model="hasExcludedIncome.birth" />
          <span class="checkmark"></span>
          <span class="checkbox-text">Получали единовременные выплаты при рождении</span>
        </label>

        <label class="custom-checkbox">
          <input type="checkbox" v-model="hasExcludedIncome.tax" />
          <span class="checkmark"></span>
          <span class="checkbox-text">Получали налоговые вычеты</span>
        </label>
      </div>
    </div>

    <!-- Итоговая информация -->
    <div class="summary-box">
      <h4>Предварительный расчет:</h4>
      <div class="summary-row">
        <span>Общий учитываемый доход семьи:</span>
        <strong>{{ totalIncome.toLocaleString('ru-RU') }} руб./год</strong>
      </div>
      <div class="summary-row">
        <span>Среднедушевой доход в месяц:</span>
        <strong :class="monthlyPerPerson < store.pmValue ? 'text-success' : 'text-danger'">
          {{ monthlyPerPerson.toLocaleString('ru-RU') }} руб.
        </strong>
      </div>
      <div class="summary-row">
        <span>Прожиточный минимум в регионе:</span>
        <span>{{ store.pmValue.toLocaleString('ru-RU') }} руб.</span>
      </div>
      <div class="summary-row status">
        <span>Правило нулевого дохода:</span>
        <span :class="zeroIncomeRuleOk ? 'text-success' : 'text-danger'">
          {{ zeroIncomeRuleOk ? '✓ Соблюдается' : '✗ Не соблюдается' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useCalculatorStore } from '../stores/calculatorStore'

const store = useCalculatorStore()

// Доходы заявителя и супруга
const applicantIncome = ref(0)
const spouseIncome = ref(0)
const applicantReasons = ref([])
const spouseReasons = ref([])

// Дополнительные доходы
const additionalIncome = ref({
  alimony: 0,
  pension: 0,
  scholarship: 0,
  rental: 0,
  business: 0,
  deposits: 0,
  other: 0
})

// Исключаемые доходы
const hasExcludedIncome = ref({
  svo: false,
  maternity: false,
  birth: false,
  tax: false
})

const excludedIncome = ref({
  svoPayments: 0,
  maternityCapital: 0,
  birthPayments: 0,
  taxDeductions: 0
})

// Список уважительных причин отсутствия дохода
const validReasons = [
  { id: 'childCare', text: 'Уход за ребенком до 3 лет' },
  { id: 'disabled', text: 'Уход за ребенком-инвалидом до 18 лет' },
  { id: 'elderCare', text: 'Уход за инвалидом или пожилым (старше 80 лет)' },
  { id: 'study', text: 'Очное обучение (до 23 лет)' },
  { id: 'unemployed', text: 'Статус безработного (не более 6 месяцев)' },
  { id: 'military', text: 'Военная служба или мобилизация' },
  { id: 'treatment', text: 'Длительное лечение (более 3 месяцев)' },
  { id: 'prison', text: 'Лишение свободы или нахождение под стражей' },
  { id: 'pregnancy', text: 'Беременность (на 6 месяце и более)' }
]

// Общий учитываемый доход
const totalIncome = computed(() => {
  const salary = applicantIncome.value + (store.hasSpouse ? spouseIncome.value : 0)
  const additional = Object.values(additionalIncome.value).reduce((sum, val) => sum + val, 0)
  return salary + additional
})

// Среднедушевой доход в месяц
const monthlyPerPerson = computed(() => {
  if (store.familySize === 0) return 0
  return Math.round(totalIncome.value / 12 / store.familySize)
})

// Проверка правила нулевого дохода
const zeroIncomeRuleOk = computed(() => {
  // Проверяем заявителя
  if (applicantIncome.value < 89760 && applicantReasons.value.length === 0) {
    return false
  }
  
  // Проверяем супруга, если есть
  if (store.hasSpouse) {
    if (spouseIncome.value < 89760 && spouseReasons.value.length === 0) {
      return false
    }
  }
  
  return true
})

// Синхронизация с хранилищем
watch([applicantIncome, spouseIncome], () => {
  store.income.salary = applicantIncome.value + (store.hasSpouse ? spouseIncome.value : 0)
})

watch(additionalIncome, (newVal) => {
  store.income.alimony = newVal.alimony
  store.income.pension = newVal.pension
  store.income.scholarship = newVal.scholarship
  store.income.rental = newVal.rental
  store.income.business = newVal.business
  store.income.other = newVal.deposits + newVal.other
}, { deep: true })

watch(excludedIncome, (newVal) => {
  store.excludedIncome.svoPayments = newVal.svoPayments
  store.excludedIncome.maternityCapital = newVal.maternityCapital
  store.excludedIncome.birthPayments = newVal.birthPayments
  store.excludedIncome.taxDeductions = newVal.taxDeductions
}, { deep: true })

watch([applicantReasons, spouseReasons], () => {
  const allReasons = [...new Set([...applicantReasons.value, ...spouseReasons.value])]
  store.income.zeroIncomeReasons = allReasons
  store.income.hasZeroIncomeReason = allReasons.length > 0
})
</script>

<style scoped>
.income-step {
  padding: 20px;
}

.step-title {
  margin-bottom: 20px;
  font-size: 20px;
}

.info-block {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 15px;
  margin-bottom: 25px;
  border-radius: 4px;
}

.info-text {
  margin: 0;
  color: #1565c0;
  font-size: 14px;
}

.section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #495057;
}

.income-person {
  background: white;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.income-person h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.input-group {
  margin-bottom: 15px;
}

.field-label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.field-label.warning {
  color: #ff9800;
  font-weight: 500;
}

.icon {
  margin-right: 5px;
  font-size: 16px;
}

.number-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.number-input:focus {
  outline: none;
  border-color: #2196f3;
}

.reason-block {
  background: #fff3e0;
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
}

.reason-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
  position: relative;
  padding-left: 30px;
}

.custom-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  left: 0;
  top: 2px;
  height: 20px;
  width: 20px;
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: all 0.3s;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #2196f3;
  border-color: #2196f3;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-text {
  margin-left: 8px;
  color: #495057;
  font-size: 14px;
}

.additional-income {
  display: grid;
  gap: 15px;
}

.excluded-income {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.indent {
  margin-left: 30px;
  margin-top: 10px;
}

.summary-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-top: 25px;
}

.summary-box h4 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.status {
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.text-success {
  color: #4caf50;
  font-weight: 600;
}

.text-danger {
  color: #f44336;
  font-weight: 600;
}

.summary-box .text-success {
  color: #81c784;
}

.summary-box .text-danger {
  color: #ffcdd2;
}

/* Адаптивность */
@media (max-width: 768px) {
  .income-step {
    padding: 15px;
  }
  
  .section {
    padding: 15px;
  }
  
  .income-person {
    padding: 12px;
  }
}
</style>