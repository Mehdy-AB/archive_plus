// Lightbox
function openLightbox(img) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  document.getElementById('lightboxImg').src = img.src;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(e) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  if (e.target === lb) {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
}
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  if (e.key === 'Escape') {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Mobile nav
const menuBtn = document.getElementById('menuBtn');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const nav = document.getElementById('navLinks');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    if (nav.style.display === 'flex') {
      Object.assign(nav.style, {
        flexDirection:'column', position:'absolute', top:'68px', left:'0',
        width:'100%', background:'rgba(11,30,53,0.97)', padding:'1.5rem 2rem',
        gap:'0', zIndex:'999', backdropFilter:'blur(12px)'
      });
      nav.querySelectorAll('a').forEach(a => { a.style.lineHeight='3rem'; });
    }
  });
}

// Smooth scroll (ancres internes à une même page)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth' }); }
  });
});

// Formulaire de contact (uniquement présent sur 15-contact.html)
const CONTACT_EMAIL = 'contact@archive-plus.org';

function openMailtoFallback(form) {
  const nom = form.querySelector('[name="nom"]').value;
  const org = form.querySelector('[name="organisation"]').value;
  const email = form.querySelector('[name="email"]').value;
  const message = form.querySelector('[name="message"]').value;
  const subject = encodeURIComponent('Demande ARCHIVE+ - ' + org);
  const body = encodeURIComponent(
    'Nom complet : ' + nom + '\n' +
    'Organisation : ' + org + '\n' +
    'Email professionnel : ' + email + '\n\n' +
    'Message :\n' + message
  );
  window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.form-submit');
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

    fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(res => {
        if (!res.ok) throw new Error('Réponse serveur invalide (' + res.status + ')');
        return res.json();
      })
      .then(() => {
        alert('✅ Merci ! Votre demande a été envoyée à ' + CONTACT_EMAIL + '. Un expert ARCHIVE+ vous contactera sous 48h.');
        form.reset();
      })
      .catch(() => {
        openMailtoFallback(form);
        alert('Votre client de messagerie va s\'ouvrir avec le message pré-rempli vers ' + CONTACT_EMAIL + '. Il ne reste qu\'à cliquer sur "Envoyer".');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      });
  });
}

// Header shrink au scroll
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (header) {
    header.style.boxShadow = window.scrollY > 40 ? '0 4px 24px rgba(0,0,0,0.3)' : 'none';
  }
});
