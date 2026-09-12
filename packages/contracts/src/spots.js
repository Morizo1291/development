export const MODES = ['sport', 'drive'];
export const RESTRICTION_STATUSES = ['check-required', 'clear', 'closed'];

export function validateSpot(spot) {
  const required = ['id', 'name', 'area', 'mode', 'distanceKm', 'durationMinutes', 'elevationGainM', 'source', 'verifiedAt', 'restrictionStatus'];
  const missing = required.filter(key => spot[key] === undefined || spot[key] === null || spot[key] === '');
  if (missing.length) throw new Error(`Spot is missing: ${missing.join(', ')}`);
  if (!MODES.includes(spot.mode)) throw new Error(`Invalid mode: ${spot.mode}`);
  if (!RESTRICTION_STATUSES.includes(spot.restrictionStatus)) throw new Error(`Invalid restriction status: ${spot.restrictionStatus}`);
  if (!Array.isArray(spot.highlights) || !Array.isArray(spot.stops) || !Array.isArray(spot.sections)) throw new Error('Spot arrays are required');
  return spot;
}
