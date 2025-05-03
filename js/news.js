async function loadNews() {
	try {
			const response = await fetch('./data/news.json');
			if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const news = await response.json();
			return news.sort((a, b) => new Date(b.date) - new Date(a.date));
	} catch (error) {
			console.error('Ошибка загрузки новостей:', error);
			const newsGrid = document.getElementById('newsGrid');
			newsGrid.innerHTML = '<p>Не удалось загрузить новости. Пожалуйста, попробуйте позже.</p>';
			return [];
	}
}

function renderNews(news) {
	const newsGrid = document.getElementById('newsGrid');
	newsGrid.innerHTML = '';

	news.forEach(item => {
			const newsItem = document.createElement('div');
			newsItem.classList.add('news__item');
			
			const dateObj = new Date(item.date);
			const day = dateObj.getDate();
			const month = dateObj.toLocaleString('ru', { month: 'long' });
			
			newsItem.innerHTML = `
					<img src="${item.image}" alt="${item.title}" data-id="${item.id}" />
					<p class="news__date">${day} <br/> ${month}</p>
					<p class="news__title">${item.title}</p>
			`;
			newsGrid.appendChild(newsItem);
	});

	document.querySelectorAll('.news__item img').forEach(img => {
			img.addEventListener('click', () => {
					const newsId = img.getAttribute('data-id');
					window.location.href = `news-page.html?id=${newsId}`;
			});
	});
}

async function init() {
	const news = await loadNews();
	let filteredNews = news;

	const searchInput = document.getElementById('searchInput');
	const categoryFilter = document.getElementById('categoryFilter');

	function updateNews() {
			const searchTerm = searchInput.value.toLowerCase();
			const selectedCategory = categoryFilter.value;

			filteredNews = news.filter(item => {
					const matchesSearch = item.title.toLowerCase().includes(searchTerm);
					const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
					return matchesSearch && matchesCategory;
			});

			renderNews(filteredNews);
	}

	searchInput.addEventListener('input', updateNews);
	categoryFilter.addEventListener('change', updateNews);

	renderNews(news);
}

document.addEventListener('DOMContentLoaded', init);