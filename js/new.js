async function loadNews() {
	const newsGrid = document.getElementById('newGrid')
	const loadingIndicator = document.createElement('p')
	loadingIndicator.textContent = 'Загрузка новостей...'
	loadingIndicator.classList.add('new__loading')
	newsGrid.appendChild(loadingIndicator)

	try {
		const response = await fetch('./data/news.json')
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`)
		}
		const news = await response.json()

		// Сортируем по дате убывания
		const sortedNews = news.sort((a, b) => new Date(b.date) - new Date(a.date))

		if (sortedNews.length === 0) {
			newsGrid.innerHTML = '<p class="new__empty">Новостей нет.</p>'
			return
		}

		const latestNews = sortedNews.slice(0, 3)
		newsGrid.innerHTML = ''

		latestNews.forEach(item => {
			const newsItem = document.createElement('article')
			newsItem.classList.add('new__item')

			const dateObj = new Date(item.date)
			const day = dateObj.getDate()
			const month = dateObj.toLocaleString('ru', { month: 'long' })

			newsItem.innerHTML = `
        <img class="new__image" src="${item.image}" alt="${item.title}" loading="lazy" />
        <div class="new__date">${day} <br/> ${month}</div>
        <h3 class="new__item-title"><a href="news-page.html?id=${item.id}">${item.title}</a></h3>
        <p class="new__description">${item.preview}</p>
      `
			newsGrid.appendChild(newsItem)
		})
	} catch (error) {
		console.error('Ошибка загрузки новостей:', error)
		newsGrid.innerHTML =
			'<p class="new__error">Не удалось загрузить новости. Пожалуйста, попробуйте позже.</p>'
	} finally {
		const loadingElement = document.querySelector('.new__loading')
		if (loadingElement) {
			loadingElement.remove()
		}

		// Добавляем drag-scroll после загрузки новостей
		setupDragScroll(newsGrid)
	}
}

function setupDragScroll(container) {
	let isDown = false
	let startX
	let scrollLeft

	container.addEventListener('mousedown', e => {
		isDown = true
		container.classList.add('active')
		startX = e.pageX - container.offsetLeft
		scrollLeft = container.scrollLeft
	})

	container.addEventListener('mouseleave', () => {
		isDown = false
		container.classList.remove('active')
	})

	container.addEventListener('mouseup', () => {
		isDown = false
		container.classList.remove('active')
	})

	container.addEventListener('mousemove', e => {
		if (!isDown) return
		e.preventDefault()
		const x = e.pageX - container.offsetLeft
		const walk = (x - startX) * 2
		container.scrollLeft = scrollLeft - walk
	})

	// Поддержка прокрутки колесом мыши по горизонтали
	container.addEventListener(
		'wheel',
		e => {
			if (e.deltaY !== 0) {
				e.preventDefault()
				container.scrollLeft += e.deltaY
			}
		},
		{ passive: false }
	)
}

document.addEventListener('DOMContentLoaded', loadNews)
