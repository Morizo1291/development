import { openDetail } from "./detail.js";

let spots = {
  sport: [
    { name: '碓氷峠 旧道', area: '群馬県安中市', distance: '18.4 km', time: '約 28 分', badge: 'おすすめ', photo: 'usui', details: ['連続コーナー', '幅員 5.5m', '標高差 420m'] },
    { name: '榛名山・榛名湖線', area: '群馬県高崎市', distance: '26.7 km', time: '約 39 分', badge: '眺望', photo: 'haruna', details: ['中速コーナー', '幅員 6.0m', '標高差 610m'] },
    { name: '赤城南面・県道16号', area: '群馬県前橋市', distance: '31.2 km', time: '約 45 分', badge: '朝がおすすめ', photo: 'akagi', details: ['テクニカル', '幅員 5.0m', '標高差 730m'] }
  ],
  drive: [
    { name: '奥利根ゆけむり街道', area: '群馬県みなかみ町', distance: '12.8 km', time: '約 20 分', badge: '紅葉名所', photo: 'okutone', details: ['渓谷ビュー', '道の駅あり', '温泉 3ヶ所'] },
    { name: '榛名湖パノラマライン', area: '群馬県高崎市', distance: '27.1 km', time: '約 42 分', badge: '湖畔', photo: 'haruna', details: ['湖畔ビュー', 'カフェあり', '展望台 2ヶ所'] },
    { name: '赤城高原ルート', area: '群馬県沼田市', distance: '34.6 km', time: '約 52 分', badge: '寄り道', photo: 'akagi', details: ['高原ビュー', '牧場あり', '道の駅あり'] }
  ]
};

let currentMode = 'sport';
const spotList = document.querySelector('#spot-list');
const listTitle = document.querySelector('#list-title');

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
function renderSpots(filter = 'all') {
  let activeSpots = spots[currentMode];
  if (filter === 'nearby') activeSpots = activeSpots.slice(0, 2);
  if (filter === 'scenic') activeSpots = activeSpots.filter((spot) => spot.badge !== 'おすすめ');
  if (filter === 'rest') activeSpots = currentMode === 'drive' ? activeSpots : activeSpots.slice(1);
  spotList.innerHTML = activeSpots.map((spot, index) => `
    <article class="spot-card ${index === 0 ? 'featured' : ''}" tabindex="0" role="button" data-spot="${escapeHtml(spot.name)}">
      <div class="card-photo photo-${spot.photo}"><span>${spot.badge}</span></div>
      <div class="spot-info"><p class="spot-area">${escapeHtml(spot.area)}</p><h3>${escapeHtml(spot.name)}</h3><p class="spot-meta">${escapeHtml(spot.distance)}<i></i>${escapeHtml(spot.time)}</p><div class="chips">${spot.details.map(detail => `<span>${escapeHtml(detail)}</span>`).join('')}</div></div>
      <button class="save" aria-label="${escapeHtml(spot.name)}を保存" aria-pressed="false">♡</button>
    </article>`).join('');
  document.querySelectorAll('.save').forEach(button => button.addEventListener('click', () => { const saved = button.classList.toggle('saved'); button.setAttribute('aria-pressed', String(saved)); button.textContent = saved ? '♥' : '♡'; }));
}

document.querySelectorAll('.mode').forEach(button => button.addEventListener('click', () => {
  currentMode = button.dataset.mode;
  document.querySelectorAll('.mode').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-selected', item === button); });
  listTitle.textContent = currentMode === 'sport' ? 'いま近くのワインディング' : '寄り道したいドライブコース';
  document.querySelector('.safety p').textContent = currentMode === 'sport' ? '安全第一で。交通ルールと現地の規制を守り、無理のない運転を。' : '景色を楽しむためにも、余裕ある計画とこまめな休憩を。';
  // Request mode-specific spots from the API (falls back to bundled data if unavailable)
  document.dispatchEvent(new CustomEvent('curve:request-spots', { detail: { mode: currentMode } }));
  // Trigger UI filter refresh once data arrives (curve:spots handler will reapply selected filter)
}));

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(item => item.classList.toggle('selected', item === button));
  renderSpots(button.dataset.filter);
}));

document.querySelector('.safety button').addEventListener('click', () => document.querySelector('.safety').remove());
renderSpots();


document.addEventListener("curve:spots", event => {
  spots = {
    sport: event.detail.filter(spot => spot.mode === "sport").map(spot => ({ ...spot, distance: `${spot.distanceKm} km`, time: `約 ${spot.durationMinutes} 分`, details: spot.highlights })),
    drive: event.detail.filter(spot => spot.mode === "drive").map(spot => ({ ...spot, distance: `${spot.distanceKm} km`, time: `約 ${spot.durationMinutes} 分`, details: spot.highlights }))
  };
  document.querySelector(".filter.selected").click();
});

// UI: show loading and errors from API loader
const loaderEl = document.getElementById('loader');
const apiErrorEl = document.getElementById('api-error');
const apiErrorMsg = document.getElementById('api-error-message');
const apiRetryBtn = document.getElementById('api-retry');
document.addEventListener('curve:spots-loading', () => {
  if (loaderEl) { loaderEl.style.display = 'block'; loaderEl.setAttribute('aria-hidden','false'); }
  if (apiErrorEl) { apiErrorEl.style.display = 'none'; apiErrorEl.setAttribute('aria-hidden','true'); }
});
document.addEventListener('curve:spots', () => {
  if (loaderEl) { loaderEl.style.display = 'none'; loaderEl.setAttribute('aria-hidden','true'); }
  if (apiErrorEl) { apiErrorEl.style.display = 'none'; apiErrorEl.setAttribute('aria-hidden','true'); }
});
document.addEventListener('curve:spots-error', e => {
  if (loaderEl) { loaderEl.style.display = 'none'; loaderEl.setAttribute('aria-hidden','true'); }
  if (apiErrorEl) {
    if (apiErrorMsg) apiErrorMsg.textContent = e?.detail?.message || 'API に接続できません';
    apiErrorEl.style.display = 'flex'; apiErrorEl.setAttribute('aria-hidden','false');
  }
});

if (apiRetryBtn) {
  apiRetryBtn.addEventListener('click', () => {
    // hide error, show loader, and request spots again
    if (apiErrorEl) { apiErrorEl.style.display = 'none'; apiErrorEl.setAttribute('aria-hidden','true'); }
    if (loaderEl) { loaderEl.style.display = 'block'; loaderEl.setAttribute('aria-hidden','false'); }
    document.dispatchEvent(new CustomEvent('curve:request-spots', { detail: { mode: currentMode } }));
  });
}

export function findSpot(query) {
  const normalized = query.trim().toLocaleLowerCase('ja');
  return Object.values(spots).flat().find(spot => `${spot.name} ${spot.area}`.toLocaleLowerCase('ja').includes(normalized));
}
