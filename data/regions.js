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
    pmChild: 14449
  },
  {
    code: 'bryansk',
    name: 'Брянская область',
    pmValue: 16314,
    pmWorking: 17782,
    pmPensioner: 14030,
    pmChild: 15825
  },
  {
    code: 'vladimir',
    name: 'Владимирская область',
    pmValue: 17201,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 16685
  },
  {
    code: 'voronezh',
    name: 'Воронежская область',
    pmValue: 15605,
    pmWorking: 17009,
    pmPensioner: 13420,
    pmChild: 15137
  },
  {
    code: 'ivanovo',
    name: 'Ивановская область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'kaluga',
    name: 'Калужская область',
    pmValue: 17024,
    pmWorking: 18556,
    pmPensioner: 14641,
    pmChild: 16513
  },
  {
    code: 'kostroma',
    name: 'Костромская область',
    pmValue: 16314,
    pmWorking: 17782,
    pmPensioner: 14030,
    pmChild: 15825
  },
  {
    code: 'kursk',
    name: 'Курская область',
    pmValue: 15428,
    pmWorking: 16817,
    pmPensioner: 13268,
    pmChild: 14965
  },
  {
    code: 'lipetsk',
    name: 'Липецкая область',
    pmValue: 14718,
    pmWorking: 16043,
    pmPensioner: 12657,
    pmChild: 14276
  },
  {
    code: 'moscow_obl',
    name: 'Московская область',
    pmValue: 19302,
    pmWorking: 21039,
    pmPensioner: 16600,
    pmChild: 18723
  },
  {
    code: 'orel',
    name: 'Орловская область',
    pmValue: 16492,
    pmWorking: 17976,
    pmPensioner: 14183,
    pmChild: 15997
  },
  {
    code: 'ryazan',
    name: 'Рязанская область',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15309
  },
  {
    code: 'smolensk',
    name: 'Смоленская область',
    pmValue: 17556,
    pmWorking: 19136,
    pmPensioner: 15098,
    pmChild: 17029
  },
  {
    code: 'tambov',
    name: 'Тамбовская область',
    pmValue: 14718,
    pmWorking: 16043,
    pmPensioner: 12784,
    pmChild: 14276
  },
  {
    code: 'tver',
    name: 'Тверская область',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 16857
  },
  {
    code: 'tula',
    name: 'Тульская область',
    pmValue: 17733,
    pmWorking: 19329,
    pmPensioner: 15250,
    pmChild: 17201
  },
  {
    code: 'yaroslavl',
    name: 'Ярославская область',
    pmValue: 17733,
    pmWorking: 19329,
    pmPensioner: 15250,
    pmChild: 17201
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
    pmChild: 19093
  },
  {
    code: 'komi',
    name: 'Республика Коми',
    pmValue: 20393,
    pmWorking: 22228,
    pmPensioner: 17538,
    pmChild: 19781
  },
  {
    code: 'arkhangelsk',
    name: 'Архангельская область',
    pmValue: 20570,
    pmWorking: 22421,
    pmPensioner: 17690,
    pmChild: 19953
  },
  {
    code: 'vologda',
    name: 'Вологодская область',
    pmValue: 17910,
    pmWorking: 19522,
    pmPensioner: 15403,
    pmChild: 17373
  },
  {
    code: 'kaliningrad',
    name: 'Калининградская область',
    pmValue: 18265,
    pmWorking: 19909,
    pmPensioner: 15708,
    pmChild: 17717
  },
  {
    code: 'leningrad',
    name: 'Ленинградская область',
    pmValue: 18974,
    pmWorking: 20682,
    pmPensioner: 16318,
    pmChild: 18405
  },
  {
    code: 'murmansk',
    name: 'Мурманская область',
    pmValue: 25390,
    pmWorking: 27675,
    pmPensioner: 21835,
    pmChild: 24628
  },
  {
    code: 'novgorod',
    name: 'Новгородская область',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 16857
  },
  {
    code: 'pskov',
    name: 'Псковская область',
    pmValue: 17556,
    pmWorking: 19136,
    pmPensioner: 15098,
    pmChild: 17029
  },
  {
    code: 'spb',
    name: 'Санкт-Петербург',
    pmValue: 19329,
    pmWorking: 21069,
    pmPensioner: 16623,
    pmChild: 18749
  },
  {
    code: 'nenets',
    name: 'Ненецкий автономный округ',
    pmValue: 29389,
    pmWorking: 32034,
    pmPensioner: 25275,
    pmChild: 30706
  },

  // ЮЖНЫЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'adygea',
    name: 'Республика Адыгея',
    pmValue: 15250,
    pmWorking: 16623,
    pmPensioner: 13115,
    pmChild: 14793
  },
  {
    code: 'kalmykia',
    name: 'Республика Калмыкия',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 16857
  },
  {
    code: 'krasnodar',
    name: 'Краснодарский край',
    pmValue: 17024,
    pmWorking: 18556,
    pmPensioner: 14641,
    pmChild: 16513
  },
  {
    code: 'astrakhan',
    name: 'Астраханская область',
    pmValue: 17201,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 16685
  },
  {
    code: 'volgograd',
    name: 'Волгоградская область',
    pmValue: 15250,
    pmWorking: 16623,
    pmPensioner: 13115,
    pmChild: 14793
  },
  {
    code: 'rostov',
    name: 'Ростовская область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'crimea',
    name: 'Республика Крым',
    pmValue: 17201,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 16685
  },
  {
    code: 'sevastopol',
    name: 'Севастополь',
    pmValue: 18088,
    pmWorking: 19716,
    pmPensioner: 15556,
    pmChild: 17545
  },

  // СЕВЕРО-КАВКАЗСКИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'dagestan',
    name: 'Республика Дагестан',
    pmValue: 16137,
    pmWorking: 17589,
    pmPensioner: 13878,
    pmChild: 15653
  },
  {
    code: 'ingushetia',
    name: 'Республика Ингушетия',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'kbr',
    name: 'Кабардино-Балкарская Республика',
    pmValue: 18974,
    pmWorking: 20682,
    pmPensioner: 16318,
    pmChild: 18405
  },
  {
    code: 'kchr',
    name: 'Карачаево-Черкесская Республика',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'osetia',
    name: 'Республика Северная Осетия — Алания',
    pmValue: 15960,
    pmWorking: 17396,
    pmPensioner: 13726,
    pmChild: 15481
  },
  {
    code: 'chechnya',
    name: 'Чеченская Республика',
    pmValue: 17024,
    pmWorking: 18556,
    pmPensioner: 14641,
    pmChild: 16513
  },
  {
    code: 'stavropol',
    name: 'Ставропольский край',
    pmValue: 15960,
    pmWorking: 17396,
    pmPensioner: 13726,
    pmChild: 15481
  },

  // ПРИВОЛЖСКИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'bashkortostan',
    name: 'Республика Башкортостан',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15309
  },
  {
    code: 'mari_el',
    name: 'Республика Марий Эл',
    pmValue: 15605,
    pmWorking: 17009,
    pmPensioner: 13420,
    pmChild: 15137
  },
  {
    code: 'mordovia',
    name: 'Республика Мордовия',
    pmValue: 15073,
    pmWorking: 16430,
    pmPensioner: 12963,
    pmChild: 14621
  },
  {
    code: 'tatarstan',
    name: 'Республика Татарстан',
    pmValue: 15073,
    pmWorking: 16430,
    pmPensioner: 12963,
    pmChild: 14621
  },
  {
    code: 'udmurtia',
    name: 'Удмуртская Республика',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15309
  },
  {
    code: 'chuvashia',
    name: 'Чувашская Республика',
    pmValue: 15428,
    pmWorking: 16817,
    pmPensioner: 13268,
    pmChild: 14965
  },
  {
    code: 'perm',
    name: 'Пермский край',
    pmValue: 16314,
    pmWorking: 17782,
    pmPensioner: 14030,
    pmChild: 15825
  },
  {
    code: 'kirov',
    name: 'Кировская область',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15309
  },
  {
    code: 'nizhny',
    name: 'Нижегородская область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'orenburg',
    name: 'Оренбургская область',
    pmValue: 15428,
    pmWorking: 16817,
    pmPensioner: 13268,
    pmChild: 14965
  },
  {
    code: 'penza',
    name: 'Пензенская область',
    pmValue: 14896,
    pmWorking: 16237,
    pmPensioner: 12811,
    pmChild: 14449
  },
  {
    code: 'samara',
    name: 'Самарская область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'saratov',
    name: 'Саратовская область',
    pmValue: 14896,
    pmWorking: 16237,
    pmPensioner: 12811,
    pmChild: 14449
  },
  {
    code: 'ulyanovsk',
    name: 'Ульяновская область',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15309
  },

  // УРАЛЬСКИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'kurgan',
    name: 'Курганская область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'sverdlovsk',
    name: 'Свердловская область',
    pmValue: 17556,
    pmWorking: 19136,
    pmPensioner: 15098,
    pmChild: 17029
  },
  {
    code: 'tyumen',
    name: 'Тюменская область',
    pmValue: 17733,
    pmWorking: 19329,
    pmPensioner: 15250,
    pmChild: 17201
  },
  {
    code: 'chelyabinsk',
    name: 'Челябинская область',
    pmValue: 16314,
    pmWorking: 17782,
    pmPensioner: 14030,
    pmChild: 15825
  },
  {
    code: 'khanty_mansi',
    name: 'Ханты-Мансийский автономный округ — Югра',
    pmValue: 21252,
    pmWorking: 23165,
    pmPensioner: 18334,
    pmChild: 21286
  },
  {
    code: 'yamal',
    name: 'Ямало-Ненецкий автономный округ',
    pmValue: 24294,
    pmWorking: 26480,
    pmPensioner: 20893,
    pmChild: 23565
  },

  // СИБИРСКИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'altai_rep',
    name: 'Республика Алтай',
    pmValue: 16846,
    pmWorking: 18362,
    pmPensioner: 14488,
    pmChild: 16341
  },
  {
    code: 'buryatia',
    name: 'Республика Бурятия',
    pmValue: 19329,
    pmWorking: 21069,
    pmPensioner: 16623,
    pmChild: 18749
  },
  {
    code: 'tuva',
    name: 'Республика Тыва',
    pmValue: 17910,
    pmWorking: 19522,
    pmPensioner: 15403,
    pmChild: 17373
  },
  {
    code: 'khakassia',
    name: 'Республика Хакасия',
    pmValue: 18088,
    pmWorking: 19716,
    pmPensioner: 15556,
    pmChild: 17545
  },
  {
    code: 'altai_krai',
    name: 'Алтайский край',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15309
  },
  {
    code: 'zabaykalsk',
    name: 'Забайкальский край',
    pmValue: 20748,
    pmWorking: 22615,
    pmPensioner: 17843,
    pmChild: 20126
  },
  {
    code: 'krasnoyarsk',
    name: 'Красноярский край',
    pmValue: 19684,
    pmWorking: 21456,
    pmPensioner: 16928,
    pmChild: 19093
  },
  {
    code: 'irkutsk',
    name: 'Иркутская область',
    pmValue: 18797,
    pmWorking: 20489,
    pmPensioner: 16165,
    pmChild: 18233
  },
  {
    code: 'kemerovo',
    name: 'Кемеровская область — Кузбасс',
    pmValue: 16137,
    pmWorking: 17589,
    pmPensioner: 13878,
    pmChild: 15653
  },
  {
    code: 'novosibirsk',
    name: 'Новосибирская область',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 16857
  },
  {
    code: 'omsk',
    name: 'Омская область',
    pmValue: 15428,
    pmWorking: 16816,
    pmPensioner: 13268,
    pmChild: 14965
  },
  {
    code: 'tomsk',
    name: 'Томская область',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 16857
  },

  // ДАЛЬНЕВОСТОЧНЫЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'sakha',
    name: 'Республика Саха (Якутия)',
    pmValue: 26777,
    pmWorking: 29187,
    pmPensioner: 23028,
    pmChild: 25974
  },
  {
    code: 'kamchatka',
    name: 'Камчатский край',
    pmValue: 31210,
    pmWorking: 34019,
    pmPensioner: 26841,
    pmChild: 30692
  },
  {
    code: 'primorye',
    name: 'Приморский край',
    pmValue: 21102,
    pmWorking: 23001,
    pmPensioner: 18148,
    pmChild: 20469
  },
  {
    code: 'khabarovsk',
    name: 'Хабаровский край',
    pmValue: 21634,
    pmWorking: 23581,
    pmPensioner: 18605,
    pmChild: 22844
  },
  {
    code: 'amur',
    name: 'Амурская область',
    pmValue: 20393,
    pmWorking: 22228,
    pmPensioner: 17538,
    pmChild: 20090
  },
  {
    code: 'magadan',
    name: 'Магаданская область',
    pmValue: 30855,
    pmWorking: 33632,
    pmPensioner: 26535,
    pmChild: 30681
  },
  {
    code: 'sakhalin',
    name: 'Сахалинская область',
    pmValue: 24117,
    pmWorking: 26288,
    pmPensioner: 20741,
    pmChild: 23393
  },
  {
    code: 'jewish',
    name: 'Еврейская автономная область',
    pmValue: 22166,
    pmWorking: 24161,
    pmPensioner: 19063,
    pmChild: 21501
  },
  {
    code: 'chukotka',
    name: 'Чукотский автономный округ',
    pmValue: 46283,
    pmWorking: 50448,
    pmPensioner: 39803,
    pmChild: 44895
  },

  // НОВЫЕ ТЕРРИТОРИИ (вошедшие в состав РФ в 2022 году)
  {
    code: 'donetsk',
    name: 'Донецкая область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'lugansk',
    name: 'Луганская область',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'zaporozhye',
    name: 'Запорожская область',
    pmValue: 17201,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 16685
  },
  {
    code: 'kherson',
    name: 'Херсонская область',
    pmValue: 17201,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 16685
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
