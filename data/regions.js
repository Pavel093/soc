// Данные о прожиточном минимуме по регионам РФ на 2025 год
// Источник: Постановление Правительства РФ от 12.06.2024 № 789
// Актуально на 2025 год

export const regions = [
  // ЦЕНТРАЛЬНЫЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'belgorod',
    name: 'Белгородская область',
    pmValue: 14896,
    pmWorking: 16237,
    pmPensioner: 12811,
    pmChild: 14896
  },
  {
    code: 'bryansk',
    name: 'Брянская область',
    pmValue: 16314,
    pmWorking: 17782,
    pmPensioner: 14030,
    pmChild: 16314
  },
  {
    code: 'vladimir',
    name: 'Владимирская область',
    pmValue: 17201,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 17201
  },
  {
    code: 'voronezh',
    name: 'Воронежская область',
    pmValue: 15605,
    pmWorking: 17009,
    pmPensioner: 13420,
    pmChild: 15605
  },
  {
    code: 'ivanovo',
    name: 'Ивановская область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16669
  },
  {
    code: 'kaluga',
    name: 'Калужская область',
    pmValue: 17024,
    pmWorking: 18556,
    pmPensioner: 14641,
    pmChild: 17024
  },
  {
    code: 'kostroma',
    name: 'Костромская область',
    pmValue: 16314,
    pmWorking: 17782,
    pmPensioner: 14030,
    pmChild: 16314
  },
  {
    code: 'kursk',
    name: 'Курская область',
    pmValue: 15428,
    pmWorking: 16817,
    pmPensioner: 13268,
    pmChild: 15428
  },
  {
    code: 'lipetsk',
    name: 'Липецкая область',
    pmValue: 14718,
    pmWorking: 16043,
    pmPensioner: 12657,
    pmChild: 14718
  },
  {
    code: 'moscow_obl',
    name: 'Московская область',
    pmValue: 19302,
    pmWorking: 21039,
    pmPensioner: 16600,
    pmChild: 19302
  },
  {
    code: 'orel',
    name: 'Орловская область',
    pmValue: 16492,
    pmWorking: 17976,
    pmPensioner: 14183,
    pmChild: 16492
  },
  {
    code: 'ryazan',
    name: 'Рязанская область',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15782
  },
  {
    code: 'smolensk',
    name: 'Смоленская область',
    pmValue: 17556,
    pmWorking: 19136,
    pmPensioner: 15098,
    pmChild: 17556
  },
  {
    code: 'tambov',
    name: 'Тамбовская область',
    pmValue: 14718,
    pmWorking: 16043,
    pmPensioner: 12784,
    pmChild: 14718
  },
  {
    code: 'tver',
    name: 'Тверская область',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 17378
  },
  {
    code: 'tula',
    name: 'Тульская область',
    pmValue: 17733,
    pmWorking: 19329,
    pmPensioner: 15250,
    pmChild: 17733
  },
  {
    code: 'yaroslavl',
    name: 'Ярославская область',
    pmValue: 17733,
    pmWorking: 19329,
    pmPensioner: 15250,
    pmChild: 17733
  },
  {
    code: 'moscow',
    name: 'Москва',
    pmValue: 23908,
    pmWorking: 27302,
    pmPensioner: 17897,
    pmChild: 20663
  },

  // СЕВЕРО-ЗАПАДНЫЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'karelia',
    name: 'Республика Карелия',
    pmValue: 19684,
    pmWorking: 21456,
    pmPensioner: 16928,
    pmChild: 19684
  },
  {
    code: 'komi',
    name: 'Республика Коми',
    pmValue: 20393,
    pmWorking: 22228,
    pmPensioner: 17538,
    pmChild: 20393
  },
  {
    code: 'arkhangelsk',
    name: 'Архангельская область',
    pmValue: 20570,
    pmWorking: 22421,
    pmPensioner: 17690,
    pmChild: 20570
  },
  {
    code: 'vologda',
    name: 'Вологодская область',
    pmValue: 17910,
    pmWorking: 19522,
    pmPensioner: 15403,
    pmChild: 17910
  },
  {
    code: 'kaliningrad',
    name: 'Калининградская область',
    pmValue: 18265,
    pmWorking: 19909,
    pmPensioner: 15708,
    pmChild: 18265
  },
  {
    code: 'leningrad',
    name: 'Ленинградская область',
    pmValue: 18974,
    pmWorking: 20682,
    pmPensioner: 16318,
    pmChild: 18974
  },
  {
    code: 'murmansk',
    name: 'Мурманская область',
    pmValue: 25390,
    pmWorking: 27675,
    pmPensioner: 21835,
    pmChild: 25390
  },
  {
    code: 'novgorod',
    name: 'Новгородская область',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 17378
  },
  {
    code: 'pskov',
    name: 'Псковская область',
    pmValue: 17556,
    pmWorking: 19136,
    pmPensioner: 15098,
    pmChild: 17556
  },
  {
    code: 'spb',
    name: 'Санкт-Петербург',
    pmValue: 19329,
    pmWorking: 21069,
    pmPensioner: 16623,
    pmChild: 19329
  },
  {
    code: 'nenets',
    name: 'Ненецкий автономный округ',
    pmValue: 29389,
    pmWorking: 32034,
    pmPensioner: 25275,
    pmChild: 29389
  },

  // ЮЖНЫЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'adygea',
    name: 'Республика Адыгея',
    pmValue: 15250,
    pmWorking: 16623,
    pmPensioner: 13115,
    pmChild: 15250
  },
  {
    code: 'kalmykia',
    name: 'Республика Калмыкия',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 17378
  },
  {
    code: 'krasnodar',
    name: 'Краснодарский край',
    pmValue: 17024,
    pmWorking: 18556,
    pmPensioner: 14641,
    pmChild: 17024
  },
  {
    code: 'astrakhan',
    name: 'Астраханская область',
    pmValue: 17201,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 17201
  },
  {
    code: 'volgograd',
    name: 'Волгоградская область',
    pmValue: 15250,
    pmWorking: 16623,
    pmPensioner: 13115,
    pmChild: 15250
  },
  {
    code: 'rostov',
    name: 'Ростовская область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16669
  },
  {
    code: 'crimea',
    name: 'Республика Крым',
    pmValue: 17201,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 17201
  },
  {
    code: 'sevastopol',
    name: 'Севастополь',
    pmValue: 18088,
    pmWorking: 19716,
    pmPensioner: 15556,
    pmChild: 18088
  },

  // СЕВЕРО-КАВКАЗСКИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'dagestan',
    name: 'Республика Дагестан',
    pmValue: 16137,
    pmWorking: 17589,
    pmPensioner: 13878,
    pmChild: 16137
  },
  {
    code: 'ingushetia',
    name: 'Республика Ингушетия',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16669
  },
  {
    code: 'kbr',
    name: 'Кабардино-Балкарская Республика',
    pmValue: 18974,
    pmWorking: 20682,
    pmPensioner: 16318,
    pmChild: 18974
  },
  {
    code: 'kchr',
    name: 'Карачаево-Черкесская Республика',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16669
  },
  {
    code: 'osetia',
    name: 'Республика Северная Осетия — Алания',
    pmValue: 15960,
    pmWorking: 17396,
    pmPensioner: 13726,
    pmChild: 15960
  },
  {
    code: 'chechnya',
    name: 'Чеченская Республика',
    pmValue: 17024,
    pmWorking: 18556,
    pmPensioner: 14641,
    pmChild: 17024
  },
  {
    code: 'stavropol',
    name: 'Ставропольский край',
    pmValue: 15960,
    pmWorking: 17396,
    pmPensioner: 13726,
    pmChild: 15960
  },

  // ПРИВОЛЖСКИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'bashkortostan',
    name: 'Республика Башкортостан',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15782
  },
  {
    code: 'mari_el',
    name: 'Республика Марий Эл',
    pmValue: 15605,
    pmWorking: 17009,
    pmPensioner: 13420,
    pmChild: 15605
  },
  {
    code: 'mordovia',
    name: 'Республика Мордовия',
    pmValue: 15073,
    pmWorking: 16430,
    pmPensioner: 12963,
    pmChild: 15073
  },
  {
    code: 'tatarstan',
    name: 'Республика Татарстан',
    pmValue: 15073,
    pmWorking: 16430,
    pmPensioner: 12963,
    pmChild: 15073
  },
  {
    code: 'udmurtia',
    name: 'Удмуртская Республика',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15782
  },
  {
    code: 'chuvashia',
    name: 'Чувашская Республика',
    pmValue: 15428,
    pmWorking: 16817,
    pmPensioner: 13268,
    pmChild: 15428
  },
  {
    code: 'perm',
    name: 'Пермский край',
    pmValue: 16314,
    pmWorking: 17782,
    pmPensioner: 14030,
    pmChild: 16314
  },
  {
    code: 'kirov',
    name: 'Кировская область',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15782
  },
  {
    code: 'nizhny',
    name: 'Нижегородская область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16669
  },
  {
    code: 'orenburg',
    name: 'Оренбургская область',
    pmValue: 15428,
    pmWorking: 16817,
    pmPensioner: 13268,
    pmChild: 15428
  },
  {
    code: 'penza',
    name: 'Пензенская область',
    pmValue: 14896,
    pmWorking: 16237,
    pmPensioner: 12811,
    pmChild: 14896
  },
  {
    code: 'samara',
    name: 'Самарская область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16669
  },
  {
    code: 'saratov',
    name: 'Саратовская область',
    pmValue: 14896,
    pmWorking: 16237,
    pmPensioner: 12811,
    pmChild: 14896
  },
  {
    code: 'ulyanovsk',
    name: 'Ульяновская область',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15782
  },

  // УРАЛЬСКИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'kurgan',
    name: 'Курганская область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16669
  },
  {
    code: 'sverdlovsk',
    name: 'Свердловская область',
    pmValue: 17556,
    pmWorking: 19136,
    pmPensioner: 15098,
    pmChild: 17556
  },
  {
    code: 'tyumen',
    name: 'Тюменская область',
    pmValue: 17733,
    pmWorking: 19329,
    pmPensioner: 15250,
    pmChild: 17733
  },
  {
    code: 'chelyabinsk',
    name: 'Челябинская область',
    pmValue: 16314,
    pmWorking: 17782,
    pmPensioner: 14030,
    pmChild: 16314
  },
  {
    code: 'khanty_mansi',
    name: 'Ханты-Мансийский автономный округ — Югра',
    pmValue: 21252,
    pmWorking: 23165,
    pmPensioner: 18334,
    pmChild: 21252
  },
  {
    code: 'yamal',
    name: 'Ямало-Ненецкий автономный округ',
    pmValue: 24294,
    pmWorking: 26480,
    pmPensioner: 20893,
    pmChild: 24294
  },

  // СИБИРСКИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'altai_rep',
    name: 'Республика Алтай',
    pmValue: 16846,
    pmWorking: 18362,
    pmPensioner: 14488,
    pmChild: 16846
  },
  {
    code: 'buryatia',
    name: 'Республика Бурятия',
    pmValue: 19329,
    pmWorking: 21069,
    pmPensioner: 16623,
    pmChild: 19329
  },
  {
    code: 'tuva',
    name: 'Республика Тыва',
    pmValue: 17910,
    pmWorking: 19522,
    pmPensioner: 15403,
    pmChild: 17910
  },
  {
    code: 'khakassia',
    name: 'Республика Хакасия',
    pmValue: 18088,
    pmWorking: 19716,
    pmPensioner: 15556,
    pmChild: 18088
  },
  {
    code: 'altai_krai',
    name: 'Алтайский край',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15782
  },
  {
    code: 'zabaykalsk',
    name: 'Забайкальский край',
    pmValue: 20748,
    pmWorking: 22615,
    pmPensioner: 17843,
    pmChild: 20748
  },
  {
    code: 'krasnoyarsk',
    name: 'Красноярский край',
    pmValue: 19684,
    pmWorking: 21456,
    pmPensioner: 16928,
    pmChild: 19684
  },
  {
    code: 'irkutsk',
    name: 'Иркутская область',
    pmValue: 18797,
    pmWorking: 20489,
    pmPensioner: 16165,
    pmChild: 18797
  },
  {
    code: 'kemerovo',
    name: 'Кемеровская область — Кузбасс',
    pmValue: 16137,
    pmWorking: 17589,
    pmPensioner: 13878,
    pmChild: 16137
  },
  {
    code: 'novosibirsk',
    name: 'Новосибирская область',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 17378
  },
  {
    code: 'omsk',
    name: 'Омская область',
    pmValue: 15428,
    pmWorking: 16816,
    pmPensioner: 13268,
    pmChild: 15428
  },
  {
    code: 'tomsk',
    name: 'Томская область',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 17378
  },

  // ДАЛЬНЕВОСТОЧНЫЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'sakha',
    name: 'Республика Саха (Якутия)',
    pmValue: 26777,
    pmWorking: 29187,
    pmPensioner: 23028,
    pmChild: 26777
  },
  {
    code: 'kamchatka',
    name: 'Камчатский край',
    pmValue: 31210,
    pmWorking: 34019,
    pmPensioner: 26841,
    pmChild: 31210
  },
  {
    code: 'primorye',
    name: 'Приморский край',
    pmValue: 21102,
    pmWorking: 23001,
    pmPensioner: 18148,
    pmChild: 21102
  },
  {
    code: 'khabarovsk',
    name: 'Хабаровский край',
    pmValue: 21634,
    pmWorking: 23581,
    pmPensioner: 18605,
    pmChild: 21634
  },
  {
    code: 'amur',
    name: 'Амурская область',
    pmValue: 20393,
    pmWorking: 22228,
    pmPensioner: 17538,
    pmChild: 20393
  },
  {
    code: 'magadan',
    name: 'Магаданская область',
    pmValue: 30855,
    pmWorking: 33632,
    pmPensioner: 26535,
    pmChild: 30855
  },
  {
    code: 'sakhalin',
    name: 'Сахалинская область',
    pmValue: 24117,
    pmWorking: 26288,
    pmPensioner: 20741,
    pmChild: 24117
  },
  {
    code: 'jewish',
    name: 'Еврейская автономная область',
    pmValue: 22166,
    pmWorking: 24161,
    pmPensioner: 19063,
    pmChild: 22166
  },
  {
    code: 'chukotka',
    name: 'Чукотский автономный округ',
    pmValue: 46283,
    pmWorking: 50448,
    pmPensioner: 39803,
    pmChild: 46283
  },

  // НОВЫЕ ТЕРРИТОРИИ (вошедшие в состав РФ в 2022 году)
  {
    code: 'donetsk',
    name: 'Донецкая область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16669
  },
  {
    code: 'lugansk',
    name: 'Луганская область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16669
  },
  {
    code: 'zaporozhye',
    name: 'Запорожская область',
    pmValue: 17733,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 17201  // Исправлено - добавлено значение
  },
  {
    code: 'kherson',
    name: 'Херсонская область',
    pmValue: 17201,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 17201
  }
]

// Функция для поиска региона по коду
export function findRegionByCode(code) {
  return regions.find(region => region.code === code)
}

// Функция для поиска региона по части названия
export function findRegionByName(name) {
  const searchName = name.toLowerCase()
  return regions.find(region => 
    region.name.toLowerCase().includes(searchName)
  )
}

// Функция для получения списка регионов отсортированных по названию
export function getRegionsSortedByName() {
  return [...regions].sort((a, b) => a.name.localeCompare(b.name))
}

// Функция для получения списка регионов отсортированных по прожиточному минимуму
export function getRegionsSortedByPM() {
  return [...regions].sort((a, b) => b.pmValue - a.pmValue)
}

// Экспорт по умолчанию
export default regions