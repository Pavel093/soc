<template>
  <div>
    <h2>3. Доходы семьи</h2>
    <label>Ваш доход за год больше или меньше 89 760 руб.?</label>
    <select v-model.number="income.primary">
      <option disabled value="">Выберите</option>
      <option :value="89760 * 1.1">Больше</option>
      <option :value="44880">Меньше</option>
    </select>

    <div v-if="income.primary < 89760">
      <label>Выберите причину:</label>
      <select v-model="income.reason">
        <option value="care">Уход за ребенком до 3 лет</option>
        <option value="unemployed">Безработица (до 6 мес)</option>
        <option value="study">Очное обучение</option>
        <option value="service">Служба/мобилизация</option>
      </select>
    </div>

    <label><input type="checkbox" v-model="income.other" /> Есть другие доходы (алименты, пенсии...)</label>
  </div>
</template>

<script setup>
import { useCalculatorStore } from '../stores/calculatorStore'

const store = useCalculatorStore()
const income = computed({
  get: () => store.income,
  set: val => store.income = val
})
</script>