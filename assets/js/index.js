const d = document;
const $showError = d.querySelector('.section-title');
const $template = d.getElementById('template').content;
const $fragment = d.createDocumentFragment();
const $table = d.getElementById('table');
const $btnAllCoins = d.getElementById('allCoins');
const $titleCoins = d.querySelector('.section-title__h2');
const $dateFetch = d.querySelector('.section-title__date');
const $form = d.querySelector('.form-date');

const urls = {
  top20: 'https://rbybi07bj5.execute-api.us-east-1.amazonaws.com/prod/',
  allCoins: 'https://rbybi07bj5.execute-api.us-east-1.amazonaws.com/prod/coins',
  history: 'https://rbybi07bj5.execute-api.us-east-1.amazonaws.com/prod/history'
};

const fetchApi = async (url) => {
  try {
    const res = await fetch(url);
    const json = await res.json();
    const data = json.rates;

    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    data.forEach((item) => {
      $template.querySelector('.moneda').textContent = item.name;
      $template.querySelector('.cod').textContent = item.cod;
      $template.querySelector('.rate').textContent = item.rate;

      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });

    $table.querySelector('tbody').appendChild($fragment);

    $dateFetch.textContent = `Fecha: ${json.date}`;
  } catch (err) {
    let message = err.statusText || 'Ocurrio un error';
    $table.insertAdjacentHTML(
      'afterend',
      `<p><b>Error ${err.status}: ${message}</b></p>`
    );
  }
};

const CleanTable = () => {
  const $parent = $table.querySelector('tbody');
  while ($parent.firstChild) {
    $parent.firstChild.remove();
  }
};

const getCoins = async () => {
  fetchApi(urls.top20);
};

const getAllCoins = async () => {
  CleanTable();
  if ($btnAllCoins.innerText === 'Todas las monedas') {
    fetchApi(urls.allCoins);
    $btnAllCoins.innerText = 'Top 20 monedas';
    $titleCoins.textContent = 'Lista de todas las monedas';
  } else {
    fetchApi(urls.top20);
    $btnAllCoins.innerText = 'Todas las monedas';
    $titleCoins.textContent = 'Top 20 monedas mas valoradas';
  }
};

d.addEventListener('DOMContentLoaded', getCoins);

d.addEventListener('submit', async (e) => {
  if (e.target === $form) {
    e.preventDefault();
    const date = e.target.date.value;
    CleanTable();
    $btnAllCoins.innerText = 'Top 20 monedas';
    $titleCoins.textContent = 'Lista de todas las monedas';
    fetchApi(`${urls.history}?date=${date}`);
  }
});

$btnAllCoins.addEventListener('click', getAllCoins);
