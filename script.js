const newsPerPage = 6;
let currentPage = 1;

function getNewsFromStorage() {
  const storedNews = localStorage.getItem('news');
  return storedNews ? JSON.parse(storedNews) : [];
}

function getYouTubeID(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function renderNews() {
  let newsItems = getNewsFromStorage();

  // Ordenar do mais recente para o mais antigo (data decrescente)
  newsItems.sort((a, b) => new Date(b.date) - new Date(a.date));

  const container = document.getElementById('news-container');
  container.innerHTML = '';

  if (newsItems.length === 0) {
    container.innerHTML = '<p class="text-center">Nenhuma notícia disponível no momento.</p>';
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  const start = (currentPage - 1) * newsPerPage;
  const end = start + newsPerPage;
  const visibleNews = newsItems.slice(start, end);

  visibleNews.forEach((news) => {
    const dateOnly = news.date ? new Date(news.date).toLocaleDateString('pt-BR') : '';
    const imageSrc = news.image || 'images/sem-imagem.png';

    const mediaHTML = `<img src="${imageSrc}" alt="Imagem da notícia" class="card-img-top" style="object-fit: cover; width: 420px; height: 260px;">`;

    container.innerHTML += `
      <div class="col-md-4">
	  <a href="noticia.html?id=${news.id}" class="text-decoration-none text-dark">
		<div class="news-card h-100">
		  ${mediaHTML}
		  <div class="news-body">
			<div class="news-meta">${news.type} · ${dateOnly}</div>
			<h5 class="news-title">${news.title}</h5>
			<p class="text-dark">${news.subtitle || ''}</p>
		  </div>
		</div>
	  </a>
	</div>
    `;
  });
}

function renderPagination() {
  const newsItems = getNewsFromStorage();
  const totalPages = Math.ceil(newsItems.length / newsPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  if (totalPages === 0) return;

  const prev = document.createElement('li');
  prev.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  prev.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
  prev.onclick = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      updateView();
    }
  };
  pagination.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const page = document.createElement('li');
    page.className = `page-item ${currentPage === i ? 'active' : ''}`;
    page.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    page.onclick = (e) => {
      e.preventDefault();
      currentPage = i;
      updateView();
    };
    pagination.appendChild(page);
  }

  const next = document.createElement('li');
  next.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  next.innerHTML = `<a class="page-link" href="#">Próximo</a>`;
  next.onclick = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      updateView();
    }
  };
  pagination.appendChild(next);
}

function updateView() {
  renderNews();
  renderPagination();
}

document.addEventListener('DOMContentLoaded', updateView);