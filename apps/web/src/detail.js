const profiles = {
  '碓氷峠 旧道': { distance: '11.2 km', time: '約22分', elevation: '420 m', start: '横川側入口', goal: '軽井沢側入口', rows: [['入口ヘアピン', 'R=25m 目安', '幅員 約5.5m / 離合注意'], ['中盤連続区間', 'R=40–70m 目安', '勾配あり / 見通し注意']] },
  '榛名山・榛名湖線': { distance: '26.7 km', time: '約39分', elevation: '610 m', start: '伊香保温泉側', goal: '榛名湖畔', rows: [['登坂区間', 'R=50–90m 目安', '幅員 約6.0m'], ['湖畔アプローチ', '緩やかなカーブ', '歩行者・自転車に注意']] },
  '赤城南面・県道16号': { distance: '31.2 km', time: '約45分', elevation: '730 m', start: '前橋側入口', goal: '赤城山大沼', rows: [['南面登坂', 'R=35–60m 目安', '幅員 約5.0m / 離合注意']] },
  '奥利根ゆけむり街道': { distance: '12.8 km', time: '約20分', elevation: '280 m', stops: [['道の駅 みなかみ水紀行館', '休憩・軽食'], ['渓谷展望ポイント', '景観 / 駐車可否は現地確認']] },
  '榛名湖パノラマライン': { distance: '27.1 km', time: '約42分', elevation: '510 m', stops: [['榛名湖畔', 'カフェ・散策'], ['湖畔展望台', '眺望 / 駐車場あり']] },
  '赤城高原ルート': { distance: '34.6 km', time: '約52分', elevation: '340 m', stops: [['道の駅 白沢', '休憩・特産品'], ['高原牧場', '季節営業は要確認']] }
};

const detail = document.querySelector('#route-detail');
const windingNames = new Set(['碓氷峠 旧道', '榛名山・榛名湖線', '赤城南面・県道16号']);

export function openDetail(name) {
  const profile = profiles[name];
  if (!profile) return;
  const winding = windingNames.has(name);
  document.querySelector('#detail-kind').textContent = winding ? 'WINDING PROFILE' : 'DRIVE GUIDE';
  document.querySelector('#detail-title').textContent = name;
  document.querySelector('#detail-area').textContent = winding ? '群馬県 / コース情報' : '群馬県 / 寄り道ガイド';
  document.querySelector('#detail-summary').innerHTML = `<div><b>${profile.distance}</b><span>コース長</span></div><div><b>${profile.time}</b><span>目安時間</span></div><div><b>${profile.elevation}</b><span>高低差</span></div>`;
  document.querySelector('#road-profile').innerHTML = winding
    ? `<h3>区間プロフィール</h3><div class="endpoints"><span><b>START</b>${profile.start}</span><i>→</i><span><b>GOAL</b>${profile.goal}</span></div><div class="profile-list">${profile.rows.map(row => `<div><strong>${row[0]}</strong><span>${row[1]}</span><small>${row[2]}</small></div>`).join('')}</div>`
    : '<h3>道の特徴</h3><p class="plain-profile">景色を楽しめるワインディングです。時間と車間に余裕を持ち、気になる場所は安全に駐車できる地点から楽しみましょう。</p>';
  document.querySelector('#stops-profile').innerHTML = winding
    ? '<h3>走行前チェック</h3><p class="plain-profile">通行規制、落石・路面状況、対向車や二輪車に注意。路肩での駐停車やUターンは避けてください。</p>'
    : `<h3>寄り道・休憩</h3><div class="stop-list">${profile.stops.map(stop => `<div><b>${stop[0]}</b><span>${stop[1]}</span></div>`).join('')}</div>`;
  detail.classList.add('open');
  detail.setAttribute('aria-hidden', 'false');
}

function closeDetail() {
  detail.classList.remove('open');
  detail.setAttribute('aria-hidden', 'true');
}

document.querySelector('.detail-close').addEventListener('click', closeDetail);
document.querySelector('.detail-backdrop').addEventListener('click', closeDetail);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeDetail(); });
