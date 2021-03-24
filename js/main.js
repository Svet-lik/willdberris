const mySwiper = new Swiper(".swiper-container", {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: ".slider-button-next",
		prevEl: ".slider-button-prev"
	}
});

//cart

const buttonCart = document.querySelector(".button-cart");
const modalCart = document.querySelector("#modal-cart");

// scroll smooth
const scrollLinks = document.querySelectorAll("a.scroll-link");
//goods
const longGoodsList = document.querySelector(".long-goods-list");
const viewAll = document.querySelectorAll(".view-all");
const navigationLinks = document.querySelectorAll(".navigation-link:not(.view-all)");
const showAcsessories = document.querySelectorAll('.show-acsessories');
const showClothing = document.querySelectorAll('.show-clothing');

// scroll smooth реализация
{
	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener("click", (evt) => {
			evt.preventDefault();
			const id = scrollLink.getAttribute("href");
			document.querySelector(id).scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		});
	}
}

//open cart
const openModal = () => {
	modalCart.classList.add("show");
};
//close cart
const closeModal = () => {
	modalCart.classList.remove("show");
};

//получаем данные
const getGoods = async () => {
	const result = await fetch("db/db.json");
	if (!result.ok) {
		throw "Ошибочка вышла: " + result.status;
	}
	return result.json();
};

//получаем одну карточку
const createCard = ({ category, description, gender, id:cardId, img, label, name: goodName, price }) => {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';
	card.innerHTML = `
		<div class="goods-card">
			${ label ? `<span class="label">${label}</span>` : ''}			
			<img src="db/${img}" alt="image: ${goodName}" class="goods-image">
			<h3 class="goods-title">${goodName}</h3>
			<p class="goods-description">${description}</p>
			<button class="button goods-card-btn add-to-cart" data-id="${cardId}">
				<span class="button-price">$${price}</span>
			</button>
		</div>`;
	return card;
};

//выводит карточки на страницу
const renderCards = data => {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);	//получает из массива объектов массив элементов вёрстки
	/*cards.forEach(card => {		//добавляет div по очереди
		longGoodsList.append(card);
	}) */ 
	// вместо этого:
	longGoodsList.append(...cards);	//добавляет весь массив сразу

	document.body.classList.add('show-goods');
};

// фильтрует сарточки
const filterCards = (field, value) => {
	getGoods()
		.then(data => {
			const filteredGoods = data.filter(good => {
				return good[field] === value
			});
			return filteredGoods;
		})
		.then(renderCards);			//и выводит их
};

const showAll = evt=> {
	evt.preventDefault();
	getGoods().then(renderCards);
};

buttonCart.addEventListener("click", openModal);

modalCart.addEventListener("click", (evt) => {
	const target = evt.target;
	if (
		target.classList.contains("overlay") ||
		target.classList.contains("modal-close")
	)
		closeModal();
});

viewAll.forEach(elem => {
	elem.addEventListener('click', showAll);
})


navigationLinks.forEach(link => {
	link.addEventListener('click', evt => {
		evt.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	})
});

showAcsessories.forEach(elem => {
elem.addEventListener('click', evt => {
	evt.preventDefault();
	filterCards('category', 'Accessories');
})
})
showClothing.forEach(elem => {
	elem.addEventListener('click', evt => {
		evt.preventDefault();
		filterCards('category', 'Clothing');
})
})