// scroll smooth
const smoothScroll = () => {
	const scrollLinks = document.querySelectorAll("a.scroll-link");
	// scroll smooth реализация
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

export default smoothScroll;