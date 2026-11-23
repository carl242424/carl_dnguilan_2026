export function initProjectCarousels() {
	initLightbox();
	document.querySelectorAll<HTMLElement>('[data-project-carousel]').forEach(initCarousel);
}

function initCarousel(root: HTMLElement) {
	const track = root.querySelector<HTMLElement>('[data-carousel-track]');
	const slides = root.querySelectorAll<HTMLElement>('[data-carousel-slide]');
	const prevBtn = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
	const nextBtn = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
	const dots = root.querySelectorAll<HTMLButtonElement>('[data-carousel-dot]');
	const images = root.querySelectorAll<HTMLButtonElement>('[data-carousel-image]');

	if (!track || slides.length === 0) return;

	let index = 0;
	let autoplayTimer: ReturnType<typeof setInterval> | null = null;
	let touchStartX = 0;
	let touchDeltaX = 0;

	const imagesData = Array.from(images).map((btn) => ({
		src: btn.dataset.src ?? '',
		alt: btn.dataset.alt ?? '',
	}));

	const goTo = (nextIndex: number) => {
		index = (nextIndex + slides.length) % slides.length;
		track.style.transform = `translateX(-${index * 100}%)`;

		dots.forEach((dot, i) => {
			dot.classList.toggle('project-carousel__dot--active', i === index);
			dot.setAttribute('aria-selected', String(i === index));
		});

		slides.forEach((slide, i) => {
			slide.setAttribute('aria-hidden', String(i !== index));
		});

		root.dataset.activeIndex = String(index);
	};

	const next = () => goTo(index + 1);
	const prev = () => goTo(index - 1);

	prevBtn?.addEventListener('click', () => {
		prev();
		resetAutoplay();
	});

	nextBtn?.addEventListener('click', () => {
		next();
		resetAutoplay();
	});

	dots.forEach((dot, i) => {
		dot.addEventListener('click', () => {
			goTo(i);
			resetAutoplay();
		});
	});

	root.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			prev();
			resetAutoplay();
		}
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			next();
			resetAutoplay();
		}
	});

	root.addEventListener(
		'touchstart',
		(event) => {
			touchStartX = event.changedTouches[0]?.clientX ?? 0;
			touchDeltaX = 0;
			stopAutoplay();
		},
		{ passive: true },
	);

	root.addEventListener(
		'touchmove',
		(event) => {
			const currentX = event.changedTouches[0]?.clientX ?? 0;
			touchDeltaX = currentX - touchStartX;
		},
		{ passive: true },
	);

	root.addEventListener(
		'touchend',
		() => {
			if (Math.abs(touchDeltaX) > 50) {
				if (touchDeltaX < 0) next();
				else prev();
			}
			resetAutoplay();
		},
		{ passive: true },
	);

	root.addEventListener('mouseenter', stopAutoplay);
	root.addEventListener('mouseleave', startAutoplay);
	root.addEventListener('focusin', stopAutoplay);
	root.addEventListener('focusout', (event) => {
		if (!root.contains(event.relatedTarget as Node)) startAutoplay();
	});

	images.forEach((btn, i) => {
		btn.addEventListener('click', () => {
			window.openProjectLightbox?.(imagesData, i);
		});
	});

	function startAutoplay() {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		stopAutoplay();
		autoplayTimer = setInterval(next, 4500);
	}

	function stopAutoplay() {
		if (autoplayTimer) {
			clearInterval(autoplayTimer);
			autoplayTimer = null;
		}
	}

	function resetAutoplay() {
		stopAutoplay();
		startAutoplay();
	}

	goTo(0);
	startAutoplay();
}

declare global {
	interface Window {
		openProjectLightbox?: (items: { src: string; alt: string }[], startIndex: number) => void;
	}
}

function initLightbox() {
	if (document.getElementById('project-lightbox')) return;

	const lightbox = document.createElement('div');
	lightbox.id = 'project-lightbox';
	lightbox.className =
		'fixed inset-0 z-[100] hidden items-center justify-center bg-black/90 p-4 backdrop-blur-sm';
	lightbox.setAttribute('role', 'dialog');
	lightbox.setAttribute('aria-modal', 'true');
	lightbox.setAttribute('aria-label', 'Project screenshot gallery');
	lightbox.innerHTML = `
		<button type="button" data-lightbox-close class="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Close gallery">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
		</button>
		<button type="button" data-lightbox-prev class="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Previous image">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
		</button>
		<button type="button" data-lightbox-next class="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Next image">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
		</button>
		<figure class="flex max-h-full max-w-5xl flex-col items-center gap-3">
			<img data-lightbox-image class="max-h-[80vh] w-full rounded-xl object-contain" alt="" />
			<figcaption data-lightbox-caption class="text-center text-sm text-white/80"></figcaption>
		</figure>
	`;

	document.body.appendChild(lightbox);

	const closeBtn = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-close]');
	const prevBtn = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-prev]');
	const nextBtn = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-next]');
	const imageEl = lightbox.querySelector<HTMLImageElement>('[data-lightbox-image]');
	const captionEl = lightbox.querySelector<HTMLElement>('[data-lightbox-caption]');

	let images: { src: string; alt: string }[] = [];
	let current = 0;

	const render = () => {
		const item = images[current];
		if (!item || !imageEl || !captionEl) return;
		imageEl.src = item.src;
		imageEl.alt = item.alt;
		captionEl.textContent = `${current + 1} / ${images.length} — ${item.alt}`;
	};

	const close = () => {
		lightbox.classList.add('hidden');
		lightbox.classList.remove('flex');
		document.body.style.overflow = '';
	};

	const show = (nextIndex: number) => {
		current = (nextIndex + images.length) % images.length;
		render();
	};

	window.openProjectLightbox = (items, startIndex) => {
		images = items;
		current = startIndex;
		render();
		lightbox.classList.remove('hidden');
		lightbox.classList.add('flex');
		document.body.style.overflow = 'hidden';
		closeBtn?.focus();
	};

	closeBtn?.addEventListener('click', close);
	prevBtn?.addEventListener('click', () => show(current - 1));
	nextBtn?.addEventListener('click', () => show(current + 1));

	lightbox.addEventListener('click', (event) => {
		if (event.target === lightbox) close();
	});

	document.addEventListener('keydown', (event) => {
		if (lightbox.classList.contains('hidden')) return;
		if (event.key === 'Escape') close();
		if (event.key === 'ArrowLeft') show(current - 1);
		if (event.key === 'ArrowRight') show(current + 1);
	});
}

export function initProjectAnimations() {
	const cards = document.querySelectorAll<HTMLElement>('[data-project-card]');

	if (!cards.length) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
	);

	cards.forEach((card) => observer.observe(card));
}
