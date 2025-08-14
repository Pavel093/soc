<template>
  <div class="benefits-step">
    <h2 class="step-title dark-text">5. Другие пособия и социальные выплаты</h2>
    
    <!-- Информационный блок -->
    <div class="info-block">
      <p class="info-text">
        ℹ️ Единое пособие заменяет несколько ранее существовавших выплат. 
        Нельзя одновременно получать единое пособие и другие пособия на тех же детей.
      </p>
    </div>

    <!-- Раздел 1: Действующие пособия -->
    <div class="section">
      <h3 class="section-title">Получаете ли вы сейчас следующие пособия?</h3>
      
      <div class="benefits-list">
        <!-- Пособия на детей -->
        <div class="benefit-category">
          <h4>Пособия на детей</h4>
          
          <label class="custom-checkbox">
            <input 
              type="checkbox" 
              v-model="currentBenefits.pregnancyOld"
              :disabled="!store.isPregnant"
            />
            <span class="checkmark"></span>
            <span class="checkbox-text">
              Ежемесячное пособие беременной женщине (старое)
              <span v-if="!store.isPregnant" class="disabled-text"> (недоступно - вы не указали беременность)</span>
            </span>
          </label>

          <label class="custom-checkbox">
            <input 
              type="checkbox" 
              v-model="currentBenefits.childCareOld"
            />
            <span class="checkmark"></span>
            <span class="checkbox-text">
              Ежемесячное пособие по уходу за ребенком до 1,5 лет (для неработающих)
            </span>
          </label>

          <label class="custom-checkbox">
            <input 
              type="checkbox" 
              v-model="currentBenefits.firstChildOld"
            />
            <span class="checkmark"></span>
            <span class="checkbox-text">
              Ежемесячная выплата на первого ребенка до 3 лет
            </span>
          </label>

          <label class="custom-checkbox">
            <input 
              type="checkbox" 
              v-model="currentBenefits.thirdChildOld"
            />
            <span class="checkmark"></span>
            <span class="checkbox-text">
              Ежемесячная выплата на третьего ребенка до 3 лет
            </span>
          </label>

          <label class="custom-checkbox">
            <input 
              type="checkbox" 
              v-model="currentBenefits.childrenFrom3to7"
            />
            <span class="checkmark"></span>
            <span class="checkbox-text">
              Ежемесячная выплата на детей от 3 до 7 лет
            </span>
          </label>

          <label class="custom-checkbox">
            <input 
              type="checkbox" 
              v-model="currentBenefits.childrenFrom8to17"
            />
            <span class="checkmark"></span>
            <span class="checkbox-text">
              Ежемесячное пособие на детей от 8 до 17 лет
            </span>
          </label>
        </div>

        <!-- Региональные пособия -->
        <div class="benefit-category">
          <h4>Региональные выплаты</h4>
          
          <label class="custom-checkbox">
            <input 
              type="checkbox" 
              v-model="currentBenefits.regionalChild"
            />
            <span class="checkmark"></span>
            <span class="checkbox-text">
              Региональное пособие на ребенка
            </span>
          </label>

          <label class="custom-checkbox">
            <input 
              type="checkbox" 
              v-model="currentBenefits.regionalLowIncome"
            />
            <span class="checkmark"></span>
            <span class="checkbox-text">
              Региональное пособие малоимущим семьям
            </span>
          </label>

          <label class="custom-checkbox">
            <input 
              type="checkbox" 
              v-model="currentBenefits.regionalOther"
            />
            <span class="checkmark"></span>
            <span class="checkbox-text">
              Другие региональные выплаты на детей
            </span>
          </label>
        </div>

        <!-- Выплаты, которые можно получать одновременно -->
        <div class="benefit-category">
          <h4>Выплаты, которые МОЖНО получать вместе с единым пособием</h4>
          
          <div class="allowed-benefits">
            <label class="custom-checkbox">
              <input 
                type="checkbox" 
                v-model="allowedBenefits.maternityCapital"
              />
              <span class="checkmark"></span>
              <span class="checkbox-text allowed">
                ✓ Материнский капитал
              </span>
            </label>

            <label class="custom-checkbox">
              <input 
                type="checkbox" 
                v-model="allowedBenefits.birthCertificate"
              />
              <span class="checkmark"></span>
              <span class="checkbox-text allowed">
                ✓ Родовой сертификат
              </span>
            </label>

            <label class="custom-checkbox">
              <input 
                type="checkbox" 
                v-model="allowedBenefits.workingMaternity"
              />
              <span class="checkmark"></span>
              <span class="checkbox-text allowed">
                ✓ Пособие по беременности и родам (для работающих)
              </span>
            </label>

            <label class="custom-checkbox">
              <input 
                type="checkbox" 
                v-model="allowedBenefits.birthOneTime"
              />
              <span class="checkmark"></span>
              <span class="checkbox-text allowed">
                ✓ Единовременное пособие при рождении ребенка
              </span>
            </label>

            <label class="custom-checkbox">
              <input 
                type="checkbox" 
                v-model="allowedBenefits.childCareWorking"
              />
              <span class="checkmark"></span>
              <span class="checkbox-text allowed">
                ✓ Пособие по уходу за ребенком до 1,5 лет (для работающих)
              </span>
            </label>

            <label class="custom-checkbox">
              <input 
                type="checkbox" 
                v-model="allowedBenefits.disabledChild"
              />
              <span class="checkmark"></span>
              <span class="checkbox-text allowed">
                ✓ Выплаты на детей-инвалидов
              </span>
            </label>

            <label class="custom-checkbox">
              <input 
                type="checkbox" 
                v-model="allowedBenefits.alimony"
              />
              <span class="checkmark"></span>
              <span class="checkbox-text allowed">
                ✓ Алименты
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Раздел 2: Право выбора -->
    <div class="section" v-if="hasConflictingBenefits">
      <h3 class="section-title">⚠️ Внимание! У вас есть пособия, несовместимые с единым</h3>
      
      <div class="choice-block">
        <p class="choice-text">
          Вы получаете пособия, которые нельзя совмещать с единым пособием. 
          При назначении единого пособия от них придется отказаться.
        </p>
        
        <div class="conflicting-list">
          <h4>Несовместимые пособия:</h4>
          <ul>
            <li v-for="benefit in conflictingBenefitsList" :key="benefit">
              {{ benefit }}
            </li>
          </ul>
        </div>

        <div class="comparison">
          <div class="comparison-item current">
            <h5>Текущие выплаты</h5>
            <p class="amount">~{{ estimatedCurrentAmount }} руб./мес</p>
            <p class="note">Приблизительная сумма</p>
          </div>
          
          <div class="comparison-vs">VS</div>
          
          <div class="comparison-item new">
            <h5>Единое пособие</h5>
            <p class="amount">{{ store.totalBenefitAmount }} руб./мес</p>
            <p class="note">Предварительный расчет</p>
          </div>
        </div>

        <div class="choice-radio">
          <label class="radio-label">
            <input 
              type="radio" 
              v-model="benefitChoice" 
              value="keep"
            />
            <span class="radio-custom"></span>
            <span class="radio-text">Оставить текущие пособия</span>
          </label>
          
          <label class="radio-label">
            <input 
              type="radio" 
              v-model="benefitChoice" 
              value="switch"
            />
            <span class="radio-custom"></span>
            <span class="radio-text">Готов(а) перейти на единое пособие</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Раздел 3: Особые категории -->
    <div class="section">
      <h3 class="section-title">Особые категории</h3>
      
      <div class="special-categories">
        <label class="custom-checkbox">
          <input 
            type="checkbox" 
            v-model="specialCategories.svo"
          />
          <span class="checkmark"></span>
          <span class="checkbox-text">
            Член семьи участвует в СВО
            <span class="badge">Упрощенные условия</span>
          </span>
        </label>

        <label class="custom-checkbox">
          <input 
            type="checkbox" 
            v-model="specialCategories.manyChildren"
          />
          <span class="checkmark"></span>
          <span class="checkbox-text">
            Многодетная семья (3+ детей)
            <span class="badge">Дополнительные льготы</span>
          </span>
        </label>

        <label class="custom-checkbox">
          <input 
            type="checkbox" 
            v-model="specialCategories.disabled"
          />
          <span class="checkmark"></span>
          <span class="checkbox-text">
            В семье есть инвалид
            <span class="badge">Особые условия</span>
          </span>
        </label>

        <label class="custom-checkbox">
          <input 
            type="checkbox" 
            v-model="specialCategories.singleParent"
          />
          <span class="checkmark"></span>
          <span class="checkbox-text">
            Единственный родитель
            <span class="badge">Повышенное пособие</span>
          </span>
        </label>
      </div>
    </div>

    <!-- Итоговая информация -->
    <div class="summary-box">
      <h4>Итоговая проверка совместимости:</h4>
      
      <div class="summary-item" :class="canReceiveBenefit ? 'ok' : 'error'">
        <span class="icon">{{ canReceiveBenefit ? '✅' : '❌' }}</span>
        <span class="text">
          {{ canReceiveBenefit 
            ? 'Вы можете получать единое пособие' 
            : 'Есть препятствия для получения единого пособия' }}
        </span>
      </div>
      
      <div v-if="!canReceiveBenefit && hasConflictingBenefits" class="summary-note">
        <p>Для получения единого пособия необходимо:</p>
        <ul>
          <li v-if="benefitChoice === 'keep'">Выбрать переход на единое пособие</li>
          <li>Отказаться от несовместимых пособий</li>
        </ul>
      </div>

      <div v-if="hasSpecialConditions" class="special-note">
        <p>🌟 У вас есть особые условия:</p>
        <ul>
          <li v-if="specialCategories.svo">Упрощенная проверка для участников СВО</li>
          <li v-if="specialCategories.manyChildren">Увеличенный лимит на автомобили</li>
          <li v-if="specialCategories.disabled">Дополнительные льготы по имуществу</li>
          <li v-if="specialCategories.singleParent">Повышенный размер пособия</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCalculatorStore } from '../stores/calculatorStore'

