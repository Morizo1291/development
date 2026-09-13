import { openDetail } from './detail.js';
import { findSpot } from './main.js';

document.addEventListener('click', event => {
  const card = event.target.closest('.spot-card');
  if (card && !event.target.closest('.save')) openDetail(card.querySelector('h3').textContent);
});

document.addEventListener('keydown', event => {
  const card = event.target.closest('.spot-card');
  if (card && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    openDetail(card.querySelector('h3').textContent);
  }
});

const mapCard = document.querySelector('#map-card');
mapCard.querySelector('.close').addEventListener('click', () => mapCard.remove());
mapCard.querySelector('.route-button').addEventListener('click', () => {
  const name = mapCard.querySelector('h3').textContent;
  if (mapCard.dataset.navigation === 'true') { document.querySelector('#route-status').textContent = `「${name}」への案内を準備しました。出発前に交通規制と周辺状況をご確認ください。`; return; }
  openDetail(name);
});
document.querySelector('#show-map').addEventListener('click', () => {
  document.querySelector('.map-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

});
const destinationForm = document.querySelector('#destination-form');
const destinationInput = document.querySelector('#destination-input');
const routeStatus = document.querySelector('#route-status');
destinationForm.addEventListener('submit', event => {
  event.preventDefault();
  const query = destinationInput.value.trim();
  if (!query) { routeStatus.textContent = '目的地またはスポット名を入力してください。'; destinationInput.focus(); return; }
  const spot = findSpot(query);
  const title = spot ? spot.name : query;
  document.querySelector('#map-card-title').textContent = title;
  document.querySelector('#map-card-meta').innerHTML = spot ? `全長 ${spot.distance} <i></i> ${spot.time}` : '現在地からのルートを確認';
  document.querySelector('#map-card-kind').textContent = spot ? 'ROUTE PREVIEW' : 'DESTINATION';
  document.querySelector('#map-card-badge').textContent = spot ? spot.area.replace('群馬県', '') : '目的地';
  document.querySelector('#map-card-action').innerHTML = '案内を開始 <span>→</span>';
  mapCard.dataset.navigation = 'true';
  routeStatus.textContent = spot ? `「${title}」を見つけました。ルートの確認または案内を開始できます。` : `「${title}」を目的地として設定しました。ルートは出発前にご確認ください。`;
});
