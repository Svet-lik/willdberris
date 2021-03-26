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
// корзина
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');

//получаем данные
const getGoods = async () => {
	const result = await fetch("db/db.json");
	if (!result.ok) {
		throw "Ошибочка вышла: " + result.status;
	}
	return result.json();
};
//open cart
const openModal = () => {
	cart.renderCart();
	modalCart.classList.add("show");
};
//close cart
const closeModal = () => {
	modalCart.classList.remove("show");
};


const cart = {
	cartGoods: [],
	renderCart() {
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({
			id,
			name,
			price,
			count
		}) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;
			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete">x</button></td>
			`
			cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce((sum, item) => {
			return sum + (item.price * item.count);
		}, 0);
		cardTableTotal.textContent = totalPrice + '$';
	},
	//удаляет товар из корзины
	deliteGood(id) {
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},
	// уменьшает количество товара в корзине
	minusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deliteGood(id)
				} else {
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
	},
	// увеличивает количество товара в корзине
	plusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCart();
	},
	// добавляет товар в корзину
	addCartGoods(id) {
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({
					id,
					name,
					price
				}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
				});
		};

	},
}

// scroll smooth реализация
{
	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener("click", evt => {
			evt.preventDefault();
			const id = scrollLink.getAttribute("href");
			document.querySelector(id).scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		});
	}
}

//получаем одну карточку
const createCard = ({
	category,
	description,
	gender,
	id: cardId,
	img,
	label,
	name: goodName,
	price
}) => {
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
	const cards = data.map(createCard); //получает из массива объектов массив элементов вёрстки
	/*cards.forEach(card => {		//добавляет div по очереди
		longGoodsList.append(card);
	}) */
	// вместо этого:
	longGoodsList.append(...cards); //добавляет весь массив сразу

	document.body.classList.add('show-goods');
};

// фильтрует карточки
const filterCards = (field, value) => {
	getGoods()
		.then(data => data.filter(good => good[field] === value))
		.then(renderCards); //и выводит их
};

const showAll = evt => {
	evt.preventDefault();
	getGoods().then(renderCards);
};


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
});
showClothing.forEach(elem => {
	elem.addEventListener('click', evt => {
		evt.preventDefault();
		filterCards('category', 'Clothing');
	})
});

buttonCart.addEventListener("click", openModal);

modalCart.addEventListener("click", (evt) => {
	const target = evt.target;
	if (
		target.classList.contains("overlay") ||
		target.classList.contains("modal-close")
	)
		closeModal();
});

// слушает нажатие на кнопки +/-/удалить в модалке корзины 
cartTableGoods.addEventListener('click', evt => {
	const target = evt.target;
	if (target.tagName === "BUTTON");
	const id = target.closest('.cart-item').dataset.id;
	if (target.classList.contains('cart-btn-delete')) {
		cart.deliteGood(id);
	};
	if (target.classList.contains('cart-btn-minus')) {
		cart.minusGood(id);
	};
	if (target.classList.contains('cart-btn-plus')) {
		cart.plusGood(id);
	};
});

// слушает добавление товара в корзину
document.addEventListener('click', evt => {
	const addToCart = evt.target.closest('.add-to-cart');
	if (addToCart) {
		cart.addCartGoods(addToCart.dataset.id);}
});


// day 4

const modalForm = document.querySelector('.modal-form');
const formInformer = document.querySelector('.form-informer');
const postData = dataUser => fetch('server.php', {
	method: 'POST',
	body: dataUser,
});

modalForm.addEventListener('submit', evt => {
	evt.preventDefault();

	const formData = new FormData(modalForm);
	if (cart.cartGoods.length === 0) {
		formInformer.textContent = 'Сначала наполните корзину';
		formInformer.classList.add('show-info');
		setTimeout(() => {
			closeModal();
			formInformer.classList.remove('show-info');
		}, 1000);
	} else {
		const modaInputs = modalCart.querySelectorAll('.modal-input');
		if (!modaInputs[0].value || !modaInputs[1].value) {
			formInformer.textContent = 'Заполните поля';
			formInformer.classList.add('show-info');
		} else {
			formData.append('order', JSON.stringify(cart.cartGoods));
			postData(formData)
				.then(response => {	//успешно
					if (!response.ok) {
						throw new Error(response.status);
					}
					formInformer.textContent ='Ваш заказ успешно отправлен, с вами свяжутся в ближайшее время';
					console.log(response.statusText);
				})
				.catch(err => { 	// ошибка
					formInformer.textContent = 'К сожалению произошла ошибка, повторите попытку позже';
					console.log(err);
				})
				.finally(() => {	// выполнится в завершении, всегда
					
					formInformer.classList.add('show-info');
					closeModal();
					modalForm.reset();
					cart.cartGoods.length = 0;
					formInformer.classList.remove('show-info');
				})
		}
	}
});