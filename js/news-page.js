async function loadNewsDetail() {
	try {
		const urlParams = new URLSearchParams(window.location.search)
		const newsId = urlParams.get('id')
		const response = await fetch('./data/news.json')
		const news = await response.json()
		const newsItem = news.find(item => item.id == newsId)

		if (newsItem) {
			document.getElementById('newsTitle').textContent = newsItem.title
			document.getElementById('newsImage').src = newsItem.image
			document.getElementById('newsDate').textContent = newsItem.date
			document.getElementById('newsText').innerHTML = newsItem.fullText
		} else {
			document.querySelector('.news-detail').innerHTML =
				'<p>Новость не найдена</p>'
		}

		const otherNews = news.filter(item => item.id != newsId)
		const otherNewsContainer = document.getElementById('otherNews')
		if (otherNewsContainer) {
			let count = 0
			otherNews.forEach(item => {
				if (count < 4) {
					const newsLink = document.createElement('a')
					newsLink.href = `news-page.html?id=${item.id}`
					newsLink.textContent = item.title
					otherNewsContainer.appendChild(newsLink)
				}
				count++
			})
		} else {
			console.error('Элемент с id="otherNews" не найден в DOM')
		}
	} catch (error) {
		console.error('Ошибка загрузки новости:', error)
	}
}

if (window.location.pathname.includes('news-page.html')) {
	document.addEventListener('DOMContentLoaded', () => {
		document.getElementById('newsPage').style.display = 'block'
		loadNewsDetail()
	})
}
