async function loadTickets() {
	try {
		const response = await fetch('./data/events.json')
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`)
		}
		const data = await response.json()
		const tickets = data.events
		return tickets.sort((a, b) => new Date(b.date) - new Date(a.date))
	} catch (error) {
		console.error('Ошибка загрузки билетов:', error)
		const ticketsGrid = document.getElementById('ticketsGrid')
		ticketsGrid.innerHTML =
			'<p>Не удалось загрузить билеты. Пожалуйста, попробуйте позже.</p>'
		return []
	}
}

function renderTickets(tickets) {
	const ticketsGrid = document.getElementById('ticketsGrid')
	ticketsGrid.innerHTML = ''

	tickets.forEach(ticket => {
		const ticketItem = document.createElement('div')
		ticketItem.classList.add('tickets__item')

		const dateObj = new Date(ticket.date)
		const day = dateObj.getDate()
		const month = dateObj.toLocaleString('ru', { month: 'long' })

		ticketItem.innerHTML = `
					<div class="direction">
							<img src="${ticket.image}" alt="${ticket.title}" />
							<div class="text-direction">
									<div class="top">
											<p class="tickets__title">${ticket.title}</p>
											<div class="types">
													${ticket.type ? `<p class="tickets__type">${ticket.type}</p>` : ''}
													${ticket.age ? `<p class="tickets__age">${ticket.age}</p>` : ''}
											</div>
									</div>
									<div class="bott">
											<div class="date">
													<p class="tickets__date">${day} ${month}</p>
													<p class="tickets__time">${ticket.time}</p>
											</div>
											${ticket.price ? `<p class="tickets__price">Цена: ${ticket.price}</p>` : ''}
									</div>
							</div>
					</div>
					<button class="tickets__buy">Забронировать билет</button>
			`

		// Добавляем карточку в сетку
		ticketsGrid.appendChild(ticketItem)

		// Находим изображение внутри карточки
		const img = ticketItem.querySelector('img')
		if (img) {
			// Добавляем обработчик клика
			;(img || button).addEventListener('click', () => {
				// Кодируем название спектакля для URL
				const encodedTitle = encodeURIComponent(ticket.title)
				// Переходим на страницу с подробностями
				window.location.href = `events-page.html?title=${encodedTitle}`
			})
		}
	})

	// Обработчик для кнопок "Забронировать билет"
	document.querySelector('.tickets__buy').forEach(button => {
		// Кодируем название спектакля для URL
		const encodedTitle = encodeURIComponent(ticket.title)
		// Переходим на страницу с подробностями
		window.location.href = `events-page.html?title=${encodedTitle}`
	})
}

async function init() {
	const tickets = await loadTickets()
	let filteredTickets = tickets

	const searchInput = document.getElementById('searchInput')
	const categoryFilter = document.getElementById('categoryFilter')

	function updateTickets() {
		const searchTerm = searchInput.value.toLowerCase()
		const selectedCategory = categoryFilter.value

		filteredTickets = tickets.filter(ticket => {
			const matchesSearch = ticket.title.toLowerCase().includes(searchTerm)
			const matchesCategory = selectedCategory
				? ticket.type === selectedCategory
				: true
			return matchesSearch && matchesCategory
		})

		renderTickets(filteredTickets)
	}

	searchInput.addEventListener('input', updateTickets)
	categoryFilter.addEventListener('change', updateTickets)

	renderTickets(tickets)
}

document.addEventListener('DOMContentLoaded', init)
