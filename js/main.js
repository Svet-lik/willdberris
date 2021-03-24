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
const more = document.querySelector(".more");
const navigationItem = document.querySelector(".navigation-item");
const longGoodsList = document.querySelectorAll(".long-goods-list");

// scroll smooth реализация
{
  for (let i = 0; i < scrollLinks.length; i++) {
    scrollLinks[i].addEventListener("click", (evt) => {
      evt.preventDefault();
      const id = scrollLinks[i].getAttribute("href");
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

getGoods().then;

buttonCart.addEventListener("click", openModal);

modalCart.addEventListener("click", (evt) => {
  const target = evt.target;
  if (
    target.classList.contains("overlay") ||
    target.classList.contains("modal-close")
  )
    closeModal();
});
