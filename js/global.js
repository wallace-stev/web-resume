console.log("IT’S ALIVE!");

function $$(selector, context = document) {
	return Array.from(context.querySelectorAll(selector));
}

// Mobile navigation toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', function () {
	hamburger.classList.toggle('active');
	navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
	link.addEventListener('click', () => {
		hamburger.classList.remove('active');
		navMenu.classList.remove('active');
	});
});

// Close mobile menu when clicking outside
document.addEventListener('click', function (event) {
	const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);

	if (!isClickInsideNav && navMenu.classList.contains('active')) {
		hamburger.classList.remove('active');
		navMenu.classList.remove('active');
	}
});