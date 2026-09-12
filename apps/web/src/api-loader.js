const apiBaseUrl = import.meta.env.VITE_CURVE_API_URL || 'http://localhost:8787';

async function loadSpots() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/spots`);
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const { data } = await response.json();
    document.dispatchEvent(new CustomEvent('curve:spots', { detail: data }));
  } catch (error) {
    console.info('CURVE API is unavailable; showing bundled sample data.', error.message);
  }
}

loadSpots();
