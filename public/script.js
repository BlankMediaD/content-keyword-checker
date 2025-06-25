function $(id) { return document.getElementById(id); }

function splitKeywords(text) {
  return text.split(/[,\n]/).map(k => k.trim()).filter(k => k);
}

function highlightContent(content, keywords) {
  let highlighted = content;
  keywords.forEach(k => {
    const regex = new RegExp('(\\b' + k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b)', 'gi');
    highlighted = highlighted.replace(regex, '<span class="highlight">$1</span>');
  });
  return highlighted;
}

function addHistoryItem(item) {
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.textContent = `${item.title} - ${new Date(item.timestamp).toLocaleString()}`;
  li.addEventListener('click', () => {
    $('title').value = item.title;
    $('keywords').value = item.keywords.join(', ');
    $('content').value = item.content;
    displayResults(item.keywords, item.content);
  });
  $('history').appendChild(li);
}

function displayResults(keywords, content) {
  const list = $('resultList');
  list.innerHTML = '';
  const lowerContent = content.toLowerCase();
  keywords.forEach(k => {
    const found = lowerContent.includes(k.toLowerCase());
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = k;
    li.style.color = found ? 'green' : 'red';
    list.appendChild(li);
  });
  $('highlighted').innerHTML = highlightContent(content, keywords);
}

$('checkBtn').addEventListener('click', () => {
  const title = $('title').value.trim();
  const keywords = splitKeywords($('keywords').value);
  const content = $('content').value;
  displayResults(keywords, content);
  fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, keywords, content, timestamp: Date.now() })
  }).then(() => loadHistory());
});

function loadHistory() {
  fetch('/data')
    .then(r => r.json())
    .then(items => {
      $('history').innerHTML = '';
      items.forEach(addHistoryItem);
    });
}

document.addEventListener('DOMContentLoaded', loadHistory);
