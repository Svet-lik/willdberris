import smoothScroll from './modules/smoothScroll.js';

smoothScroll();

const mySwiper = new Swiper(".swiper-container", {
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev"
  }
});

const buttonCart = document.querySelector(".button-cart");
const modalCart = document.querySelector("#modal-cart");
const longGoodsList = document.querySelector(".long-goods-list");
const viewAll = document.querySelectorAll(".view-all");
const navigationLinks = document.querySelectorAll(".navigation-link:not(.view-all)");
const showAcsessories = document.querySelectorAll('.show-acsessories');
const showClothing = document.querySelectorAll('.show-clothing');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');
const cartCount = document.querySelector('.cart-count');
const btnClear = document.querySelector('.btn-clear');
const modaInputs = modalCart.querySelectorAll('.modal-input');
const modalForm = document.querySelector('.modal-form');
const formInformer = document.querySelector('.form-informer');

//получаем данные один раз
const checkGoods = () => {
  const data = [];

  return async () => {
    if (data.length) return data;

    const result = await fetch("db/db.json");
    if (!result.ok) {
      throw "Ошибочка вышла: " + result.status;
    }
    data.push(...(await result.json()));
    return data;
  };
};

const getGoods = checkGoods();

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
  cartGoods:  JSON.parse(localStorage.getItem('cartWilb')) || [],
  updateLocalStorage() {
    localStorage.setItem('cartWilb', JSON.stringify(this.cartGoods));
  },
  getCountCartGoods() {
    return this.cartGoods.length
  },
  countQuantity() { //считает количество товара в корзине
    const count = cartCount.textContent = this.cartGoods.reduce((sum, item) => {
      return sum + item.count
    }, 0);
    cartCount.textContent = count ? count : '';
    this.updateLocalStorage();
  },
  clearCart() { //очищает корзину
    this.cartGoods.length = 0;
    this.countQuantity();
    this.renderCart();
    closeModal();
  },
  renderCart() { //рисует 1 позицию в корзине
    let flagGoods = false;
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
    flagGoods = !this.getCountCartGoods();
    modaInputs.forEach(item => {
      item.disabled = flagGoods;
    });
    if (flagGoods) {
      btnClear.classList.remove('show');
      setTimeout(() => {
        formInformer.classList.remove('show-info');
        closeModal();
      }, 500);
    } else {
      btnClear.classList.add('show')
    };
    const totalPrice = this.cartGoods.reduce((sum, item) => {
      return sum + (item.price * item.count);
    }, 0);
    cardTableTotal.textContent = totalPrice + '$';
  },
  //удаляет товар из корзины
  deliteGood(id) {
    this.cartGoods = this.cartGoods.filter(item => id !== item.id);
    this.countQuantity();
    this.renderCart();
  },
  // уменьшает количество товара в корзине
  minusGood(id) {
    for (const item of this.cartGoods) {
      if (item.id === id) {
        item.count--;
        if (!item.count) this.deliteGood(id);
        break;
      }
    }
    this.countQuantity();
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
    this.countQuantity();
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
          this.countQuantity();
        });
    };
  },
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
    cart.addCartGoods(addToCart.dataset.id);
  }
});


const validForm = (formData) => {
  let valid = false;
  for (const [, value] of formData) {
    if (value.trim()) {
      valid = true;
    } else {
      valid = false;
      break;
    }
  }
  return valid;
}

const postData = dataUser => fetch('./server.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: dataUser,
});

modalForm.addEventListener('submit', evt => {
  evt.preventDefault();

  const formData = new FormData(modalForm);
  if (!cart.getCountCartGoods()) { //пустая корзина
    formInformer.textContent = 'Сначала наполните корзину';
    formInformer.classList.add('show-info');
    setTimeout(() => {
      closeModal();
      formInformer.classList.remove('show-info');
    }, 1000);
  } else {
    if (!validForm(formData)) { //не заполнили поля "Имя" и/или "Телефон"
      formInformer.textContent = 'Заполните поля';
      formInformer.classList.add('show-info');
    } else { //корзина есть и поля заполнены
      const data = {};

      for (const [name, value] of formData) { //обрабатываем данные
        data[name] = value;
      }
      data.cart = cart.cartGoods;
      console.log(JSON.stringify(data));

      // formData.append('order', JSON.stringify(cart.cartGoods)); //если данные не обработаны, то отправляем так
      postData(JSON.stringify(data)) //    postData(formData)
        .then(response => { //успешно
          if (!response.ok) {
            throw new Error(response.status);
          }
          formInformer.textContent = 'Ваш заказ успешно отправлен, с вами свяжутся в ближайшее время';
          console.log(response.statusText);
        })
        .catch(err => { // ошибка
          formInformer.textContent = 'К сожалению произошла ошибка, повторите попытку позже';
          console.log(err);
        })
        .finally(() => { // выполнится в завершении, всегда

          formInformer.classList.add('show-info');
          setTimeout(() => {
            closeModal();
            modalForm.reset();
            cart.clearCart();
            formInformer.classList.remove('show-info');
          }, 1000);
        })
    }
  }
});

btnClear.addEventListener('click', cart.clearCart.bind(cart)); // bind передаёт вызывающий объект

cart.countQuantity();