const store = useCalculatorStore()

// Текущие пособия
const currentBenefits = ref({
  pregnancyOld: false,
  childCareOld: false,
  firstChildOld: false,
  thirdChildOld: false,
  childrenFrom3to7: false,
  childrenFrom8to17: false,
  regionalChild: false,
  regionalLowIncome: false,
  regionalOther: false
})

// Разрешенные пособия
const allowedBenefits = ref({
  maternityCapital: false,
  birthCertificate: false,
  workingMaternity: false,
  birthOneTime: false,
  childCareWorking: false,
  disabledChild: false,
  alimony: false
})

// Особые категории
const specialCategories = ref({
  svo: false,
  manyChildren: false,
  disabled: false,
  singleParent: false
})

// Выбор при конфликте пособий
const benefitChoice = ref('switch')

// Вычисляемые свойства
const hasConflictingBenefits = computed(() => {
  return Object.values(currentBenefits.value).some(v => v)
})

const conflictingBenefitsList = computed(() => {
  const list = []
  if (currentBenefits.value.pregnancyOld) list.push('Пособие беременным (старое)')
  if (currentBenefits.value.childCareOld) list.push('Пособие по уходу до 1,5 лет')
  if (currentBenefits.value.firstChildOld) list.push('Выплата на первого ребенка')
  if (currentBenefits.value.thirdChildOld) list.push('Выплата на третьего ребенка')
  if (currentBenefits.value.childrenFrom3to7) list.push('Выплата на детей 3-7 лет')
  if (currentBenefits.value.childrenFrom8to17) list.push('Пособие на детей 8-17 лет')
  if (currentBenefits.value.regionalChild) list.push('Региональное пособие на ребенка')
  if (currentBenefits.value.regionalLowIncome) list.push('Пособие малоимущим')
  if (currentBenefits.value.regionalOther) list.push('Другие региональные выплаты')
  return list
})

