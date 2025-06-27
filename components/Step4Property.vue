<template>
  <div>
    <h2>4. Имущественные условия</h2>
    <label>Количество квартир/домов:</label>
    <select v-model.number="property.homes">
      <option :value="1">1</option>
      <option :value="2">более 1</option>
    </select>

    <div v-if="property.homes > 1">
      <label><input type="checkbox" v-model="property.homeAreaOk" /> Общая площадь на человека ≤24 м²</label>
    </div>

    <label>Автомобили:</label>
    <select v-model.number="property.cars">
      <option :value="0">нет</option>
      <option :value="1">1</option>
      <option :value="2">более 1</option>
    </select>

    <div v-if="property.cars === 1">
      <label><input type="checkbox" v-model="property.carSpecOk" /> Мощность ≤250 л.с., возраст старше 5 лет</label>
    </div>
  </div>
</template>

<script setup>
import { useCalculatorStore } from '../stores/calculatorStore'

const store = useCalculatorStore()
const property = computed({
  get: () => store.property,
  set: val => store.property = val
})
</script>