<template>
  <div class="property-step">
    <h2 class="step-title dark-text">4. Имущественные условия</h2>
    
    <!-- Информационный блок -->
    <div class="info-block">
      <p class="info-text">
        ℹ️ Для получения пособия семья должна соответствовать имущественным требованиям. 
        Учитывается всё имущество членов семьи.
      </p>
    </div>

    <!-- Раздел 1: Недвижимость -->
    <div class="section">
      <h3 class="section-title">🏠 Недвижимость</h3>
      
      <!-- Жилые помещения -->
      <div class="property-item">
        <h4>Квартиры и дома</h4>
        
        <div class="input-group">
          <label class="field-label">Количество жилых помещений (квартир, домов):</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model.number="homes" :value="0" />
              <span class="radio-custom"></span>
              <span class="radio-text">Нет в собственности</span>
            </label>
            <label class="radio-label">
              <input type="radio" v-model.number="homes" :value="1" />
              <span class="radio-custom"></span>
              <span class="radio-text">1 помещение</span>
            </label>
            <label class="radio-label">
              <input type="radio" v-model.number="homes" :value="2" />
              <span class="radio-custom"></span>
              <span class="radio-text">2 и более</span>
            </label>
          </div>
        </div>

        <!-- Проверка площади при множественной недвижимости -->
        <div v-if="homes > 1" class="area-check">
          <div class="warning-box">
            <p>⚠️ При наличии нескольких жилых помещений учитывается общая площадь</p>
          </div>
          
          <div class="input-group">
            <label class="field-label">Общая площадь всех жилых помещений (м²):</label>
            <input 
              type="number" 
              v-model.number="totalHomeArea"
              min="0"
              class="number-input"
              placeholder="0"
            />
          </div>
          
          <div class="calculation-info">
            <p>Размер семьи: <strong>{{ store.familySize }} чел.</strong></p>
            <p>Максимально допустимая площадь: <strong>{{ maxAllowedArea }} м²</strong> (24 м² на человека)</p>
            <p class="status" :class="homeAreaOk ? 'status-ok' : 'status-error'">
              {{ homeAreaOk ? '✓ Соответствует требованиям' : '✗ Превышает допустимую норму' }}
            </p>
          </div>
        </div>

        <!-- Исключения -->
        <div v-if="homes > 0" class="exceptions">
          <label class="custom-checkbox">
            <input type="checkbox" v-model="homeExceptions.uninhabitable" />
            <span class="checkmark"></span>
            <span class="checkbox-text">Одно из помещений признано непригодным для проживания</span>
          </label>
          <label class="custom-checkbox">
            <input type="checkbox" v-model="homeExceptions.familyMemberIll" />
            <span class="checkmark"></span>
            <span class="checkbox-text">Член семьи страдает тяжелой формой хронического заболевания</span>
          </label>
          <label class="custom-checkbox">
            <input type="checkbox" v-model="homeExceptions.moreThree" />
            <span class="checkmark"></span>
            <span class="checkbox-text">Помещение предоставлено многодетной семье в качестве меры поддержки</span>
          </label>
        </div>
      </div>

      <!-- Дачи -->
      <div class="property-item">
        <h4>Дачи и садовые дома</h4>
        <div class="input-group">
          <label class="custom-checkbox">
            <input type="checkbox" v-model="hasDacha" />
            <span class="checkmark"></span>
            <span class="checkbox-text">Есть дача или садовый дом</span>
          </label>
        </div>
        <div v-if="hasDacha" class="sub-options">
          <label class="field-label">Количество дач:</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model.number="dachaCount" :value="1" />
              <span class="radio-custom"></span>
              <span class="radio-text">1 дача</span>
            </label>
            <label class="radio-label">
              <input type="radio" v-model.number="dachaCount" :value="2" />
              <span class="radio-custom"></span>
              <span class="radio-text">2 и более</span>
            </label>
          </div>
          <p v-if="dachaCount > 1" class="error-text">
            ❌ Допускается не более 1 дачи на семью
          </p>
        </div>
      </div>

      <!-- Гаражи -->
      <div class="property-item">
        <h4>Гаражи и машиноместа</h4>
        <div class="input-group">
          <label class="custom-checkbox">
            <input type="checkbox" v-model="hasGarage" />
            <span class="checkmark"></span>
            <span class="checkbox-text">Есть гараж или машиноместо</span>
          </label>
        </div>
        <div v-if="hasGarage" class="sub-options">
          <label class="field-label">Количество гаражей/машиномест:</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model.number="garageCount" :value="1" />
              <span class="radio-custom"></span>
              <span class="radio-text">1</span>
            </label>
            <label class="radio-label">
              <input type="radio" v-model.number="garageCount" :value="2" />
              <span class="radio-custom"></span>
              <span class="radio-text">2 (для семей с инвалидом)</span>
            </label>
            <label class="radio-label">
              <input type="radio" v-model.number="garageCount" :value="3" />
              <span class="radio-custom"></span>
              <span class="radio-text">3 и более</span>
            </label>
          </div>
          
          <div v-if="garageCount > 1" class="additional-check">
            <label class="custom-checkbox">
              <input type="checkbox" v-model="hasDisabledPerson" />
              <span class="checkmark"></span>
              <span class="checkbox-text">В семье есть инвалид</span>
            </label>
            <p v-if="garageCount > 2 || (garageCount > 1 && !hasDisabledPerson)" class="error-text">
              ❌ Превышено допустимое количество гаражей
            </p>
          </div>
        </div>
      </div>

      <!-- Нежилые помещения -->
      <div class="property-item">
        <h4>Нежилые помещения</h4>
        <div class="input-group">
          <label class="custom-checkbox">
            <input type="checkbox" v-model="hasNonResidential" />
            <span class="checkmark"></span>
            <span class="checkbox-text">Есть нежилые помещения</span>
          </label>
        </div>
        <div v-if="hasNonResidential" class="info-box">
          <p>ℹ️ Хозяйственные постройки на земельных участках (сараи, бани и т.д.) не учитываются</p>
        </div>
      </div>

      <!-- Земельные участки -->
      <div class="property-item">
        <h4>Земельные участки</h4>
        <div class="input-group">
          <label class="custom-checkbox">
            <input type="checkbox" v-model="hasLand" />
            <span class="checkmark"></span>
            <span class="checkbox-text">Есть земельные участки</span>
          </label>
        </div>
        <div v-if="hasLand" class="sub-options">
          <div class="input-group">
            <label class="field-label">Общая площадь земельных участков (соток):</label>
            <input 
              type="number" 
              v-model.number="landArea"
              min="0"
              class="number-input"
              placeholder="0"
            />
          </div>
          <div class="calculation-info">
            <p>Максимально допустимая площадь:</p>
            <ul>
              <li>В городе: <strong>25 соток</strong></li>
              <li>В сельской местности: <strong>100 соток</strong></li>
            </ul>
            <label class="custom-checkbox">
              <input type="checkbox" v-model="isRuralArea" />
              <span class="checkmark"></span>
              <span class="checkbox-text">Участок в сельской местности</span>
            </label>
            <p class="status" :class="landAreaOk ? 'status-ok' : 'status-error'">
              {{ landAreaOk ? '✓ Соответствует требованиям' : '✗ Превышает допустимую норму' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Раздел 2: Транспортные средства -->
    <div class="section">
      <h3 class="section-title">🚗 Транспортные средства</h3>
      
      <!-- Автомобили -->
      <div class="property-item">
        <h4>Автомобили</h4>
        
        <div class="input-group">
          <label class="field-label">Количество автомобилей в семье:</label>
          <div class="counter-group">
            <button @click="decrementCars" :disabled="cars <= 0" class="counter-btn">-</button>
            <input 
              type="number" 
              v-model.number="cars"
              min="0"
              max="10"
              class="counter-input"
              @input="validateCarInput"
            />
            <button @click="incrementCars" :disabled="cars >= 10" class="counter-btn">+</button>
          </div>
        </div>

        <div class="calculation-info" v-if="store.childrenCount >= 0">
          <p>Количество детей в семье: <strong>{{ store.childrenCount }}</strong></p>
          <p>Максимально допустимо автомобилей: <strong>{{ maxCars }}</strong></p>
          <p class="status" :class="carsOk ? 'status-ok' : 'status-error'">
            {{ carsOk ? '✓ Соответствует требованиям' : '✗ Превышает допустимое количество' }}
          </p>
        </div>

        <!-- Детали по автомобилям -->
        <div v-if="cars > 0" class="car-details">
          <h5>Укажите параметры автомобилей:</h5>
          
          <div v-for="i in cars" :key="i" class="car-item">
            <h6>Автомобиль {{ i }}</h6>
            
            <div class="input-group">
              <label class="field-label">Мощность двигателя (л.с.):</label>
              <input 
                type="number" 
                v-model.number="carDetails[i-1].power"
                min="0"
                class="number-input"
                placeholder="0"
              />
            </div>
            
            <div class="input-group">
              <label class="field-label">Год выпуска:</label>
              <input 
                type="number" 
                v-model.number="carDetails[i-1].year"
                min="1900"
                :max="currentYear"
                class="number-input"
                placeholder="2020"
              />
            </div>
            
            <div class="car-status">
              <p v-if="carDetails[i-1].power > 250" class="warning-text">
                ⚠️ Мощность более 250 л.с.
              </p>
              <p v-if="currentYear - carDetails[i-1].year < 5" class="warning-text">
                ⚠️ Возраст менее 5 лет
              </p>
              <p v-if="carDetails[i-1].power > 250 && currentYear - carDetails[i-1].year < 5" class="error-text">
                ❌ Автомобиль не соответствует требованиям (мощность > 250 л.с. И возраст < 5 лет)
              </p>
            </div>
            
            <label class="custom-checkbox">
              <input type="checkbox" v-model="carDetails[i-1].isSpecial" />
              <span class="checkmark"></span>
              <span class="checkbox-text">Автомобиль для инвалида (получен через соцзащиту)</span>
            </label>
            
            <label class="custom-checkbox">
              <input type="checkbox" v-model="carDetails[i-1].isTaxi" />
              <span class="checkmark"></span>
              <span class="checkbox-text">Используется как такси (есть лицензия)</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Мотоциклы -->
      <div class="property-item">
        <h4>Мотоциклы и мототранспорт</h4>
        
        <div class="input-group">
          <label class="field-label">Количество мотоциклов:</label>
          <div class="counter-group">
            <button @click="motorcycles = Math.max(0, motorcycles - 1)" 
                    :disabled="motorcycles <= 0" class="counter-btn">-</button>
            <input 
              type="number" 
              v-model.number="motorcycles"
              min="0"
              max="10"
              class="counter-input"
            />
            <button @click="motorcycles++" 
                    :disabled="motorcycles >= 10" class="counter-btn">+</button>
          </div>
        </div>
        
        <p v-if="motorcycles > 1" class="error-text">
          ❌ Допускается не более 1 мотоцикла на семью
        </p>
      </div>

      <!-- Самоходная техника -->
      <div class="property-item">
        <h4>Самоходная техника</h4>
        
        <label class="custom-checkbox">
          <input type="checkbox" v-model="hasTractor" />
          <span class="checkmark"></span>
          <span class="checkbox-text">Есть трактор, комбайн или другая самоходная техника</span>
        </label>
        
        <div v-if="hasTractor" class="sub-options">
          <div class="input-group">
            <label class="field-label">Возраст техники (лет):</label>
            <input 
              type="number" 
              v-model.number="tractorAge"
              min="0"
              class="number-input"
              placeholder="0"
            />
          </div>
          <p v-if="tractorAge < 5" class="error-text">
            ❌ Самоходная техника младше 5 лет не допускается
          </p>
        </div>
      </div>

      <!-- Водный транспорт -->
      <div class="property-item">
        <h4>Водный транспорт</h4>
        
        <label class="custom-checkbox">
          <input type="checkbox" v-model="hasBoat" />
          <span class="checkmark"></span>
          <span class="checkbox-text">Есть катер, моторная лодка или другой водный транспорт</span>
        </label>
        
        <div v-if="hasBoat" class="sub-options">
          <div class="input-group">
            <label class="field-label">Возраст водного транспорта (лет):</label>
            <input 
              type="number" 
              v-model.number="boatAge"
              min="0"
              class="number-input"
              placeholder="0"
            />
          </div>
          <p v-if="boatAge < 5" class="error-text">
            ❌ Водный транспорт младше 5 лет не допускается
          </p>
        </div>
      </div>
    </div>

    <!-- Раздел 3: Финансовые активы -->
    <div class="section">
      <h3 class="section-title">💰 Сбережения</h3>
      
      <div class="property-item">
        <div class="input-group">
          <label class="field-label">
            Есть ли вклады, на которые начисляется доход более 
            {{ (store.pmValue * 12).toLocaleString('ru-RU') }} руб. в год?
          </label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="hasLargeDeposits" :value="false" />
              <span class="radio-custom"></span>
              <span class="radio-text">Нет</span>
            </label>
            <label class="radio-label">
              <input type="radio" v-model="hasLargeDeposits" :value="true" />
              <span class="radio-custom"></span>
              <span class="radio-text">Да</span>
            </label>
          </div>
        </div>
        
        <div v-if="hasLargeDeposits" class="warning-box">
          <p>⚠️ Проценты по вкладам учитываются в доходах семьи</p>
        </div>
      </div>
    </div>

    <!-- Итоговая проверка -->
    <div class="summary-box">
      <h4>Проверка имущественных условий:</h4>
      <div class="check-list">
        <div class="check-item" :class="homeRequirementsMet ? 'check-ok' : 'check-error'">
          <span class="check-icon">{{ homeRequirementsMet ? '✓' : '✗' }}</span>
          <span>Недвижимость</span>
        </div>
        <div class="check-item" :class="carRequirementsMet ? 'check-ok' : 'check-error'">
          <span class="check-icon">{{ carRequirementsMet ? '✓' : '✗' }}</span>
          <span>Автомобили</span>
        </div>
        <div class="check-item" :class="otherTransportMet ? 'check-ok' : 'check-error'">
          <span class="check-icon">{{ otherTransportMet ? '✓' : '✗' }}</span>
          <span>Другой транспорт</span>
        </div>
        <div class="check-item" :class="landRequirementsMet ? 'check-ok' : 'check-error'">
          <span class="check-icon">{{ landRequirementsMet ? '✓' : '✗' }}</span>
          <span>Земельные участки</span>
        </div>
      </div>
      
      <div class="overall-status" :class="allRequirementsMet ? 'status-success' : 'status-error'">
        {{ allRequirementsMet ? '✅ Все требования соблюдены' : '❌ Имущество не соответствует требованиям' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { useCalculatorStore } from '../stores/calculatorStore'

const store = useCalculatorStore()
const currentYear = new Date().getFullYear()

// Недвижимость
const homes = ref(1)
const totalHomeArea = ref(0)
const homeExceptions = reactive({
  uninhabitable: false,
  familyMemberIll: false,
  moreThree: false
})
const hasDacha = ref(false)
const dachaCount = ref(1)
const hasGarage = ref(false)
const garageCount = ref(1)
const hasDisabledPerson = ref(false)
const hasNonResidential = ref(false)
const hasLand = ref(false)
const landArea = ref(0)
const isRuralArea = ref(false)

// Транспорт
const cars = ref(0)
const carDetails = ref([])
const motorcycles = ref(0)
const hasTractor = ref(false)
const tractorAge = ref(0)
const hasBoat = ref(false)
const boatAge = ref(0)

// Финансы
const hasLargeDeposits = ref(false)

// Вычисляемые свойства
const maxCars = computed(() => store.childrenCount >= 3 ? 2 : 1)
const maxAllowedArea = computed(() => store.familySize * 24)
const homeAreaOk = computed(() => {
  if (homes.value <= 1) return true
  if (Object.values(homeExceptions).some(v => v)) return true
  return totalHomeArea.value <= maxAllowedArea.value
})

const landAreaOk = computed(() => {
  if (!hasLand.value) return true
  const maxArea = isRuralArea.value ? 100 : 25
  return landArea.value <= maxArea
})

const carsOk = computed(() => {
  if (cars.value <= maxCars.value) return true
  // Проверяем исключения (инвалид, такси)
  const specialCars = carDetails.value.filter(car => car.isSpecial || car.isTaxi).length
  return (cars.value - specialCars) <= maxCars.value
})

const carRequirementsMet = computed(() => {
  if (!carsOk.value) return false
  // Проверяем каждый автомобиль
  for (const car of carDetails.value) {
    if (!car.isSpecial && !car.isTaxi) {
      if (car.power > 250 && currentYear - car.year < 5) {
        return false
      }
    }
  }
  return true
})

const homeRequirementsMet = computed(() => {
  if (!homeAreaOk.value) return false
  if (dachaCount.value > 1) return false
  if (garageCount.value > 2) return false
  if (garageCount.value > 1 && !hasDisabledPerson.value) return false
  return true
})

const otherTransportMet = computed(() => {
  if (motorcycles.value > 1) return false
  if (hasTractor.value && tractorAge.value < 5) return false
  if (hasBoat.value && boatAge.value < 5) return false
  return true
})

const landRequirementsMet = computed(() => landAreaOk.value)

const allRequirementsMet = computed(() => {
  return homeRequirementsMet.value && 
         carRequirementsMet.value && 
         otherTransportMet.value && 
         landRequirementsMet.value
})

// Методы
const incrementCars = () => {
  if (cars.value < 10) {
    cars.value++
    ensureCarDetails()
  }
}

const decrementCars = () => {
  if (cars.value > 0) {
    cars.value--
    carDetails.value = carDetails.value.slice(0, cars.value)
  }
}

const validateCarInput = () => {
  if (cars.value < 0) cars.value = 0
  if (cars.value > 10) cars.value = 10
  ensureCarDetails()
}

const ensureCarDetails = () => {
  while (carDetails.value.length < cars.value) {
    carDetails.value.push({
      power: 0,
      year: currentYear - 6,
      isSpecial: false,
      isTaxi: false
    })
  }
}

// Синхронизация с хранилищем
watch([homes, homeAreaOk], () => {
  store.property.homes = homes.value
  store.property.homeAreaOk = homeAreaOk.value
})

watch([cars, carRequirementsMet], () => {
  store.property.cars = cars.value
  store.property.carSpecOk = carRequirementsMet.value
})

watch(motorcycles, (val) => {
  store.property.hasMotorcycle = val > 0
})

watch(hasBoat, (val) => {
  store.property.hasBoat = val
})

watch(hasGarage, (val) => {
  store.property.hasGarage = val
})

watch(hasDacha, (val) => {
  store.property.hasDacha = val
})

// Инициализация
ensureCarDetails()
</script>

<style scoped>
.property-step {
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
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #495057;
}

.property-item {
  background: white;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.property-item h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
}

.property-item h5 {
  margin-top: 15px;
  margin-bottom: 10px;
  color: #555;
  font-size: 14px;
}

.property-item h6 {
  margin-top: 10px;
  margin-bottom: 10px;
  color: #666;
  font-size: 13px;
  font-weight: 500;
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

.number-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.number-input:focus {
  outline: none;
  border-color: #2196f3;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border: 1px solid #e0e0e0;
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
  position: absolute}
  </style>