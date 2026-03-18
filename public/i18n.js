const supportedLangs = ['en', 'hi', 'kn'];
let currentLang = localStorage.getItem('lang') || 'en';

async function loadLanguage(lang) {
    if (!supportedLangs.includes(lang)) lang = 'en';
    
    try {
        const response = await fetch(`/locales/${lang}.xml`);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const strings = xmlDoc.getElementsByTagName('string');
        const translations = {};
        for (let i = 0; i < strings.length; i++) {
            const key = strings[i].getAttribute('name');
            const value = strings[i].textContent;
            translations[key] = value;
        }
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.innerHTML = translations[key];
            }
        });
        
        document.documentElement.lang = lang;
        const selector = document.getElementById('lang-switcher');
        if (selector) selector.value = lang;
        
    } catch (e) {
        console.error("Translation failed", e);
    }
}

window.changeLang = function(lang) {
    localStorage.setItem('lang', lang);
    if (window.location.pathname.startsWith('/course/')) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('lang', lang);
        window.location.search = urlParams.toString();
    } else {
        loadLanguage(lang);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.startsWith('/course/')) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('lang')) {
            currentLang = urlParams.get('lang');
            localStorage.setItem('lang', currentLang);
        }
    }
    loadLanguage(currentLang);
});
