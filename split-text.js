
const tokenizeEl = el => {
  const words = el.innerText.split(' ');
  const fragment = new DocumentFragment();
  words.forEach(word => {
    const span = document.createElement('span');
    span.innerText = word + ' ';
    fragment.appendChild(span);
  });
  return fragment;
};

const getLines = tokenizedEl =>
  Array.from(tokenizedEl.children)
    .reduce((linesMap, token) => ({
        ...linesMap,
        [token.offsetTop]: linesMap[token.offsetTop]
          ? linesMap[token.offsetTop].concat(token.innerText.trim())
          : [token.innerText.trim()],
      }), {});

const getLineElements = linesMap => {
  const fragment = new DocumentFragment();
  Object.keys(linesMap)
    .sort((a, b) => a - b)
    .forEach(key => {
      const div = document.createElement('div');
      div.style.display = 'block';
      div.style.textAlign = 'start';
      div.style.position = 'relative';
      div.innerText = linesMap[key].join(' ');
      fragment.appendChild(div);
    });
  return fragment;
}

const waitForBrowser = async () => {
  return new Promise(resolve => window.setTimeout(resolve, 0));
};

const splitText = async (el) => {
  // store the original text
  const originalText = el.innerText;
  if (!originalText) {
    return;
  }

  const tokens = tokenizeEl(el);
  el.innerText = '';
  el.appendChild(tokens);
  await waitForBrowser();
  const lines = getLineElements(getLines(el));
  el.innerHTML = '';
  el.appendChild(lines);

  // returns a function to revert the split
  return () => {
    el.innerContent = '';
    el.innerText = originalText;
  };
};
