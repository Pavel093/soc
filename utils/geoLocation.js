export async function detectRegion() {
  try {
    // Используем бесплатный API для определения местоположения по IP
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // Проверяем разные возможные поля, где может быть регион
    const region = data.region || data.region_name || data.federal_district;
    
    // Если API вернул город (например, Москва), проверяем есть ли он в pmData
    if (region && pmData[region]) {
      return region;
    }
    
    // Если город не найден, проверяем область/край
    const regionWithSuffix = `${region} область`;
    if (region && pmData[regionWithSuffix]) {
      return regionWithSuffix;
    }
    
    return null;
  } catch (error) {
    console.error('Ошибка при определении региона:', error);
    return null;
  }
}