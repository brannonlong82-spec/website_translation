/**
 * GHL Custom Website Translation Widget with SVG Flag Icons & RTL Support
 * Author: Brannon Long
 * Description: Self-injecting vanilla JS translation widget featuring real flag images, 
 * full language support, and automatic RTL layout switching.
 */

(function () {
  // 1. Prevent multiple injections on the same page
  if (window.GHLTranslatorLoaded) return;
  window.GHLTranslatorLoaded = true;

  // 2. Inject Scoped CSS Styles for the Widget UI
  const style = document.createElement('style');
  style.innerHTML = `
    #ghl-translate-wrapper {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #ghl-translate-dropdown {
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      border: 1px solid #eaeaea;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-width: 180px;
    }
    .ghl-translate-toggle {
      background: #ffffff;
      border: none;
      padding: 10px 14px;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      outline: none;
      width: 100%;
      text-align: left;
    }
    .ghl-translate-toggle:hover {
      background: #f9fafb;
    }
    .ghl-translate-menu {
      display: none;
      flex-direction: column;
      background: #ffffff;
      border-top: 1px solid #f3f4f6;
      max-height: 250px;
      overflow-y: auto;
    }
    .ghl-translate-menu.active {
      display: flex;
    }
    .ghl-lang-option {
      padding: 9px 14px;
      font-size: 13px;
      color: #4b5563;
      background: transparent;
      border: none;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background 0.2s;
    }
    .ghl-lang-option:hover {
      background: #eff6ff;
      color: #1d4ed8;
    }
    .ghl-flag-icon {
      width: 20px;
      height: 14px;
      object-fit: cover;
      border-radius: 2px;
      box-shadow: 0 0 1px rgba(0,0,0,0.3);
    }
    /* Hide Google's native clutter & banner frames */
    .goog-te-banner-frame, #goog-gt-tt, .goog-tooltip { display: none !important; }
    body { top: 0px !important; }
    #google_translate_element { display: none !important; }
  `;
  document.head.appendChild(style);

  // 3. Create Custom Widget HTML Structure (Reordered: en, es, fr, de, zh-CN, ja, ko, he, ar, ps, fa)
  const wrapper = document.createElement('div');
  wrapper.id = 'ghl-translate-wrapper';
  wrapper.innerHTML = `
    <div id="ghl-translate-dropdown">
      <button class="ghl-translate-toggle" id="ghl-toggle-btn">
        <img class="ghl-flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/us.svg" alt="US Flag"> 
        <span id="ghl-current-lang">English</span>
      </button>
      <div class="ghl-translate-menu" id="ghl-menu">
        <button class="ghl-lang-option" data-lang="en" data-text="English" data-flag="us"><img class="ghl-flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/us.svg"> English</button>
        <button class="ghl-lang-option" data-lang="es" data-text="Español" data-flag="es"><img class="ghl-flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/es.svg"> Español</button>
        <button class="ghl-lang-option" data-lang="fr" data-text="Français" data-flag="fr"><img class="ghl-flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/fr.svg"> Français</button>
        <button class="ghl-lang-option" data-lang="de" data-text="Deutsch" data-flag="de"><img class="ghl-flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/de.svg"> Deutsch</button>
        <button class="ghl-lang-option" data-lang="zh-CN" data-text="中文" data-flag="cn"><img class="ghl-flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/cn.svg"> 中文 (Chinese)</button>
        <button class="ghl-lang-option" data-lang="ja" data-text="日本語" data-flag="jp"><img class="ghl-flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/jp.svg"> 日本語 (Japanese)</button>
        <button class="ghl-lang-option" data-lang="ko" data-text="한국어" data-flag="kr"><img class="ghl-flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/kr.svg"> 한국어 (Korean)</button>
        <button class="ghl-lang-option" data-lang="he" data-text="עברית" data-flag="il"><img class="ghl-flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/il.svg"> עברית (Hebrew)</button>
        <button class="ghl-lang-option" data-lang="ar" data-text="العربية" data-flag="sa"><img class="ghl-flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/sa.svg"> العربية (Arabic)</button>
        <button class="ghl-lang-option" data-lang="ps" data-text="پښتو" data-flag="af"><img class="ghl-flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/af.svg"> پښتو (Pashto)</button>
        <button class="ghl-lang-option" data-lang="fa" data-text="فارسی" data-flag="ir"><img class="ghl-flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/ir.svg"> فارسی (Farsi)</button>
      </div>
    </div>
    <div id="google_translate_element"></div>
  `;
  document.body.appendChild(wrapper);

  // 4. Toggle Menu Visibility & Event Handling
  const toggleBtn = document.getElementById('ghl-toggle-btn');
  const menu = document.getElementById('ghl-menu');
  
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    menu.classList.remove('active');
  });

  // 5. Trigger Google Translate Programmatically
  function triggerGoogleTranslate(langCode) {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    }
  }

  // Handle Language Selection Clicks
  document.querySelectorAll('.ghl-lang-option').forEach(button => {
    button.addEventListener('click', () => {
      const langCode = button.getAttribute('data-lang');
      const langText = button.getAttribute('data-text');
      const flagCountry = button.getAttribute('data-flag');
      
      // Update toggle button text and flag graphic dynamically
      document.getElementById('ghl-current-lang').textContent = langText;
      toggleBtn.querySelector('img').src = `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/${flagCountry}.svg`;
      menu.classList.remove('active');

      // Handle RTL layout adjustment for Right-to-Left languages
      const rtlLanguages = ['ar', 'fa', 'ps', 'he'];
      if (rtlLanguages.includes(langCode)) {
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
      }

      triggerGoogleTranslate(langCode);
    });
  });

  // 6. Initialize Google Translate Engine in the Background
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,zh-CN,ja,ko,he,ar,ps,fa',
        autoDisplay: false,
      },
      'google_translate_element'
    );
  };

  // Asynchronously Load Google's Translation Script
  const script = document.createElement('script');
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);
})();