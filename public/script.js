function $(id) {
  return document.getElementById(id);
}

function splitKeywords(text) {
  return text.split(/[\n,]/).map(k => k.trim()).filter(Boolean);
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
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = k;
    li.style.color = lowerContent.includes(k.toLowerCase()) ? 'green' : 'red';
    list.appendChild(li);
  });
  $('highlighted').innerHTML = highlightContent(content, keywords);
}

function getStored() {
  try {
    return JSON.parse(localStorage.getItem('checks') || '[]');
  } catch (e) {
    return [];
  }
}

function saveStored(data) {
  localStorage.setItem('checks', JSON.stringify(data));
}

function saveEntry(entry) {
  const data = getStored();
  data.push(entry);
  saveStored(data);
}

function loadHistory() {
  const items = getStored();
  $('history').innerHTML = '';
  items.forEach(addHistoryItem);
}

function exportData() {
  const data = localStorage.getItem('checks') || '[]';
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData(evt) {
  const file = evt.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const items = JSON.parse(e.target.result);
      if (Array.isArray(items)) {
        saveStored(items);
        loadHistory();
      } else {
        alert('Invalid data');
      }
    } catch (err) {
      alert('Invalid JSON');
    }
  };
  reader.readAsText(file);
}

$('checkBtn').addEventListener('click', () => {
  const title = $('title').value.trim();
  const keywords = splitKeywords($('keywords').value);
  const content = $('content').value;
  displayResults(keywords, content);
  saveEntry({ title, keywords, content, timestamp: Date.now() });
  loadHistory();
});

$('exportBtn').addEventListener('click', exportData);
$('importFile').addEventListener('change', importData);

document.addEventListener('DOMContentLoaded', loadHistory);
