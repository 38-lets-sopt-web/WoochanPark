export function formatScore(score) {
  return score > 0 ? `+${score}` : `${score}`;
}

export function formatDate(timestamp) {
  const d = new Date(timestamp);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const ampm = d.getHours() < 12 ? '오전' : '오후';
  const hh = String(d.getHours() % 12 || 12).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${ampm} ${hh}.${min}.${ss}`;
}
