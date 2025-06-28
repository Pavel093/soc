export default defineEventHandler(async (event) => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching IP info:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch IP information'
    });
  }
});