const estimatedCurrentAmount = computed(() => {
  let total = 0
  // Примерные суммы старых пособий
  if (currentBenefits.value.pregnancyOld) total += 7000
  if (currentBenefits.value.childCareOld) total += 7600
  if (currentBenefits.value.firstChildOld) total += store.pmChild * 0.5
  if (currentBenefits.value.thirdChildOld) total += store.pmChild * 0.5
  if (currentBenefits.value.childrenFrom3to7) {
    total += store.pmChild * 0.5 * Math.min(store.childrenCount, 4)
  }
  if (currentBenefits.value.childrenFrom8to17) {
    total += store.pmChild * 0.5 * Math.min(store.childrenCount, 4)
  }
  if (currentBenefits.value.regionalChild) total += 500
  if (currentBenefits.value.regionalLowIncome) total += 1000
  return Math.round(total)
})

const canReceiveBenefit = computed(() => {
  if (hasConflictingBenefits.value && benefitChoice.value === 'keep') {
    return false
  }
  return true
})

const hasSpecialConditions = computed(() => {
  return Object.values(specialCategories.value).some(v => v)
})

// Синхронизация с хранилищем
watch(() => hasConflictingBenefits.value && benefitChoice.value === 'keep', (value) => {
  store.otherBenefits = value
})

