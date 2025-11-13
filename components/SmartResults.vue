<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import html2canvas from 'html2canvas'

import babyCardImage from '@/assets/edinoe-posobie/baby.png'

const props = defineProps({
  calculationData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['recalculate'])

const data = computed(() => props.calculationData)
const resultsContainer = ref(null)
const isGeneratingImage = ref(false)
const isMobile = ref(false)
const promoSection = ref(null)

// Ссылка для детской карты
const juniorCardUrl = 'https://t-cpa.ru/2APo0z'

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const createPromoElement = () => {
  if (!promoSection.value) return

  const container = promoSection.value
  container.innerHTML = ''

  // Создание баннера на всю ширину
  const bannerWrapper = document.createElement('div')
  bannerWrapper.style.cssText = 'text-align:center;width:100%'
  
  const link = document.createElement('a')
  link.href = juniorCardUrl
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.style.cssText = 'display:block;text-decoration:none;transition:opacity 0.3s ease;width:100%;margin-bottom:15px'
  
  const img = document.createElement('img')
  img.src = babyCardImage
  img.alt = 'Детская карта Джуниор'
  img.style.cssText = 'width:100%;height:auto;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,0.1);transition:transform 0.3s ease,box-shadow 0.3s ease;display:block'
  img.loading = 'lazy'
  
  link.appendChild(img)
  bannerWrapper.appendChild(link)

  // Создание кнопки "Оформить"
  const buttonLink = document.createElement('a')
  buttonLink.href = juniorCardUrl
  buttonLink.target = '_blank'
  buttonLink.rel = 'noopener noreferrer'
  buttonLink.style.cssText = 'display:inline-block;text-decoration:none;margin-bottom:10px;width:100%;'
  
  const button = document.createElement('button')
  button.textContent = 'Оформить'
  button.style.cssText = 'background:#008CFF;color:white;border:none;padding:12px 30px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.3s ease;width:100%;height:50px'
  
  buttonLink.appendChild(button)
  bannerWrapper.appendChild(buttonLink)

  // Создание текста под кнопкой
  const text = document.createElement('p')
  text.textContent = '0 ₽ за оформление и обслуживание навсегда.'
  text.style.cssText = 'font-size:14px;color:#6F767E;margin:0;font-weight:500'
  
  bannerWrapper.appendChild(text)
  container.appendChild(bannerWrapper)

  // Hover эффекты для баннера
  link.addEventListener('mouseenter', () => {
    link.style.opacity = '0.95'
    img.style.transform = 'translateY(-2px)'
    img.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)'
  })
  
  link.addEventListener('mouseleave', () => {
    link.style.opacity = '1'
    img.style.transform = 'translateY(0)'
    img.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
  })

  // Hover эффекты для кнопки
  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#D489C0'
    button.style.transform = 'translateY(-1px)'
  })
  
  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#EA9AD0'
    button.style.transform = 'translateY(0)'
  })
}

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  await nextTick()
  setTimeout(() => {
    createPromoElement()
  }, 150)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Остальной код остается без изменений...
const hasPropertyIssues = computed(() => {
  const check = data.value.formData.propertyCheck
  if (!check) return false
  return check.hasMultipleApartments || check.hasMultipleCars || 
         check.hasLuxuryCar || check.hasHighSavings
})

const hasSpecialCircumstances = computed(() => {
  const special = data.value.formData.special
  if (!special) return false
  return special.singleParent || special.hasDisabled || special.mobilized
})

const needsZeroIncomeRule = computed(() => {
  return data.value.calculations.incomePercent < 30
})

const formatAmount = (amount) => {
  return new Intl.NumberFormat('ru-RU').format(amount)
}

const getChildrenWord = (count) => {
  if (count === 1) return 'ребенка'
  if (count >= 2 && count <= 4) return 'детей'
  return 'детей'
}

const getIncomeClass = () => {
  const percent = data.value.calculations.incomePercent
  if (percent <= 100) return 'success'
  return 'warning'
}

const recalculate = () => {
  emit('recalculate')
}

