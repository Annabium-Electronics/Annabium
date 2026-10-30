/* =========================================================
   ANNABIUM INDUSTRIES
   Main JavaScript (FIXED + COMMENTED)

   FUNCTIONS IN THIS FILE (names unchanged):
   - updateThemeIcon()    : sun/moon icon, icon color, header logo
   - toggleLangMenu()     : open/close the language menu
   - selectLang()         : choose a language (flag + text)
   - switchLanguage()     : translate the page (ar / en / fr)
   - initServiceCards()   : fade-in of the service cards
   - toggleFeature()      : open/close a feature card
   - initScrollReveal()   : fade-in of elements with .reveal-on-scroll
   - About-section reveal : fade-in of the About text card
   ========================================================= */


/* =========================================================
   1. MAIN ELEMENTS
   ========================================================= */

const themeBtn = document.getElementById('theme-toggle');
const siteLogo = document.getElementById('site-logo');

/* Key used to remember the chosen theme in the browser.
   CHANGE HERE if you ever need a different storage name. */
const THEME_STORAGE_KEY = 'annabium-theme';


/* =========================================================
   2. START-UP WHEN THE PAGE LOADS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // Draw the Lucide icons (the <i data-lucide="..."> tags).
    // Needs the Lucide <script> tag in index.html, placed BEFORE script.js.
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Restore the theme the visitor chose last time
    try {
        if (localStorage.getItem(THEME_STORAGE_KEY) === 'dark') {
            document.body.classList.add('dark-mode');
        }
    } catch (error) {
        // Storage can be blocked by the browser: ignore and keep the default theme
    }

    // Update sun/moon icon and logo to match the theme
    updateThemeIcon();

});


/* =========================================================
   3. DARK MODE
   ========================================================= */

/**
 * Updates the sun / moon icons, the button color and the header logo.
 * The SVG icons stay in the HTML; we only show/hide them here.
 */
function updateThemeIcon() {

    const btn = document.getElementById('theme-toggle');
    const logo = document.getElementById('site-logo');

    if (!btn) return;

    const isDark = document.body.classList.contains('dark-mode');

    // Find the two SVG icons inside the button
    const sunIcon = btn.querySelector('.sun-icon');
    const moonIcon = btn.querySelector('.moon-icon');

    // Light mode: show the sun / Dark mode: show the moon
    if (sunIcon) {
        sunIcon.style.display = isDark ? 'none' : 'block';
    }

    if (moonIcon) {
        moonIcon.style.display = isDark ? 'block' : 'none';
    }

    // Icon color (CHANGE HERE: dark = yellow, light = gray)
    btn.style.color = isDark ? '#FACC15' : '#64748B';

    // Header logo for the current theme (CHANGE HERE: logo file names)
    if (logo) {
        logo.src = isDark
            ? 'images/logo-dark.png'
            : 'images/logo-light.png';
    }

}


// Click on the dark-mode button
if (themeBtn) {

    themeBtn.addEventListener('click', () => {

        // Switch between light and dark
        document.body.classList.toggle('dark-mode');

        // Remember the choice for the next visit
        try {
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
        } catch (error) {
            // Storage blocked: the theme still works for this visit
        }

        // Update icon and logo
        updateThemeIcon();

    });

}


/* =========================================================
   4. LANGUAGE MENU AND FLAGS
   ========================================================= */

/**
 * Opens / closes the language list.
 */
function toggleLangMenu(event) {

    if (event) {
        event.stopPropagation();
    }

    const optionsList = document.getElementById('langOptionsList');

    if (optionsList) {
        optionsList.classList.toggle('show');
    }

}


/**
 * Chooses a language: updates the flag and the text on the button,
 * closes the menu, then translates the page.
 */
function selectLang(langCode, flagSrc, langText) {

    const btn = document.getElementById('current-lang-btn');

    if (btn) {

        const imgEl = btn.querySelector('img');
        const spanEl = btn.querySelector('span');

        if (imgEl) {
            imgEl.src = flagSrc;
        }

        if (spanEl) {
            spanEl.innerText = langText;
        }

    }

    // Close the language list after choosing
    const optionsList = document.getElementById('langOptionsList');

    if (optionsList) {
        optionsList.classList.remove('show');
    }

    // Translate the website
    switchLanguage(langCode);

}


/**
 * Closes the language list when the visitor clicks outside it.
 */
