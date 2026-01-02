document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';

            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('is-open');

            // Animate hamburger to X (optional simple CSS handling would be better, but staying distinct here)
            mobileToggle.classList.toggle('is-active');
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Smooth Scroll Offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // AJAX Form Submission
    const contactForm = document.querySelector('form[name="contact"]');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'Wysyłanie...';

            const formData = new FormData(contactForm);

            fetch('https://panikredyt.netlify.app/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
                .then(response => {
                    if (response.ok) {
                        showNotification('Dziękuję! Skontaktuję się z Tobą wkrótce.', 'success');
                        contactForm.reset();
                    } else {
                        showNotification('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie później.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Form submission error:', error);
                    showNotification('Wystąpił błąd połączenia. Sprawdź internet i spróbuj ponownie.', 'error');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                });
        });
    }

    // Notification Helper
    function showNotification(message, type) {
        // Remove existing notification if any
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerText = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('is-visible'), 10);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('is-visible');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    console.log('Pani Kredyt website loaded successfully.');
});
