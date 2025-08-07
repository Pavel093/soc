Вот стилизованный второй компонент с такой же стилизацией выпадающих списков как в первом:

```vue
<template>
  <div class="income-step">
    <h2 class="step-title dark-text">3. Доходы семьи</h2>
    <div class="base-option">
      <label class="field-label light-text">Ваш доход за год больше или меньше 89 760 руб.?</label>
      <div class="select-wrapper">
        <select v-model.number="income.primary" class="region-select">
          <option disabled value="">Выберите</option>
          <option :value="89760 * 1.1">Больше</option>
          <option :value="44880">Меньше</option>
        </select>
      </div>
    </div>

    <div v-if="income.primary < 89760" class="base-option">
      <label class="field-label light-text">Выберите причину:</label>
      <div class="select-wrapper">
        <select v-model="income.reason" class="region-select">
          <option disabled value="">Выберите причину</option>
          <option value="care">Уход за ребенком до 3 лет</option>
          <option value="unemployed">Безработица (до 6 мес)</option>
          <option value="study">Очное обучение</option>
          <option value="service">Служба/мобилизация</option>
        </select>
      </div>
    </div>

    <div class="base-option">
      <label class="checkbox-label light-text">
        <input type="checkbox" v-model="income.other" class="checkbox-input" />
        <span class="checkbox-text">Есть другие доходы (алименты, пенсии...)</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCalculatorStore } from '../stores/calculatorStore'

const store = useCalculatorStore()
const income = computed({
  get: () => store.income,
  set: val => store.income = val
})
</script>

<style scoped lang="scss">
.income-step {
  margin-bottom: 20px;

  h2 {
    position: absolute;
    top: 15px;
    left: calc(15px + 69px + 15px);
    font-weight: 300;
    font-size: 25px;
    max-width: 90%;
    letter-spacing: 1.02px;
    line-height: 0.9;
  }

  .base-option {
    margin-top: 5%;
    margin-bottom: 20px;
  }
}

.step-title {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
}

.field-label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 400;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
}

.checkbox-input {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-text {
  line-height: 1.4;
}

/* Для мобильных safari */
.region-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>