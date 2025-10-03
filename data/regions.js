// Данные о прожиточном минимуме по регионам РФ на 2025 год
// Источник: Постановление Правительства РФ от 12.06.2024 № 789
// Актуально на 2025 год

export const regions = [
  // ЦЕНТРАЛЬНЫЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'belgorod',
    name: 'Белгородская область',
    nameGenitive: 'Белгородской области',
    pmValue: 14896,
    pmWorking: 16237,
    pmPensioner: 12811,
    pmChild: 14449
  },
  {
    code: 'bryansk',
    name: 'Брянская область',
    nameGenitive: 'Брянской области',
    pmValue: 16314,
    pmWorking: 17782,
    pmPensioner: 14030,
    pmChild: 15825
  },
  {
    code: 'vladimir',
    name: 'Владимирская область',
    nameGenitive: 'Владимирской области',
    pmValue: 17201,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 16685
  },
  {
    code: 'voronezh',
    name: 'Воронежская область',
    nameGenitive: 'Воронежской области',
    pmValue: 15605,
    pmWorking: 17009,
    pmPensioner: 13420,
    pmChild: 15137
  },
  {
    code: 'ivanovo',
    name: 'Ивановская область',
    nameGenitive: 'Ивановской области',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'kaluga',
    name: 'Калужская область',
    nameGenitive: 'Калужской области',
    pmValue: 17024,
    pmWorking: 18556,
    pmPensioner: 14641,
    pmChild: 16513
  },
  {
    code: 'kostroma',
    name: 'Костромская область',
    nameGenitive: 'Костромской области',
    pmValue: 16314,
    pmWorking: 17782,
    pmPensioner: 14030,
    pmChild: 15825
  },
  {
    code: 'kursk',
    name: 'Курская область',
    nameGenitive: 'Курской области',
    pmValue: 15428,
    pmWorking: 16817,
    pmPensioner: 13268,
    pmChild: 14965
  },
  {
    code: 'lipetsk',
    name: 'Липецкая область',
    nameGenitive: 'Липецкой области',
    pmValue: 14718,
    pmWorking: 16043,
    pmPensioner: 12657,
    pmChild: 14276
  },
  {
    code: 'moscow_obl',
    name: 'Московская область',
    nameGenitive: 'Московской области',
    pmValue: 19302,
    pmWorking: 21039,
    pmPensioner: 16600,
    pmChild: 18723
  },
  {
    code: 'orel',
    name: 'Орловская область',
    nameGenitive: 'Орловской области',
    pmValue: 16492,
    pmWorking: 17976,
    pmPensioner: 14183,
    pmChild: 15997
  },
  {
    code: 'ryazan',
    name: 'Рязанская область',
    nameGenitive: 'Рязанской области',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15309
  },
  {
    code: 'smolensk',
    name: 'Смоленская область',
    nameGenitive: 'Смоленской области',
    pmValue: 17556,
    pmWorking: 19136,
    pmPensioner: 15098,
    pmChild: 17029
  },
  {
    code: 'tambov',
    name: 'Тамбовская область',
    nameGenitive: 'Тамбовской области',
    pmValue: 14718,
    pmWorking: 16043,
    pmPensioner: 12784,
    pmChild: 14276
  },
  {
    code: 'tver',
    name: 'Тверская область',
    nameGenitive: 'Тверской области',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 16857
  },
  {
    code: 'tula',
    name: 'Тульская область',
    nameGenitive: 'Тульской области',
    pmValue: 17733,
    pmWorking: 19329,
    pmPensioner: 15250,
    pmChild: 17201
  },
  {
    code: 'yaroslavl',
    name: 'Ярославская область',
    nameGenitive: 'Ярославской области',
    pmValue: 17733,
    pmWorking: 19329,
    pmPensioner: 15250,
    pmChild: 17201
  },
  {
    code: 'moscow',
    name: 'Москва',
    nameGenitive: 'Москве',
    pmValue: 23908,
    pmWorking: 27302,
    pmPensioner: 17897,
    pmChild: 20663
  },

  // СЕВЕРО-ЗАПАДНЫЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'karelia',
    name: 'Республика Карелия',
    nameGenitive: 'Республике Карелия',
    pmValue: 19684,
    pmWorking: 21456,
    pmPensioner: 16928,
    pmChild: 19093
  },
  {
    code: 'komi',
    name: 'Республика Коми',
    nameGenitive: 'Республике Коми',
    pmValue: 20393,
    pmWorking: 22228,
    pmPensioner: 17538,
    pmChild: 19781
  },
  {
    code: 'arkhangelsk',
    name: 'Архангельская область',
    nameGenitive: 'Архангельской области',
    pmValue: 20570,
    pmWorking: 22421,
    pmPensioner: 17690,
    pmChild: 19953
  },
  {
    code: 'vologda',
    name: 'Вологодская область',
    nameGenitive: 'Вологодской области',
    pmValue: 17910,
    pmWorking: 19522,
    pmPensioner: 15403,
    pmChild: 17373
  },
  {
    code: 'kaliningrad',
    name: 'Калининградская область',
    nameGenitive: 'Калининградской области',
    pmValue: 18265,
    pmWorking: 19909,
    pmPensioner: 15708,
    pmChild: 17717
  },
  {
    code: 'leningrad',
    name: 'Ленинградская область',
    nameGenitive: 'Ленинградской области',
    pmValue: 18974,
    pmWorking: 20682,
    pmPensioner: 16318,
    pmChild: 18405
  },
  {
    code: 'murmansk',
    name: 'Мурманская область',
    nameGenitive: 'Мурманской области',
    pmValue: 25390,
    pmWorking: 27675,
    pmPensioner: 21835,
    pmChild: 24628
  },
  {
    code: 'novgorod',
    name: 'Новгородская область',
    nameGenitive: 'Новгородской области',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 16857
  },
  {
    code: 'pskov',
    name: 'Псковская область',
    nameGenitive: 'Псковской области',
    pmValue: 17556,
    pmWorking: 19136,
    pmPensioner: 15098,
    pmChild: 17029
  },
  {
    code: 'spb',
    name: 'Санкт-Петербург',
    nameGenitive: 'Санкт-Петербурге',
    pmValue: 19329,
    pmWorking: 21069,
    pmPensioner: 16623,
    pmChild: 18749
  },
  {
    code: 'nenets',
    name: 'Ненецкий автономный округ',
    nameGenitive: 'Ненецком автономном округе',
    pmValue: 29389,
    pmWorking: 32034,
    pmPensioner: 25275,
    pmChild: 30706
  },

  // ЮЖНЫЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'adygea',
    name: 'Республика Адыгея',
    nameGenitive: 'Республике Адыгея',
    pmValue: 15250,
    pmWorking: 16623,
    pmPensioner: 13115,
    pmChild: 14793
  },
  {
    code: 'kalmykia',
    name: 'Республика Калмыкия',
    nameGenitive: 'Республике Калмыкия',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 16857
  },
  {
    code: 'krasnodar',
    name: 'Краснодарский край',
    nameGenitive: 'Краснодарском крае',
    pmValue: 17024,
    pmWorking: 18556,
    pmPensioner: 14641,
    pmChild: 16513
  },
  {
    code: 'astrakhan',
    name: 'Астраханская область',
    nameGenitive: 'Астраханской области',
    pmValue: 17201,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 16685
  },
  {
    code: 'volgograd',
    name: 'Волгоградская область',
    nameGenitive: 'Волгоградской области',
    pmValue: 15250,
    pmWorking: 16623,
    pmPensioner: 13115,
    pmChild: 14793
  },
  {
    code: 'rostov',
    name: 'Ростовская область',
    nameGenitive: 'Ростовской области',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'crimea',
    name: 'Республика Крым',
    nameGenitive: 'Республике Крым',
    pmValue: 17201,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 16685
  },
  {
    code: 'sevastopol',
    name: 'Севастополь',
    nameGenitive: 'Севастополе',
    pmValue: 18088,
    pmWorking: 19716,
    pmPensioner: 15556,
    pmChild: 17545
  },

  // СЕВЕРО-КАВКАЗСКИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'dagestan',
    name: 'Республика Дагестан',
    nameGenitive: 'Республике Дагестан',
    pmValue: 16137,
    pmWorking: 17589,
    pmPensioner: 13878,
    pmChild: 15653
  },
  {
    code: 'ingushetia',
    name: 'Республика Ингушетия',
    nameGenitive: 'Республике Ингушетия',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'kbr',
    name: 'Кабардино-Балкарская Республика',
    nameGenitive: 'Кабардино-Балкарской Республике',
    pmValue: 18974,
    pmWorking: 20682,
    pmPensioner: 16318,
    pmChild: 18405
  },
  {
    code: 'kchr',
    name: 'Карачаево-Черкесская Республика',
    nameGenitive: 'Карачаево-Черкесской Республике',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'osetia',
    name: 'Республика Северная Осетия — Алания',
    nameGenitive: 'Республике Северная Осетия — Алания',
    pmValue: 15960,
    pmWorking: 17396,
    pmPensioner: 13726,
    pmChild: 15481
  },
  {
    code: 'chechnya',
    name: 'Чеченская Республика',
    nameGenitive: 'Чеченской Республике',
    pmValue: 17024,
    pmWorking: 18556,
    pmPensioner: 14641,
    pmChild: 16513
  },
  {
    code: 'stavropol',
    name: 'Ставропольский край',
    nameGenitive: 'Ставропольском крае',
    pmValue: 15960,
    pmWorking: 17396,
    pmPensioner: 13726,
    pmChild: 15481
  },

  // ПРИВОЛЖСКИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'bashkortostan',
    name: 'Республика Башкортостан',
    nameGenitive: 'Республике Башкортостан',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15309
  },
  {
    code: 'mari_el',
    name: 'Республика Марий Эл',
    nameGenitive: 'Республике Марий Эл',
    pmValue: 15605,
    pmWorking: 17009,
    pmPensioner: 13420,
    pmChild: 15137
  },
  {
    code: 'mordovia',
    name: 'Республика Мордовия',
    nameGenitive: 'Республике Мордовия',
    pmValue: 15073,
    pmWorking: 16430,
    pmPensioner: 12963,
    pmChild: 14621
  },
  {
    code: 'tatarstan',
    name: 'Республика Татарстан',
    nameGenitive: 'Республике Татарстан',
    pmValue: 15073,
    pmWorking: 16430,
    pmPensioner: 12963,
    pmChild: 14621
  },
  {
    code: 'udmurtia',
    name: 'Удмуртская Республика',
    nameGenitive: 'Удмуртской Республике',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15309
  },
  {
    code: 'chuvashia',
    name: 'Чувашская Республика',
    nameGenitive: 'Чувашской Республике',
    pmValue: 15428,
    pmWorking: 16817,
    pmPensioner: 13268,
    pmChild: 14965
  },
  {
    code: 'perm',
    name: 'Пермский край',
    nameGenitive: 'Пермском крае',
    pmValue: 16314,
    pmWorking: 17782,
    pmPensioner: 14030,
    pmChild: 15825
  },
  {
    code: 'kirov',
    name: 'Кировская область',
    nameGenitive: 'Кировской области',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15309
  },
  {
    code: 'nizhny',
    name: 'Нижегородская область',
    nameGenitive: 'Нижегородской области',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'orenburg',
    name: 'Оренбургская область',
    nameGenitive: 'Оренбургской области',
    pmValue: 15428,
    pmWorking: 16817,
    pmPensioner: 13268,
    pmChild: 14965
  },
  {
    code: 'penza',
    name: 'Пензенская область',
    nameGenitive: 'Пензенской области',
    pmValue: 14896,
    pmWorking: 16237,
    pmPensioner: 12811,
    pmChild: 14449
  },
  {
    code: 'samara',
    name: 'Самарская область',
    nameGenitive: 'Самарской области',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'saratov',
    name: 'Саратовская область',
    nameGenitive: 'Саратовской области',
    pmValue: 14896,
    pmWorking: 16237,
    pmPensioner: 12811,
    pmChild: 14449
  },
  {
    code: 'ulyanovsk',
    name: 'Ульяновская область',
    nameGenitive: 'Ульяновской области',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15309
  },

  // УРАЛЬСКИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'kurgan',
    name: 'Курганская область',
    nameGenitive: 'Курганской области',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'sverdlovsk',
    name: 'Свердловская область',
    nameGenitive: 'Свердловской области',
    pmValue: 17556,
    pmWorking: 19136,
    pmPensioner: 15098,
    pmChild: 17029
  },
  {
    code: 'tyumen',
    name: 'Тюменская область',
    nameGenitive: 'Тюменской области',
    pmValue: 17733,
    pmWorking: 19329,
    pmPensioner: 15250,
    pmChild: 17201
  },
  {
    code: 'chelyabinsk',
    name: 'Челябинская область',
    nameGenitive: 'Челябинской области',
    pmValue: 16314,
    pmWorking: 17782,
    pmPensioner: 14030,
    pmChild: 15825
  },
  {
    code: 'khanty_mansi',
    name: 'Ханты-Мансийский автономный округ — Югра',
    nameGenitive: 'Ханты-Мансийском автономном округе — Югре',
    pmValue: 21252,
    pmWorking: 23165,
    pmPensioner: 18334,
    pmChild: 21286
  },
  {
    code: 'yamal',
    name: 'Ямало-Ненецкий автономный округ',
    nameGenitive: 'Ямало-Ненецком автономном округе',
    pmValue: 24294,
    pmWorking: 26480,
    pmPensioner: 20893,
    pmChild: 23565
  },

  // СИБИРСКИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'altai_rep',
    name: 'Республика Алтай',
    nameGenitive: 'Республике Алтай',
    pmValue: 16846,
    pmWorking: 18362,
    pmPensioner: 14488,
    pmChild: 16341
  },
  {
    code: 'buryatia',
    name: 'Республика Бурятия',
    nameGenitive: 'Республике Бурятия',
    pmValue: 19329,
    pmWorking: 21069,
    pmPensioner: 16623,
    pmChild: 18749
  },
  {
    code: 'tuva',
    name: 'Республика Тыва',
    nameGenitive: 'Республике Тыва',
    pmValue: 17910,
    pmWorking: 19522,
    pmPensioner: 15403,
    pmChild: 17373
  },
  {
    code: 'khakassia',
    name: 'Республика Хакасия',
    nameGenitive: 'Республике Хакасия',
    pmValue: 18088,
    pmWorking: 19716,
    pmPensioner: 15556,
    pmChild: 17545
  },
  {
    code: 'altai_krai',
    name: 'Алтайский край',
    nameGenitive: 'Алтайском крае',
    pmValue: 15782,
    pmWorking: 17202,
    pmPensioner: 13573,
    pmChild: 15309
  },
  {
    code: 'zabaykalsk',
    name: 'Забайкальский край',
    nameGenitive: 'Забайкальском крае',
    pmValue: 20748,
    pmWorking: 22615,
    pmPensioner: 17843,
    pmChild: 20126
  },
  {
    code: 'krasnoyarsk',
    name: 'Красноярский край',
    nameGenitive: 'Красноярском крае',
    pmValue: 19684,
    pmWorking: 21456,
    pmPensioner: 16928,
    pmChild: 19093
  },
  {
    code: 'irkutsk',
    name: 'Иркутская область',
    nameGenitive: 'Иркутской области',
    pmValue: 18797,
    pmWorking: 20489,
    pmPensioner: 16165,
    pmChild: 18233
  },
  {
    code: 'kemerovo',
    name: 'Кемеровская область — Кузбасс',
    nameGenitive: 'Кемеровской области — Кузбассе',
    pmValue: 16137,
    pmWorking: 17589,
    pmPensioner: 13878,
    pmChild: 15653
  },
  {
    code: 'novosibirsk',
    name: 'Новосибирская область',
    nameGenitive: 'Новосибирской области',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 16857
  },
  {
    code: 'omsk',
    name: 'Омская область',
    nameGenitive: 'Омской области',
    pmValue: 15428,
    pmWorking: 16816,
    pmPensioner: 13268,
    pmChild: 14965
  },
  {
    code: 'tomsk',
    name: 'Томская область',
    nameGenitive: 'Томской области',
    pmValue: 17378,
    pmWorking: 18942,
    pmPensioner: 14945,
    pmChild: 16857
  },

  // ДАЛЬНЕВОСТОЧНЫЙ ФЕДЕРАЛЬНЫЙ ОКРУГ
  {
    code: 'sakha',
    name: 'Республика Саха (Якутия)',
    nameGenitive: 'Республике Саха (Якутия)',
    pmValue: 26777,
    pmWorking: 29187,
    pmPensioner: 23028,
    pmChild: 25974
  },
  {
    code: 'kamchatka',
    name: 'Камчатский край',
    nameGenitive: 'Камчатском крае',
    pmValue: 31210,
    pmWorking: 34019,
    pmPensioner: 26841,
    pmChild: 30692
  },
  {
    code: 'primorye',
    name: 'Приморский край',
    nameGenitive: 'Приморском крае',
    pmValue: 21102,
    pmWorking: 23001,
    pmPensioner: 18148,
    pmChild: 20469
  },
  {
    code: 'khabarovsk',
    name: 'Хабаровский край',
    nameGenitive: 'Хабаровском крае',
    pmValue: 21634,
    pmWorking: 23581,
    pmPensioner: 18605,
    pmChild: 22844
  },
  {
    code: 'amur',
    name: 'Амурская область',
    nameGenitive: 'Амурской области',
    pmValue: 20393,
    pmWorking: 22228,
    pmPensioner: 17538,
    pmChild: 20090
  },
  {
    code: 'magadan',
    name: 'Магаданская область',
    nameGenitive: 'Магаданской области',
    pmValue: 30855,
    pmWorking: 33632,
    pmPensioner: 26535,
    pmChild: 30681
  },
  {
    code: 'sakhalin',
    name: 'Сахалинская область',
    nameGenitive: 'Сахалинской области',
    pmValue: 24117,
    pmWorking: 26288,
    pmPensioner: 20741,
    pmChild: 23393
  },
  {
    code: 'jewish',
    name: 'Еврейская автономная область',
    nameGenitive: 'Еврейской автономной области',
    pmValue: 22166,
    pmWorking: 24161,
    pmPensioner: 19063,
    pmChild: 21501
  },
  {
    code: 'chukotka',
    name: 'Чукотский автономный округ',
    nameGenitive: 'Чукотском автономном округе',
    pmValue: 46283,
    pmWorking: 50448,
    pmPensioner: 39803,
    pmChild: 44895
  },

  // НОВЫЕ ТЕРРИТОРИИ (вошедшие в состав РФ в 2022 году)
  {
    code: 'donetsk',
    name: 'Донецкая область',
    nameGenitive: 'Донецкой области',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'lugansk',
    name: 'Луганская область',
    nameGenitive: 'Луганской области',
    pmValue: 16669,
    pmWorking: 18169,
    pmPensioner: 14335,
    pmChild: 16169
  },
  {
    code: 'zaporozhye',
    name: 'Запорожская область',
    nameGenitive: 'Запорожской области',
    pmValue: 17201,
    pmWorking: 18749,
    pmPensioner: 14793,
    pmChild: 16685
  },
  {
    code: 'kherson',
    name: 'Херсонская область',
    nameGenitive: 'Херсонской области',
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