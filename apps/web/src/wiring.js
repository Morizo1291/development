import { openDetail } from './detail.js';

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
mapCard.querySelector('.route-button').addEventListener('click', () => openDetail(mapCard.querySelector('h3').textContent));
document.querySelector('#show-map').addEventListener('click', () => {
  document.querySelector('.map-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