// Автоматическая установка многодетной семьи
watch(() => store.childrenCount, (count) => {
  if (count >= 3) {
    specialCategories.value.manyChildren = true
  }
}, { immediate: true })
</script>

<style scoped>
.benefits-step {
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

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.benefit-category {
  background: white;
  padding: 15px;
  border-radius: 6px;
}

.benefit-category h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-checkbox {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  margin-bottom: 12px;
  position: relative;
  padding-left: 30px;
}

.custom-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.custom-checkbox input:disabled {
  cursor: not-allowed;
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

.custom-checkbox input:disabled ~ .checkmark {
  background-color: #f5f5f5;
  border-color: #ccc;
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
  line-height: 1.5;
}

.checkbox-text.allowed {
  color: #28a745;
  font-weight: 500;
}

.disabled-text {
  color: #999;
  font-size: 12px;
  font-style: italic;
}

.allowed-benefits {
  background: #e8f5e9;
  padding: 10px;
  border-radius: 6px;
}

.badge {
  display: inline-block;
  background: #ffc107;
  color: #000;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  margin-left: 8px;
  font-weight: 600;
}

.choice-block {
  background: #fff3e0;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #ff9800;
}

.choice-text {
  color: #e65100;
  margin-bottom: 15px;
  font-weight: 500;
}

.conflicting-list {
  background: white;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.conflicting-list h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #d32f2f;
  font-size: 14px;
}

.conflicting-list ul {
  margin: 0;
  padding-left: 20px;
}

.conflicting-list li {
  color: #666;
  margin-bottom: 5px;
}

.comparison {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  gap: 20px;
}

.comparison-item {
  flex: 1;
  text-align: center;
  padding: 15px;
  border-radius: 8px;
}

.comparison-item.current {
  background: #ffebee;
  border: 2px solid #ef5350;
}

.comparison-item.new {
  background: #e8f5e9;
  border: 2px solid #66bb6a;
}

.comparison-item h5 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.comparison-item .amount {
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}

.comparison-item.current .amount {
  color: #d32f2f;
}

.comparison-item.new .amount {
  color: #2e7d32;
}

.comparison-item .note {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.comparison-vs {
  font-weight: bold;
  color: #666;
  font-size: 18px;
}

.choice-radio {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.3s;
}

.radio-label:hover {
  background: #f5f5f5;
}

.radio-label input[type="radio"] {
  display: none;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
  transition: all 0.3s;
}

.radio-label input:checked ~ .radio-custom {
  border-color: #2196f3;
}

.radio-label input:checked ~ .radio-custom::after {
  content: '';
  width: 10px;
  height: 10px;
  background: #2196f3;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.radio-text {
  color: #495057;
  font-size: 14px;
}

.special-categories {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.summary-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin-bottom: 15px;
}

.summary-item.ok {
  background: rgba(76, 175, 80, 0.2);
}

.summary-item.error {
  background: rgba(244, 67, 54, 0.2);
}

.summary-item .icon {
  font-size: 24px;
  margin-right: 15px;
}

.summary-item .text {
  font-size: 14px;
}

.summary-note {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
}

.summary-note p {
  margin: 0 0 10px 0;
  font-weight: 500;
}

.summary-note ul {
  margin: 0;
  padding-left: 20px;
}

.summary-note li {
  margin-bottom: 5px;
}

.special-note {
  background: rgba(255, 193, 7, 0.2);
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
}

.special-note p {
  margin: 0 0 10px 0;
  font-weight: 500;
}

.special-note ul {
  margin: 0;
  padding-left: 20px;
}

.special-note li {
  margin-bottom: 5px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .comparison {
    flex-direction: column;
  }
  
  .comparison-vs {
    transform: rotate(90deg);
    margin: 10px 0;
  }
}
</style>