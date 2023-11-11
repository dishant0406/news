window.onload = function () {
  var shadowRoot = document.querySelector('spline-viewer').shadowRoot;
  shadowRoot.querySelector('#logo').remove();
}

const selectNews = (event) => {
  event.preventDefault();

  window.location.href = 'select-news.html';
}