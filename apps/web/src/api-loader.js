const apiBaseUrl = import.meta.env.VITE_CURVE_API_URL || 'http://localhost:8787';

export async function loadSpots(mode) {
  try {
    // notify UI that loading has started
    document.dispatchEvent(new CustomEvent('curve:spots-loading'));
    const url = new URL(`${apiBaseUrl}/api/v1/spots`);
    if (mode) url.searchParams.set('mode', mode);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const { data } = await response.json();
    document.dispatchEvent(new CustomEvent('curve:spots', { detail: data }));
  } catch (error) {
    // notify UI about the error so it can show a message
    document.dispatchEvent(new CustomEvent('curve:spots-error', { detail: { message: error.message } }));
    console.info('CURVE API is unavailable; showing bundled sample data.', error.message);
  }
}

// Support explicit requests from the UI: dispatch `curve:request-spots` with {mode}
document.addEventListener('curve:request-spots', event => {
  const mode = event?.detail?.mode;
  loadSpots(mode);
});

// initial load (no mode filter)
loadSpots();
