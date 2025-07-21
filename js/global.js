console.log("IT'S ALIVE!");

function $$(selector, context = document) {
	return Array.from(context.querySelectorAll(selector));
}

// Load header and footer components
async function loadComponent(elementId, componentPath) {
	try {
		const response = await fetch(componentPath);
		const html = await response.text();
		const element = document.getElementById(elementId);
		if (element) {
			element.innerHTML = html;
		}
	} catch (error) {
		console.error(`Error loading component ${componentPath}:`, error);
	}
}

// Load components and set up navigation
document.addEventListener('DOMContentLoaded', async function() {
	// Load header and footer
	await loadComponent('header', 'components/header.html');
	await loadComponent('footer', 'components/footer.html');
	
	// Load modals
	await loadModals();
	
	// Set current page class after header is loaded
	setCurrentPage();
	
	// Initialize mobile navigation after header is loaded
	initializeMobileNav();
	
	// Initialize modal functionality
	initializeModals();
});

// Load modal components
async function loadModals() {
	try {
		console.log('Loading modals...');
		
		// Create container for modals if it doesn't exist
		let modalContainer = document.getElementById('modal-container');
		if (!modalContainer) {
			modalContainer = document.createElement('div');
			modalContainer.id = 'modal-container';
			document.body.appendChild(modalContainer);
			console.log('Created modal container');
		}
		
		// Load CV modal
		const cvResponse = await fetch('components/cv-modal.html');
		const cvHtml = await cvResponse.text();
		modalContainer.innerHTML += cvHtml;
		console.log('CV modal loaded');
		
		// Load contact modal
		const contactResponse = await fetch('components/contact-modal.html');
		const contactHtml = await contactResponse.text();
		modalContainer.innerHTML += contactHtml;
		console.log('Contact modal loaded');
		
	} catch (error) {
		console.error('Error loading modals:', error);
	}
}

// Initialize modal functionality
function initializeModals() {
	// Add debugging
	console.log('Initializing modals...');
	
	// Open modals when buttons are clicked
	document.addEventListener('click', function(e) {
		// Check if clicked element is a link with href="#"
		const link = e.target.closest('a[href="#"]');
		if (link) {
			e.preventDefault();
			const buttonText = link.textContent.trim();
			console.log('Button clicked:', buttonText);
			
			if (buttonText === 'Request CV') {
				console.log('Opening CV modal');
				openModal('cvModal');
			} else if (buttonText === 'Contact Me') {
				console.log('Opening Contact modal');
				openModal('contactModal');
			}
		}
	});
	
	// Close modal functionality
	document.addEventListener('click', function(e) {
		if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
			closeAllModals();
		}
		
		// Close modal when clicking outside
		if (e.target.classList.contains('modal')) {
			closeAllModals();
		}
	});
	
	// Handle form submissions
	const cvForm = document.getElementById('cvRequestForm');
	const contactForm = document.getElementById('contactForm');
	
	if (cvForm) {
		cvForm.addEventListener('submit', handleCvRequest);
	}
	
	if (contactForm) {
		contactForm.addEventListener('submit', handleContactForm);
	}
	
	// Close modals with Escape key
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			closeAllModals();
		}
	});
}

// Open modal
function openModal(modalId) {
	console.log('Attempting to open modal:', modalId);
	const modal = document.getElementById(modalId);
	if (modal) {
		console.log('Modal found, opening...');
		modal.classList.remove('hidden');
		modal.classList.add('flex');
		document.body.style.overflow = 'hidden'; // Prevent background scrolling
	} else {
		console.error('Modal not found:', modalId);
	}
}

// Close all modals
function closeAllModals() {
	const modals = document.querySelectorAll('.modal');
	modals.forEach(modal => {
		modal.classList.add('hidden');
		modal.classList.remove('flex');
	});
	document.body.style.overflow = ''; // Restore scrolling
}

// Handle CV request form submission
function handleCvRequest(e) {
	e.preventDefault();
	
	const formData = new FormData(e.target);
	const data = {
		name: formData.get('name'),
		email: formData.get('email'),
		organization: formData.get('organization'),
		purpose: formData.get('purpose'),
		subscribe: formData.get('subscribe')
	};
	
	// Validate purpose field
	if (!data.purpose || data.purpose.trim() === '') {
		alert('Please select a purpose for your CV request.');
		document.getElementById('cvPurpose').focus();
		return;
	}
	
	// Here you would typically send the data to your backend
	console.log('CV Request:', data);
	
	// Show success message (you can customize this)
	alert('Thank you for your CV request! You will receive it shortly via email.');
	
	// Close modal and reset form
	closeAllModals();
	e.target.reset();
}

// Handle contact form submission
function handleContactForm(e) {
	e.preventDefault();
	
	const formData = new FormData(e.target);
	const data = {
		name: formData.get('name'),
		email: formData.get('email'),
		subject: formData.get('subject'),
		message: formData.get('message'),
		subscribe: formData.get('subscribe')
	};
	
	// Here you would typically send the data to your backend
	console.log('Contact Form:', data);
	
	// Show success message (you can customize this)
	alert('Thank you for your message! I will get back to you soon.');
	
	// Close modal and reset form
	closeAllModals();
	e.target.reset();
}

// Set current page class based on current URL
function setCurrentPage() {
	const currentPage = window.location.pathname.split('/').pop() || 'index.html';
	const navLinks = document.querySelectorAll('.nav-menu a');
	
	navLinks.forEach(link => {
		const linkPage = link.getAttribute('href');
		if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
			link.classList.add('current');
		}
	});
}

// Initialize mobile navigation functionality
function initializeMobileNav() {
	const hamburger = document.getElementById('hamburger');
	const navMenu = document.getElementById('navMenu');
	
	if (!hamburger || !navMenu) return;

	// Mobile navigation toggle
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
}