document.addEventListener('click', (event) => {

    if (!event.target.closest('.custom-lang-dropdown')) {

        const optionsList = document.getElementById('langOptionsList');

        if (optionsList) {
            optionsList.classList.remove('show');
        }

    }

});


/* =========================================================
   5. TRANSLATING THE WEBSITE
   Every translatable element has data-ar / data-en / data-fr.
   - Normal elements: the text is replaced (textContent).
   - Elements that also have the attribute  data-html  keep their
     formatting: <strong> and <br> inside the translation work.
     (Used for the long About paragraph.)
   ========================================================= */

function switchLanguage(lang) {

    // Page direction and language: Arabic = right-to-left
    if (lang === 'ar') {

        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';

    } else {

        document.documentElement.dir = 'ltr';
        document.documentElement.lang = lang;

    }

    // Update all translatable elements
    const elements = document.querySelectorAll('[data-ar]');

    elements.forEach((el) => {

        let translatedText = null;

        if (lang === 'ar') {
            translatedText = el.getAttribute('data-ar');
        } else if (lang === 'en') {
            translatedText = el.getAttribute('data-en');
        } else if (lang === 'fr') {
            translatedText = el.getAttribute('data-fr');
        }

        // If a translation is missing, keep the current text
        if (translatedText === null) return;

        if (el.hasAttribute('data-html')) {
            // Keeps <strong> and <br> (the text is written by you in index.html)
            el.innerHTML = translatedText;
        } else {
            el.textContent = translatedText;
        }

    });

}


/* =========================================================
   6. SERVICE CARDS: APPEAR WHEN SCROLLED INTO VIEW
   ========================================================= */

function initServiceCards() {

    const serviceCards = document.querySelectorAll('.service-card');

    if (serviceCards.length === 0) return;

    // Old browsers without IntersectionObserver: show the cards directly
    if (!('IntersectionObserver' in window)) {

        serviceCards.forEach((card) => {
            card.classList.add('active');
        });

        return;

    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15   // CHANGE HERE: 0.15 = appears when 15% of the card is visible
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                // Show the card
                entry.target.classList.add('active');

                // Stop watching it once it is visible
                observer.unobserve(entry.target);

            }

        });

    }, observerOptions);

    // Start watching every service card
    serviceCards.forEach((card) => {
        cardObserver.observe(card);
    });

}


/* =========================================================
   7. FEATURE CARDS: OPEN / CLOSE
   ========================================================= */

function toggleFeature(headerElement) {

    if (!headerElement) return;

    const card = headerElement.parentElement;

    if (card) {
        card.classList.toggle('active');
    }

}


/* =========================================================
   8. SCROLL REVEAL (elements with the class .reveal-on-scroll)
   ========================================================= */

function initScrollReveal() {

    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (revealElements.length === 0) return;

    const checkScroll = () => {

        // CHANGE HERE: 0.85 = appears when the element reaches 85% of the screen height
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach((el) => {

            const boxTop = el.getBoundingClientRect().top;

            if (boxTop < triggerBottom) {
                el.classList.add('is-visible');
            }

        });

    };

    // Check while scrolling
    window.addEventListener('scroll', checkScroll, {
        passive: true
    });

    // Check once when the page loads
    checkScroll();

}


/* =========================================================
   9. START THE ANIMATIONS WHEN THE PAGE LOADS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // Service cards
    initServiceCards();

    // Elements that appear while scrolling
    initScrollReveal();

});


/* =========================================================
   10. ABOUT SECTION: FADE-IN OF THE TEXT CARD
   How it works with style.css (Section 16.6):
   1) "reveal-ready" hides the card (only when JavaScript works).
   2) "visible" shows it with a smooth fade when the section
      scrolls into view.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    const aboutSection = document.querySelector('#about');

    if (!aboutSection) return;

    // Old browsers: just show everything
    if (!('IntersectionObserver' in window)) {
        aboutSection.classList.add('visible');
        return;
    }

    // Prepare the hidden starting state
    aboutSection.classList.add('reveal-ready');

    const observer = new IntersectionObserver((entries, obs) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                aboutSection.classList.add('visible');
                obs.unobserve(aboutSection);
            }

        });

    }, {
        // CHANGE HERE: 0.1 = starts when 10% of the section is on screen
        // (kept low so tall sections on phones still trigger)
        threshold: 0.1
    });

    observer.observe(aboutSection);

});
