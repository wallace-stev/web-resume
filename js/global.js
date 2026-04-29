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

	// Initialize research search if on research page
	initializeResearchSearch();

	// Initialize research modals if on research page
	initializeResearchModals();
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
		
		// Load contact modal
		const contactResponse = await fetch('components/contact-modal.html');
		const contactHtml = await contactResponse.text();
		modalContainer.innerHTML += contactHtml;
		console.log('Contact modal loaded');

		// Load bibtex modal (research page)
		const bibtexResponse = await fetch('components/bibtex-modal.html');
		if (bibtexResponse.ok) {
			modalContainer.innerHTML += await bibtexResponse.text();
			console.log('Bibtex modal loaded');
		}

		// Load abstract collapse template (research page)
		const abstractCollapseResponse = await fetch('components/abstract-collapse.html');
		if (abstractCollapseResponse.ok) {
			modalContainer.innerHTML += await abstractCollapseResponse.text();
			console.log('Abstract collapse template loaded');
		}
		
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
			
			if (buttonText === 'Contact Me') {
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
	const contactForm = document.getElementById('contactForm');
	
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

// Initialize research interactivity (bibtex modal + abstract collapse)
function initializeResearchModals() {
	const bibtexModal = document.getElementById('bibtexModal');
	if (!bibtexModal && !document.querySelector('.abstract-btn')) return;

	// Bibtex modal
	document.querySelectorAll('.bibtex-btn').forEach(btn => {
		btn.addEventListener('click', function () {
			const data = (window.researchData || {})[this.dataset.id];
			if (data && data.bibtex) {
				document.getElementById('bibtexContent').textContent = data.bibtex;
				openModal('bibtexModal');
			}
		});
	});

	// Abstract collapse — clone template and insert after each button's links row
	const template = document.getElementById('abstractCollapseTemplate');
	document.querySelectorAll('.abstract-btn').forEach((btn, i) => {
		const collapseId = 'abstract-' + (btn.dataset.id || i);
		if (template) {
			const clone = template.content.cloneNode(true).firstElementChild;
			clone.id = collapseId;
			btn.closest('.flex.flex-wrap.items-center').insertAdjacentElement('afterend', clone);
		}
		btn.addEventListener('click', function () {
			const data = (window.researchData || {})[this.dataset.id];
			const collapse = document.getElementById(collapseId);
			const icon = this.querySelector('i');
			if (!collapse || !data || !data.abstract) return;

			const isOpen = collapse.classList.contains('open');
			if (!isOpen) collapse.innerHTML = data.abstract;
			collapse.classList.toggle('open', !isOpen);
			icon && icon.classList.toggle('rotate-180', !isOpen);
		});
	});

	// Copy bibtex
	const copyBtn = document.getElementById('copyBibtexBtn');
	if (copyBtn) {
		copyBtn.addEventListener('click', function () {
			const content = document.getElementById('bibtexContent').textContent;
			navigator.clipboard.writeText(content).then(() => {
				this.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
				setTimeout(() => {
					this.innerHTML = '<i class="fas fa-copy mr-2"></i>Copy';
				}, 2000);
			});
		});
	}
}

// Handle contact form submission
function handleContactForm(e) {
	e.preventDefault();
	
	const formData = new FormData(e.target);
	const data = {
		title: formData.get('title'),
		name: formData.get('name'),
		email: formData.get('email'),
		organization: formData.get('organization'),
		purpose: formData.get('purpose'),
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

// Research search — filters papers by text, category dropdown, and tag pills
function initializeResearchSearch() {
	const searchInput = document.getElementById('search-dropdown');
	const items = $$('[data-paper-id]');
	if (!searchInput || !items.length) return;

	let activeCategory = 'all';
	const activeTags = new Set();

	function normalize(str) {
		return str.toLowerCase();
	}

	function matchesText(item, query) {
		if (!query) return true;
		const haystack = normalize((item.dataset.search || '') + ' ' + (item.textContent || ''));
		const terms = normalize(query).split(/\s+/).filter(Boolean);
		return terms.every(term => haystack.includes(term));
	}

	function applyFilters() {
		const query = searchInput.value.trim();
		let anyVisible = false;

		items.forEach(item => {
			const matchCategory = activeCategory === 'all' || item.dataset.type === activeCategory;
			const itemTags = (item.dataset.tags || '').split(',').map(t => t.trim().toLowerCase());
			const matchTags = activeTags.size === 0 || [...activeTags].every(t => itemTags.includes(t));
			const matchSearch = matchesText(item, query);

			const visible = matchCategory && matchTags && matchSearch;
			item.style.display = visible ? '' : 'none';
			if (visible) anyVisible = true;
		});

		const noResults = document.getElementById('no-results');
		if (noResults) noResults.classList.toggle('hidden', anyVisible);
	}

	// Prevent form submit, search live on input
	searchInput.closest('form').addEventListener('submit', e => e.preventDefault());
	searchInput.addEventListener('input', applyFilters);

	// Category filter pills
	document.querySelectorAll('.category-filter').forEach(btn => {
		btn.addEventListener('click', function () {
			activeCategory = this.dataset.category;
			document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
			this.classList.add('active');
			applyFilters();
		});
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