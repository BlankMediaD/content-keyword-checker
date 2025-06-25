function $(id) { return document.getElementById(id); }

function splitKeywords(text) {
  return text.split(/[\n,]/).map(k => k.trim()).filter(k => k);
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

function readHistory() {
  const data = localStorage.getItem('history');
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function writeHistory(history) {
  localStorage.setItem('history', JSON.stringify(history));
}

function loadHistory() {
  const items = readHistory();
  $('history').innerHTML = '';
  items.forEach(addHistoryItem);
}

$('checkBtn').addEventListener('click', () => {
  const title = $('title').value.trim();
  const keywords = splitKeywords($('keywords').value);
  const content = $('content').value;
  displayResults(keywords, content);
  const history = readHistory();
  history.push({ title, keywords, content, timestamp: Date.now() });
  writeHistory(history);
  loadHistory();
});

$('exportBtn').addEventListener('click', () => {
  const history = readHistory();
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'data.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

$('importBtn').addEventListener('click', () => $('importFile').click());

$('importFile').addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (Array.isArray(data)) {
          writeHistory(data);
          loadHistory();
        } else {
          alert('Invalid file');
        }
      } catch {
        alert('Invalid file');
      }
    };
    reader.readAsText(file);
  }
  e.target.value = '';
});

document.addEventListener('DOMContentLoaded', loadHistory);