const printResults = () => {
  const printWindow = window.open('', '_blank')
  const resultsHTML = resultsContainer.value.innerHTML
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Результаты расчета единого пособия</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 20px;
          color: #1A1D1F;
        }
        
        .result-card {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
        }
        
        .result-card.success {
          border-top: 4px solid #00B93E;
        }
        
        .result-card.neutral {
          border-top: 4px solid #FFA726;
        }
        
        .result-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .result-title {
          font-size: 24px;
          font-weight: 600;
          margin-top: 20px;
        }
        
        .benefit-amount {
          text-align: center;
          padding: 20px;
          background: #f0fff4;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        
        .amount-value {
          font-size: 32px;
          font-weight: 700;
          color: #00B93E;
        }
        
        .consideration-notes {
          padding: 20px;
          background: #fff3e0;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 20px 0;
        }
        
        .income-summary-card, .property-summary-card, .special-card {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .next-steps, .recommendations {
          background: #e3f2fd;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .info-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        
        .info-card {
          padding: 15px;
          background: #fafbfc;
          border-radius: 8px;
        }
        
        .actions, .action-panel {
          display: none !important;
        }
        
        .promo-block {
          display: none !important;
        }
        
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-content">
        ${resultsHTML}
      </div>
    </body>
    </html>
  `
  
  printWindow.document.write(printContent)
  printWindow.document.close()
  
  printWindow.onload = function() {
    printWindow.print()
    printWindow.onafterprint = function() {
      printWindow.close()
    }
  }
}

const downloadAsImage = async () => {
  if (!resultsContainer.value) return
  
  isGeneratingImage.value = true
  
  try {
    await nextTick()
    
    const actionPanel = document.querySelector('.action-panel')
    const actions = document.querySelector('.actions')
    const promo = promoSection.value
    
    if (actionPanel) actionPanel.style.display = 'none'
    if (actions) actions.style.display = 'none'
    if (promo) promo.style.display = 'none'
    
    const canvas = await html2canvas(resultsContainer.value, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      windowWidth: resultsContainer.value.scrollWidth,
      windowHeight: resultsContainer.value.scrollHeight
    })
    
    if (actionPanel) actionPanel.style.display = ''
    if (actions) actions.style.display = ''
    if (promo) promo.style.display = ''
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')
      link.download = `edinoe-posobie-${date}.jpg`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    }, 'image/jpeg', 0.95)
    
  } catch (error) {
    console.error('Ошибка при создании изображения:', error)
    alert('Не удалось создать изображение. Попробуйте еще раз.')
  } finally {
    isGeneratingImage.value = false
  }
}

const copyToClipboard = async () => {
  let textToCopy = ''
  
  if (data.value.isEligible) {
    textToCopy = `✅ Вам положено единое пособие!\n\n`
    textToCopy += `💰 Размер пособия: ${formatAmount(data.value.benefitAmount)} ₽ в месяц\n\n`
    
    if (data.value.benefitDetails?.length > 0) {
      textToCopy += `Детализация:\n`
      data.value.benefitDetails.forEach(detail => {
        if (detail.type === 'children') {
          textToCopy += `• На ${detail.count} детей: ${formatAmount(detail.total)} ₽ (${detail.percent}% от ПМ)\n`
        } else if (detail.type === 'pregnancy') {
          textToCopy += `• Пособие беременной: ${formatAmount(detail.amount)} ₽ (${detail.percent}% от ПМ)\n`
        }
      })
    }
  } else {
    textToCopy = `ℹ️ По текущим условиям пособие не предусмотрено\n\n`
    textToCopy += `Что повлияло на решение:\n`
    data.value.denialReasons?.forEach(reason => {
      textToCopy += `• ${reason}\n`
    })
  }
  
  try {
    await navigator.clipboard.writeText(textToCopy)
    alert('Результат скопирован в буфер обмена!')
  } catch (err) {
    console.error('Ошибка копирования:', err)
  }
}
</script>

<template>
  <div class="results-wrapper">
    <div class="action-panel">
      <button @click="recalculate" class="action-btn recalculate-btn">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 10C2 14.418 5.582 18 10 18C12.15 18 14.078 17.086 15.47 15.63L14 14.16C12.97 15.19 11.57 15.82 10 15.82C6.69 15.82 4 13.14 4 9.82C4 6.5 6.69 3.82 10 3.82C11.58 3.82 12.96 4.44 14 5.48L12 7.48H18V1.48L15.47 4.01C14.08 2.56 12.15 1.64 10 1.64C5.582 1.64 2 5.222 2 9.64V10Z" fill="currentColor"/>
        </svg>
        Пересчитать
      </button>
      
      <button @click="printResults" class="action-btn print-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/>
        </svg>
        Печать
      </button>
      
      <button @click="downloadAsImage" class="action-btn download-btn" :disabled="isGeneratingImage">
        <svg v-if="!isGeneratingImage" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        <span v-if="isGeneratingImage" class="spinner"></span>
        {{ isGeneratingImage ? 'Создание...' : 'Скачать JPG' }}
      </button>
      
      <button @click="copyToClipboard" class="action-btn copy-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
        </svg>
        Копировать
      </button>
    </div>

    <div class="results-container" ref="resultsContainer">
      <div class="result-card" :class="data.isEligible ? 'success' : 'neutral'">
        <div class="result-header">
          <div class="result-icon">
            <svg v-if="data.isEligible" width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="30" fill="#00B93E" fill-opacity="0.1"/>
              <path d="M20 30L26 36L40 22" stroke="#00B93E" stroke-width="3" stroke-linecap="round"/>
            </svg>
            <svg v-else width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="30" fill="#FFA726" fill-opacity="0.1"/>
              <path d="M30 25V30M30 35H30.01" stroke="#FFA726" stroke-width="3" stroke-linecap="round"/>
              <circle cx="30" cy="30" r="14" fill="#FFA726" fill-opacity="0.1"/>
            </svg>
          </div>
          <h2 class="result-title dark-text">
            {{ data.isEligible ? 'Вам положено единое пособие!' : 'По текущим условиям пособие не предусмотрено' }}
          </h2>
          <p v-if="!data.isEligible" class="result-subtitle light-text">
            Это не окончательный отказ - вы можете пересмотреть условия и подать заявление позже
          </p>
        </div>

        <div v-if="data.isEligible" class="benefit-amount">
          <p class="amount-label light-text">Размер ежемесячного пособия:</p>
          <p class="amount-value dark-text">{{ formatAmount(data.benefitAmount) }} ₽</p>
          
          <div class="benefit-breakdown" v-if="data.benefitDetails && data.benefitDetails.length">
            <div v-for="detail in data.benefitDetails" :key="detail.type" class="breakdown-item">
              <span v-if="detail.type === 'children'" class="breakdown-text">
                На {{ detail.count }} {{ getChildrenWord(detail.count) }}: 
                {{ formatAmount(detail.amountPerChild) }} ₽ × {{ detail.count }} = 
                <strong>{{ formatAmount(detail.total) }} ₽</strong>
                <span class="percent-badge">{{ detail.percent }}% от ПМ</span>
              </span>
              <span v-if="detail.type === 'pregnancy'" class="breakdown-text">
                Пособие беременной: 
                <strong>{{ formatAmount(detail.amount) }} ₽</strong>
                <span class="percent-badge">{{ detail.percent }}% от ПМ</span>
              </span>
            </div>
          </div>
        </div>

        <div class="promo-block" ref="promoSection"></div>

        <div v-if="!data.isEligible" class="consideration-notes">
          <div class="notes-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 9V11M12 15H12.01M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="#FFA726" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h3 class="notes-title">Что повлияло на решение:</h3>
          </div>
          <ul class="notes-list">
            <li v-for="(reason, index) in data.denialReasons" :key="index" class="note-item">
              <span class="note-bullet">•</span>
              {{ reason }}
            </li>
          </ul>
        </div>

        <div class="summary-section">
          <h3 class="summary-title dark-text">Детали расчета:</h3>
          
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label light-text">Регион:</span>
              <span class="summary-value dark-text">{{ data.regionData.name }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label light-text">Прожиточный минимум:</span>
              <span class="summary-value dark-text">{{ formatAmount(data.regionData.pmValue) }} ₽</span>
            </div>
            <div class="summary-item">
              <span class="summary-label light-text">Состав семьи:</span>
              <span class="summary-value dark-text">{{ data.calculations.totalFamilyMembers }} чел.</span>
            </div>
            <div class="summary-item" v-if="data.calculations.totalChildren > 0">
              <span class="summary-label light-text">Детей до 17 лет:</span>
              <span class="summary-value dark-text">{{ data.calculations.totalChildren }}</span>
            </div>
          </div>

          <div class="income-summary-card">
            <h4 class="card-title">Доходы семьи</h4>
            <div class="income-details">
              <div class="income-row">
                <span class="label">Общий доход за год:</span>
                <span class="value">{{ formatAmount(data.calculations.totalYearlyIncome) }} ₽</span>
              </div>
              <div class="income-row">
                <span class="label">Среднедушевой доход в месяц:</span>
                <span class="value" :class="getIncomeClass()">
                  {{ formatAmount(data.calculations.averageMonthlyIncome) }} ₽
                </span>
              </div>
              <div class="income-row">
                <span class="label">% от прожиточного минимума:</span>
                <span class="value" :class="getIncomeClass()">
                  {{ data.calculations.incomePercent }}%
                </span>
              </div>
            </div>
          </div>

          <div v-if="hasPropertyIssues" class="property-summary-card">
            <h4 class="card-title">🏠 Имущественные условия</h4>
            <div class="property-list">
              <div v-if="data.formData.propertyCheck?.hasMultipleApartments" class="property-row">
                <span>• Более одной квартиры</span>
              </div>
              <div v-if="data.formData.propertyCheck?.hasMultipleCars" class="property-row">
                <span>• Более одного автомобиля</span>
              </div>
              <div v-if="data.formData.propertyCheck?.hasLuxuryCar" class="property-row">
                <span>• Автомобиль премиум-класса</span>
              </div>
              <div v-if="data.formData.propertyCheck?.hasHighSavings" class="property-row">
                <span>• Высокие сбережения</span>
              </div>
            </div>
          </div>

          <div v-if="hasSpecialCircumstances" class="special-card">
            <h4 class="card-title">Особые обстоятельства</h4>
            <ul class="special-list">
              <li v-if="data.formData.special?.singleParent">Единственный родитель</li>
              <li v-if="data.formData.special?.hasDisabled">В семье есть инвалид</li>
              <li v-if="data.formData.special?.mobilized">Член семьи мобилизован</li>
            </ul>
          </div>
        </div>

        <div v-if="data.isEligible" class="next-steps">
          <h3 class="steps-title dark-text">Что делать дальше?</h3>
          <ol class="steps-list">
            <li>
              <strong>Подайте заявление</strong> через портал Госуслуг или в МФЦ
            </li>
            <li>
              <strong>Приложите документы:</strong>
              <ul>
                <li>Паспорт</li>
                <li>Свидетельства о рождении детей</li>
                <li>Справки о доходах за 12 месяцев</li>
                <li v-if="data.formData.recipientType === 'pregnant' || data.formData.recipientType === 'both'">
                  Справка о постановке на учет по беременности
                </li>
                <li v-if="data.formData.special?.hasDisabled">Документы об инвалидности</li>
                <li v-if="data.formData.special?.mobilized">Документы о мобилизации</li>
              </ul>
            </li>
            <li>
              <strong>Дождитесь решения</strong> (до 10 рабочих дней, максимум 30 дней)
            </li>
            <li>
              <strong>Получайте выплаты</strong> ежемесячно на карту "Мир" или почтовым переводом
            </li>
          </ol>
        </div>

        <div v-else class="recommendations">
          <h3 class="steps-title dark-text">Возможные пути решения:</h3>
          <div class="recommendations-grid">
            <div v-if="data.calculations.incomePercent > 100" class="recommendation-card">
              <div class="rec-icon">💡</div>
              <div class="rec-content">
                <h4>Проверьте другие пособия</h4>
                <p>Вы можете иметь право на региональные выплаты и поддержку</p>
              </div>
            </div>
            
            <div v-if="hasPropertyIssues" class="recommendation-card">
              <div class="rec-icon">🏠</div>
              <div class="rec-content">
                <h4>Уточните имущественные условия</h4>
                <p>Некоторые виды имущества не учитываются при особых обстоятельствах</p>
              </div>
            </div>
            
            <div v-if="!data.formData.hasValidReason && needsZeroIncomeRule" class="recommendation-card">
              <div class="rec-icon">💼</div>
              <div class="rec-content">
                <h4>Рассмотрите трудоустройство</h4>
                <p>Официальная работа или постановка на учет в центре занятости</p>
              </div>
            </div>
            
            <div class="recommendation-card">
              <div class="rec-icon">🔄</div>
              <div class="rec-content">
                <h4>Подайте заявление позже</h4>
                <p>При изменении обстоятельств вы сможете получить пособие</p>
              </div>
            </div>
          </div>
        </div>

        <div class="info-cards">
          <div class="info-card">
            <h4>📅 Период выплат</h4>
            <p>Пособие назначается на 12 месяцев. Затем нужно подать новое заявление.</p>
          </div>
          
          <div class="info-card">
            <h4>💳 Способы получения</h4>
            <p>На карту "Мир", почтовым переводом или на счет в банке.</p>
          </div>
          
          <div class="info-card">
            <h4>📞 Горячая линия</h4>
            <p>Единый контакт-центр: <strong>8-800-2000-412</strong> (звонок бесплатный)</p>
          </div>
          
          <div class="info-card">
            <h4>🏢 Куда обращаться</h4>
            <p>МФЦ, Социальный фонд России или портал Госуслуг</p>
          </div>
        </div>

        <div class="actions">
          <button @click="recalculate" class="action-button secondary">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 10C2 14.418 5.582 18 10 18C12.15 18 14.078 17.086 15.47 15.63L14 14.16C12.97 15.19 11.57 15.82 10 15.82C6.69 15.82 4 13.14 4 9.82C4 6.5 6.69 3.82 10 3.82C11.58 3.82 12.96 4.44 14 5.48L12 7.48H18V1.48L15.47 4.01C14.08 2.56 12.15 1.64 10 1.64C5.582 1.64 2 5.222 2 9.64V10Z" fill="#008CFF"/>
            </svg>
            Пересчитать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.results-wrapper {
  width: 100%;
}

.action-panel {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: white;
  color: #1E293B;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F8FAFC;
    border-color: #CBD5E1;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    flex-shrink: 0;
  }
}

.recalculate-btn {
  background-color: #008CFF;
  color: white;
  border-color: #008CFF;
  
  &:hover {
    background-color: #0070d2;
    border-color: #0070d2;
    color: white;
  }
}

.print-btn:hover {
  border-color: #4361EE;
  color: #4361EE;
  background: #F0F5FF;
}

.download-btn:hover {
  border-color: #10B981;
  color: #10B981;
  background: #ECFDF5;
}

.copy-btn:hover {
  border-color: #8B5CF6;
  color: #8B5CF6;
  background: #FAF5FF;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #E2E8F0;
  border-top-color: #4361EE;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.results-container {
  width: 100%;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  &.success {
    border-top: 4px solid #00B93E;
  }
  
  &.neutral {
    border-top: 4px solid #FFA726;
  }
}

.result-header {
  text-align: center;
  margin-bottom: 30px;
  
  .result-icon {
    margin-bottom: 20px;
  }
  
  .result-title {
    font-size: 28px;
    font-weight: 600;
    margin: 0;
  }
  
  .result-subtitle {
    font-size: 16px;
    margin-top: 10px;
    opacity: 0.8;
    line-height: 1.4;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
}

.benefit-amount {
  text-align: center;
  padding: 25px;
  background: linear-gradient(135deg, #00B93E10, #00B93E05);
  border-radius: 12px;
  margin-bottom: 30px;
  
  .amount-label {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .amount-value {
    font-size: 36px;
    font-weight: 700;
    color: #00B93E;
    margin: 0;
  }
}

.benefit-breakdown {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #00B93E20;
  
  .breakdown-item {
    margin-bottom: 10px;
    font-size: 14px;
    
    .breakdown-text {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    strong {
      color: #00B93E;
      font-weight: 600;
    }
    
    .percent-badge {
      background: #00B93E20;
      color: #00B93E;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
  }
}

.promo-block {
  margin: 30px 0;
  text-align: center;
  position: relative;
  min-height: 50px;
  
  a {
    display: block;
    width: 100%;
  }
  
  img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
}

.consideration-notes {
  padding: 25px;
  background: linear-gradient(135deg, #FFF3E0, #FFECB3);
  border-radius: 12px;
  margin-bottom: 30px;
  border: 1px solid #FFE0B2;
  
  .notes-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    
    .notes-title {
      font-size: 18px;
      font-weight: 600;
      color: #E65100;
      margin: 0;
    }
    
    svg {
      flex-shrink: 0;
    }
  }
  
  .notes-list {
    list-style: none;
    padding: 0;
    margin: 0;
    
    .note-item {
      padding: 12px 0;
      padding-left: 8px;
      color: #5D4037;
      line-height: 1.5;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      
      .note-bullet {
        color: #FFA726;
        font-weight: bold;
        font-size: 18px;
        flex-shrink: 0;
        margin-top: 1px;
      }
    }
  }
}

.summary-section {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #e0e0e0;
  
  .summary-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
  
  .summary-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    
    .summary-label {
      font-size: 14px;
    }
    
    .summary-value {
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.income-summary-card,
.property-summary-card,
.special-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #2C3E50;
  }
}

.income-details {
  .income-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    
    .value {
      font-weight: 600;
      
      &.success { color: #00B93E; }
      &.warning { color: #FFA726; }
    }
  }
}

.property-list {
  .property-row {
    padding: 8px 0;
    color: #5D4037;
  }
}

.special-list {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    padding: 8px 0;
    padding-left: 20px;
    position: relative;
    
    &:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #008CFF;
    }
  }
}

.next-steps,
.recommendations {
  background: #e3f2fd;
  border-radius: 12px;
  padding: 25px;
  margin: 30px 0;
  
  .steps-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .steps-list {
    padding-left: 20px;
    
    > li {
      margin-bottom: 15px;
      
      strong {
        color: #1976d2;
      }
      
      ul {
        margin-top: 10px;
        padding-left: 20px;
        
        li {
          margin-bottom: 5px;
        }
      }
    }
  }
}

.recommendations {
  background: #fff3e0;
  
  .steps-title {
    color: #E65100;
  }
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.recommendation-card {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #FFA726;
  }
  
  .rec-icon {
    font-size: 24px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .rec-content {
    flex: 1;
    
    h4 {
      font-size: 16px;
      font-weight: 600;
      color: #1A1D1F;
      margin-bottom: 8px;
    }
    
    p {
      font-size: 14px;
      color: #6F767E;
      margin: 0;
      line-height: 1.4;
    }
  }
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 30px 0;
  
  .info-card {
    padding: 20px;
    background: #fafbfc;
    border-radius: 10px;
    
    h4 {
      font-size: 16px;
      margin-bottom: 10px;
      color: #2C3E50;
    }
    
    p {
      font-size: 14px;
      margin: 0;
      color: #7d838b;
      
      strong {
        color: #008CFF;
      }
    }
  }
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 30px;
  
  .action-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    
    &.primary {
      background: #008CFF;
      color: white;
      
      &:hover {
        background: #0070d2;
      }
    }
    
    &.secondary {
      background: white;
      color: #008CFF;
      border: 2px solid #008CFF;
      
      &:hover {
        background: #008CFF10;
      }
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media print {
  .action-panel,
  .actions {
    display: none !important;
  }
  
  .promo-block {
    display: none !important;
  }
  
  .results-wrapper {
    padding: 0;
  }
  
  .result-card {
    box-shadow: none;
    border: 1px solid #e0e0e0;
    page-break-inside: avoid;
  }
  
  .info-cards {
    page-break-inside: avoid;
  }
  
  .next-steps,
  .recommendations {
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .action-panel {
    justify-content: stretch;
    
    .action-btn {
      flex: 1;
      min-width: 0;
      padding: 0.6rem 0.75rem;
      font-size: 0.85rem;
      justify-content: center;
      
      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
  
  .result-card {
    padding: 20px;
  }
  
  .result-title {
    font-size: 22px !important;
  }
  
  .result-subtitle {
    font-size: 14px;
  }
  
  .amount-value {
    font-size: 28px !important;
  }
  
  .promo-block {
    margin: 20px 0;
  }
  
  .consideration-notes {
    padding: 20px;
    
    .notes-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      
      .notes-title {
        font-size: 16px;
      }
    }
  }
  
  .actions {
    flex-direction: column;
    
    .action-button {
      width: 100%;
    }
  }
  
  .info-cards {
    grid-template-columns: 1fr;
    gap: 10px;
    
    .info-card {
      padding: 15px;
    }
  }
  
  .next-steps,
  .recommendations {
    padding: 20px;
    margin: 20px 0;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .recommendation-card {
    padding: 15px;
    
    .rec-icon {
      font-size: 20px;
    }
  }
}

@media (max-width: 480px) {
  .action-panel {
    flex-direction: column;
    
    .action-btn {
      width: 100%;
    }
  }
  
  .result-header {
    margin-bottom: 20px;
    
    .result-icon svg {
      width: 50px;
      height: 50px;
    }
    
    .result-title {
      font-size: 20px !important;
    }
  }
  
  .benefit-amount {
    padding: 20px;
    
    .amount-label {
      font-size: 14px;
    }
    
    .amount-value {
      font-size: 24px !important;
    }
  }
  
  .benefit-breakdown {
    .breakdown-item {
      font-size: 12px;
      
      .percent-badge {
        font-size: 11px;
        padding: 2px 6px;
      }
    }
  }
  
  .recommendation-card {
    flex-direction: column;
    text-align: center;
    gap: 10px;
    
    .rec-icon {
      align-self: center;
    }
  }
}

.result-card.neutral .result-icon circle {
  fill: #FFA726;
  fill-opacity: 0.1;
}

.result-card.neutral .result-icon path {
  stroke: #FFA726;
}

.dark-text {
  color: #1A1D1F;
}

.light-text {
  color: #6F767E;
}
</style>