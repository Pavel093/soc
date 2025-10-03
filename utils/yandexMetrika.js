// utils/yandexMetrika.js

export const YM_COUNTER_ID = 104348512;

// Безопасная отправка событий в метрику
export const trackEvent = (eventName, params = {}) => {
  try {
    // Проверяем, что мы на клиенте и метрика загружена
    if (typeof window !== 'undefined' && window.ym) {
      window.ym(YM_COUNTER_ID, 'reachGoal', eventName, params);
      
      // Логирование только в режиме разработки
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.log(`YM Event: ${eventName}`, params);
      }
    }
  } catch (error) {
    console.error('Ошибка отправки события в Яндекс.Метрику:', error);
  }
};

// События калькулятора
export const YM_EVENTS = {
  // Старт калькулятора
  CALCULATOR_START: 'calculator_start',
  
  // Шаги калькулятора
  STEP_VIEW: 'calculator_step_view',
  STEP_COMPLETE: 'calculator_step_complete',
  STEP_BACK: 'calculator_step_back',
  
  // Взаимодействия
  REGION_SELECTED: 'calculator_region_selected',
  RECIPIENT_SELECTED: 'calculator_recipient_selected',
  FAMILY_CONFIGURED: 'calculator_family_configured',
  INCOME_ENTERED: 'calculator_income_entered',
  TRANSPORT_CONFIGURED: 'calculator_transport_configured',
  PROPERTY_CONFIGURED: 'calculator_property_configured',
  CONDITIONS_CONFIGURED: 'calculator_conditions_configured',
  
  // Результаты
  CALCULATION_COMPLETE: 'calculator_complete',
  RESULT_ELIGIBLE: 'calculator_result_eligible',
  RESULT_NOT_ELIGIBLE: 'calculator_result_not_eligible',
  
  // Действия с результатами
  RESULT_PRINT: 'calculator_result_print',
  RESULT_DOWNLOAD: 'calculator_result_download',
  RESULT_COPY: 'calculator_result_copy',
  RESULT_RECALCULATE: 'calculator_recalculate',
  
  // Ошибки и отказы
  CALCULATOR_ABANDON: 'calculator_abandon',
  CALCULATOR_ERROR: 'calculator_error',
  
  // Сохранение прогресса
  PROGRESS_SAVED: 'calculator_progress_saved',
  PROGRESS_RESTORED: 'calculator_progress_restored'
};

// Получить название шага
export const getStepName = (questionIndex, questions) => {
  const stepNames = {
    'region': '1_region',
    'recipient': '2_recipient',
    'family': '3_family',
    'income': '4_income',
    'transport': '5_transport',
    'property': '6_property',
    'conditions': '7_conditions'
  };
  
  return stepNames[questions[questionIndex]] || `step_${questionIndex}`;
};

// Отслеживание времени на шаге
export class StepTimer {
  constructor() {
    this.stepStartTime = null;
    this.currentStep = null;
  }
  
  startStep(stepName) {
    // Если был предыдущий шаг, отправляем время
    if (this.currentStep && this.stepStartTime) {
      const duration = Math.round((Date.now() - this.stepStartTime) / 1000);
      trackEvent('calculator_step_duration', {
        step: this.currentStep,
        duration_seconds: duration
      });
    }
    
    this.currentStep = stepName;
    this.stepStartTime = Date.now();
  }
  
  endTimer() {
    if (this.currentStep && this.stepStartTime) {
      const duration = Math.round((Date.now() - this.stepStartTime) / 1000);
      trackEvent('calculator_step_duration', {
        step: this.currentStep,
        duration_seconds: duration
      });
    }
    this.currentStep = null;
    this.stepStartTime = null;
  }
}
