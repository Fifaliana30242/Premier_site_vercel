// Année du footer
document.getElementById('year').textContent = new Date().getFullYear();

// Menu mobile
const burger = document.querySelector('.burger'), menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open'); burger.setAttribute('aria-expanded', false);
}));

// Texte qui s'écrit tout seul
const words = ['Génie Logiciel (L2)', 'développement web', 'programmation'];
const el = document.getElementById('typed');
let w = 0, c = 0, del = false;
(function type() {
  const word = words[w];
  el.textContent = word.slice(0, c);
  if (!del && c < word.length) { c++; setTimeout(type, 90); }
  else if (!del) { del = true; setTimeout(type, 1500); }
  else if (c > 0) { c--; setTimeout(type, 45); }
  else { del = false; w = (w + 1) % words.length; setTimeout(type, 300); }
})();

// Apparition au défilement
document.querySelectorAll('.lang,.about,.infos,form').forEach(e => e.classList.add('reveal'));
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) {
    en.target.classList.add('show');
    const s = en.target.querySelector('.bar span');
    if (s) s.style.width = s.dataset.w + '%';
    io.unobserve(en.target);
  }
}), { threshold: .2 });
document.querySelectorAll('.reveal').forEach(e => io.observe(e));

// Formulaire de contact (FormSubmit : envoie le message par email)
const form = document.getElementById('form'), status = document.getElementById('status');
form.addEventListener('submit', async e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle('err', bad); if (bad) ok = false;
  });
  if (!ok) { status.className = 'bad'; status.textContent = 'Merci de remplir correctement tous les champs.'; return; }
  status.className = ''; status.textContent = 'Envoi en cours...';
  try {
    const res = await fetch('https://formsubmit.co/ajax/rahanjanirainy.fif@zircher.edu.mg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: form.name.value, email: form.email.value, message: form.message.value, _subject: 'Nouveau message depuis mon portfolio' })
    });
    if (!res.ok) throw new Error();
    status.className = 'ok'; status.textContent = 'Merci ! Votre message a bien été envoyé.'; form.reset();
  } catch {
    status.className = 'bad'; status.textContent = 'Erreur d’envoi. Écrivez-moi directement par email ou par téléphone.';
  }
});

// Compétences qui défilent sans fin
document.querySelectorAll('.track').forEach(t => {
  const items = t.dataset.items.split(';').map(s => s.split('|'));
  const half = [0, 1, 2].flatMap(() => items);   // une moitié assez longue
  const all = [...half, ...half];                 // doublée pour une boucle sans coupure
  t.innerHTML = all.map(([n, d], i) =>
    `<div class="chip"${i >= half.length ? ' aria-hidden="true"' : ''}><h3>${n}</h3><p>${d}</p></div>`).join('');
});
