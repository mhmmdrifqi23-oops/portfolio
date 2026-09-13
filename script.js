(function(){
"use strict";
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Footer year ---------- */
 $('#year').textContent = new Date().getFullYear();

/* ---------- Navbar / back-to-top ---------- */
const navbar = $('#navbar'), toTop = $('#toTop'), navLinks = $('#navLinks'), burger = $('#hamburger');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 12);
  toTop.classList.toggle('show', window.scrollY > 650);
};
window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});
 $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded','false');
}));
toTop.addEventListener('click', () => window.scrollTo({top:0, behavior: REDUCED ? 'auto' : 'smooth'}));

/* ---------- Scroll spy ---------- */
const spyLinks = $$('.nav-links a[href^="#"]');
const spySections = spyLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
const spy = new IntersectionObserver(es => {
  es.forEach(e => {
    if(e.isIntersecting){
      spyLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, {rootMargin:'-45% 0px -50% 0px'});
spySections.forEach(s => spy.observe(s));

/* ---------- Scroll reveal ---------- */
const revIO = new IntersectionObserver(es => {
  es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); revIO.unobserve(e.target); } });
}, {threshold:.12, rootMargin:'0px 0px -30px 0px'});
 $$('.reveal').forEach(el => REDUCED ? el.classList.add('in') : revIO.observe(el));

/* ---------- Animated counters ---------- */
const ease = t => 1 - Math.pow(1 - t, 3);
function countUp(el){
  const target = +el.dataset.count, suffix = el.dataset.suffix || '';
  if(REDUCED){ el.textContent = target + suffix; return; }
  const t0 = performance.now(), dur = 1500;
  (function frame(t){
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(target * ease(p)) + suffix;
    if(p < 1) requestAnimationFrame(frame);
  })(t0);
}
const cntIO = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting){ countUp(e.target); cntIO.unobserve(e.target); }
}), {threshold:.5});
 $$('.stat-num').forEach(el => cntIO.observe(el));

/* ---------- Hero typewriter subtitle ---------- */
const roles = ['Administrator Jaringan & Server', 'Otomasi Industri — Cobot & PLC', 'Web Server & Pengembangan Web'];
const typedEl = $('#typed'), typedCursor = $('#typedCursor');
if(REDUCED){
  typedEl.textContent = roles[0];
  typedCursor.style.display = 'none';
} else {
  let ri = 0, ci = 0, del = false;
  (function tick(){
    const word = roles[ri];
    ci += del ? -1 : 1;
    typedEl.textContent = word.slice(0, ci);
    let d = del ? 30 : 62;
    if(!del && ci === word.length){ d = 2300; del = true; }
    else if(del && ci === 0){ del = false; ri = (ri + 1) % roles.length; d = 420; }
    setTimeout(tick, d);
  })();
}

/* ---------- Terminal typing animation ---------- */
const termBody = $('#termBody');
const PROMPT = '<span class="t-user">rifqi@debian</span><span class="t-c">:</span><span class="t-path">~</span><span class="t-c">$ </span>';
const STEPS = [
  { cmd:'whoami', out:[
      ['muhammad-rifqi','d'],
      ['Siswa TKJ — SMK PGRI 20 Jakarta · Jakarta Timur','d'] ]},
  { cmd:'sudo systemctl status apache2 --no-pager', out:[
      ['● apache2.service — The Apache HTTP Server','w'],
      ['   Active: active (running) — sejak boot ✓','g'],
      ['   Apache2 · BIND9 · MariaDB · ProFTPD · Squid — terpasang','d'] ]},
  { cmd:'/interface vlan add name=vlan10 vlan-id=10', out:[
      ['VLAN 10 aktif — Routing · DHCP · Firewall · Hotspot ✓','g'] ]},
  { cmd:'./lexium_cobot --load e_time_pnj_2026.arm', out:[
      ['Memuat program Collaborative Robot (Schneider Electric)...','d'],
      ['Sequence siap dijalankan — presisi tinggi ✓','g'],
      ['★ E-Time PNJ 2026 — Juara 2 Tingkat Nasional','y'] ]},
  { cmd:'echo "Mari berkolaborasi!"', out:[
      ['Mari berkolaborasi! — muhammad.rifqi2376@gmail.com','b'] ]}
];
function outLine(text, cls){
  const o = document.createElement('div');
  o.className = 'term-out t-' + cls;
  o.textContent = text;
  termBody.appendChild(o);
  termBody.scrollTop = termBody.scrollHeight;
}
async function runTerminal(){
  termBody.innerHTML = '';
  for(const st of STEPS){
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = PROMPT + '<span class="t-cmd"></span><span class="t-cursor"></span>';
    termBody.appendChild(line);
    const cmdSpan = line.querySelector('.t-cmd');
    if(REDUCED){
      cmdSpan.textContent = st.cmd;
      line.querySelector('.t-cursor').remove();
    } else {
      for(const ch of st.cmd){ cmdSpan.textContent += ch; await sleep(24 + Math.random()*34); }
      await sleep(300);
      line.querySelector('.t-cursor').remove();
    }
    for(const [txt, cls] of st.out){
      outLine(txt, cls);
      if(!REDUCED) await sleep(150);
    }
    if(!REDUCED) await sleep(500);
  }
  if(!REDUCED){ await sleep(4500); runTerminal(); }
}
runTerminal();

/* ============================================================
   ★★★  DOKUMENTASI — TAMBAH / PERBARUI ENTRI DI SINI  ★★★
   ------------------------------------------------------------
   Cara memposting dokumentasi baru (foto / video):
   1. Salin salah satu objek di dalam DOCS di bawah ini.
   2. Isi propertinya:
      • type     : "photo" (foto)  atau  "video"
      • category : salah satu dari:
                   "Jaringan & Server" | "Otomasi & Robotika" |
                   "Pengembangan Web"  | "Kegiatan & Prestasi"
      • title    : judul dokumentasi
      • date     : format "YYYY-MM-DD" (tampil otomatis dlm format Indonesia)
      • desc     : deskripsi singkat (1–2 kalimat)
      • thumb    : gambar thumbnail kartu (disarankan rasio 16:10)
      • image    : gambar besar — WAJIB untuk type "photo"
      • video    : WAJIB untuk type "video", bisa berupa:
                   - file video : "video/nama-video.mp4"
                   - YouTube    : "https://www.youtube.com/watch?v=ID_VIDEO"
   3. Taruh entri TERBARU di posisi PALING ATAS daftar.
   ============================================================ */
const DOCS = [
  {
    type: "photo",
    category: "Otomasi & Robotika",
    title: "Pemrograman Collaborative Robot — E-Time PNJ 2026",
    date: "2026-07-09",
    desc: "Memprogram Lexium Cobot Schneider Electric secara presisi untuk tantangan otomatisasi tingkat lanjut — raih Juara 2 Tingkat Nasional.",
    thumb: "https://picsum.photos/seed/cobot-pnj/800/500.jpg",
    image: "https://picsum.photos/seed/cobot-pnj/1200/800.jpg"
  },
  {
    type: "video",
    category: "Jaringan & Server",
    title: "Simulasi Arsitektur Jaringan — MikroTik & VoIP",
    date: "2026-01-12",
    desc: "Perancangan jaringan lokal dengan Routing, VLAN, DHCP, Firewall, dan Hotspot pada perangkat MikroTik, dilengkapi simulasi VoIP di Cisco Packet Tracer.",
    thumb: "https://picsum.photos/seed/mikrotik-voip/800/500.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    type: "photo",
    category: "Pengembangan Web",
    title: "Website Dinamis + Sistem Autentikasi",
    date: "2025-12-18",
    desc: "Halaman Sign Up & Sign In yang terhubung dengan basis data phpMyAdmin — bagian dari proyek administrasi server & pengembangan web.",
    thumb: "https://picsum.photos/seed/web-auth/800/500.jpg",
    image: "https://picsum.photos/seed/web-auth/1200/800.jpg"
  },
  {
    type: "photo",
    category: "Kegiatan & Prestasi",
    title: "Juara 2 — Student Skill Competition (SSC)",
    date: "2025-12-10",
    desc: "Bidang Web Server Administration: konfigurasi sistem operasi server, paket web server Apache2, hingga integrasi basis data phpMyAdmin.",
    thumb: "https://picsum.photos/seed/ssc-2025/800/500.jpg",
    image: "https://picsum.photos/seed/ssc-2025/1200/800.jpg"
  },
  {
    type: "video",
    category: "Otomasi & Robotika",
    title: "Pemrograman PLC — Ladder Diagram (CX-Programmer)",
    date: "2025-11-20",
    desc: "Praktik pemrograman PLC dengan metode Ladder Diagram menggunakan CX-Programmer dan CX-Designer untuk kontrol otomasi industri.",
    thumb: "https://picsum.photos/seed/plc-cx/800/500.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  },
  {
    type: "photo",
    category: "Jaringan & Server",
    title: "Praktik Perangkat MikroTik di Lab",
    date: "2025-09-05",
    desc: "Penerapan Routing, VLAN, DHCP, Firewall, dan Hotspot pada jaringan lokal menggunakan perangkat MikroTik di lab sekolah.",
    thumb: "https://picsum.photos/seed/lab-mikrotik/800/500.jpg",
    image: "https://picsum.photos/seed/lab-mikrotik/1200/800.jpg"
  }
];

/* Statistik "Dokumentasi" mengikuti jumlah entri di atas secara otomatis */
const statDocsEl = $('#statDocs');
if(statDocsEl) statDocsEl.dataset.count = DOCS.length;

const ICONS = {
  play:   '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.6-6.86a1.05 1.05 0 0 0 0-1.76L9.56 4.26A1.04 1.04 0 0 0 8 5.14z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  arrow:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
};

const grid = $('#docsGrid'), countEl = $('#docCount');
let filter = 'Semua', currentIdxs = [], currentPos = 0;

const fmtDate = iso => new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'});
 $('#docLatest').textContent = fmtDate(DOCS[0].date);

function matchFilter(i){
  if(filter === 'Semua') return true;
  if(filter === 'Foto' || filter === 'Video') return DOCS[i].type === filter.toLowerCase();
  return DOCS[i].category === filter;
}

function docCard(i, pos){
  const d = DOCS[i];
  const badge = d.type === 'video'
    ? `<span class="doc-type video">${ICONS.play}<span>Video</span></span><span class="doc-play"><span>${ICONS.play}</span></span>`
    : `<span class="doc-type photo">${ICONS.camera}<span>Foto</span></span>`;
  return `
    <article class="doc-card" data-pos="${pos}" tabindex="0" role="button" aria-label="Buka dokumentasi: ${d.title}">
      <div class="doc-media">
        <img src="${d.thumb}" alt="${d.title}" loading="lazy">
        ${badge}
      </div>
      <div class="doc-body">
        <div class="doc-meta"><span class="doc-cat">${d.category}</span><time>${fmtDate(d.date)}</time></div>
        <h3>${d.title}</h3>
        <p>${d.desc}</p>
        <span class="doc-more">Lihat detail ${ICONS.arrow}</span>
      </div>
    </article>`;
}

function renderDocs(){
  currentIdxs = DOCS.map((_, i) => i).filter(matchFilter);
  countEl.textContent = `Menampilkan ${currentIdxs.length} dari ${DOCS.length} dokumentasi`;
  if(!currentIdxs.length){
    grid.innerHTML = '<div class="docs-empty">Belum ada dokumentasi pada filter ini — segera diposting.</div>';
    return;
  }
  grid.innerHTML = currentIdxs.map((i, pos) => docCard(i, pos)).join('');
  $$('.doc-card', grid).forEach(card => {
    const pos = +card.dataset.pos;
    card.style.animationDelay = (pos * 0.07) + 's';
    const open = () => openLightbox(pos);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(); } });
  });
}

 $('#docFilters').addEventListener('click', e => {
  const btn = e.target.closest('.doc-filter');
  if(!btn) return;
  $$('.doc-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filter = btn.dataset.filter;
  renderDocs();
});

/* ---------- Lightbox: dokumentasi ---------- */
const lb = $('#lightbox'), lbMedia = $('#lbMedia'), lbCat = $('#lbCat'),
      lbDate = $('#lbDate'), lbTitle = $('#lbTitle'), lbDesc = $('#lbDesc');

function ytEmbed(url){
  const m = (url || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
function paintLightbox(){
  const d = DOCS[currentIdxs[currentPos]];
  if(d.type === 'video'){
    const yt = ytEmbed(d.video);
    lbMedia.innerHTML = yt
      ? `<iframe src="${yt}" title="${d.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
      : `<video src="${d.video}" controls playsinline preload="metadata"></video>`;
  } else {
    lbMedia.innerHTML = `<img src="${d.image || d.thumb}" alt="${d.title}">`;
  }
  lbCat.textContent = d.category;
  lbDate.textContent = fmtDate(d.date);
  lbTitle.textContent = d.title;
  lbDesc.textContent = d.desc;
}
function openLightbox(pos){
  currentPos = pos;
  paintLightbox();
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { lbMedia.innerHTML = ''; }, 300);
}
function step(dir){
  currentPos = (currentPos + dir + currentIdxs.length) % currentIdxs.length;
  paintLightbox();
}
 $('#lbClose').addEventListener('click', closeLightbox);
 $('#lbPrev').addEventListener('click', () => step(-1));
 $('#lbNext').addEventListener('click', () => step(1));
lb.addEventListener('click', e => { if(e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => {
  if(!lb.classList.contains('open')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowLeft') step(-1);
  if(e.key === 'ArrowRight') step(1);
});

renderDocs();

/* ---------- Lightbox: sertifikat ----------
   Data sertifikat dibaca dari atribut data-* pada .cert-media di index.html
   (data-full, data-level, data-title, data-desc). Untuk menambah/mengubah
   sertifikat, cukup edit HTML — tidak perlu menyentuh file ini. */
const CERT_FALLBACK = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 640 400%27%3E%3Crect width=%27640%27 height=%27400%27 fill=%27%23F0EBDD%27/%3E%3Ctext x=%27320%27 y=%27210%27 font-family=%27Georgia%27 font-size=%2720%27 fill=%27%23A89B6B%27 text-anchor=%27middle%27%3EGanti dengan foto sertifikat%3C/text%3E%3C/svg%3E';
const certLb = $('#certLightbox'), certImg = $('#certImg'),
      certLevel = $('#certLevel'), certTitle = $('#certTitle'), certDesc = $('#certDesc');

function openCert(el){
  certLevel.textContent = el.dataset.level || '';
  certTitle.textContent = el.dataset.title || '';
  certDesc.textContent  = el.dataset.desc  || '';
  certImg.onerror = () => { certImg.onerror = null; certImg.src = CERT_FALLBACK; };
  certImg.alt = el.dataset.title || 'Sertifikat';
  certImg.src = el.dataset.full || (el.querySelector('img') ? el.querySelector('img').src : '');
  certLb.classList.add('open');
  certLb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeCert(){
  certLb.classList.remove('open');
  certLb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { certImg.src = ''; }, 300);
}
 $$('.cert-media').forEach(el => {
  el.addEventListener('click', () => openCert(el));
  el.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openCert(el); } });
});
 $('#certClose').addEventListener('click', closeCert);
certLb.addEventListener('click', e => { if(e.target === certLb) closeCert(); });
document.addEventListener('keydown', e => {
  if(certLb.classList.contains('open') && e.key === 'Escape') closeCert();
});

/* ---------- Contact form (mailto) ---------- */
 $('#contactForm').addEventListener('submit', function(e){
  e.preventDefault();
  const f = new FormData(this);
  const body = `Nama: ${f.get('nama')}\nEmail: ${f.get('email')}\n\n${f.get('pesan')}`;
  window.location.href = 'mailto:muhammad.rifqi2376@gmail.com'
    + '?subject=' + encodeURIComponent('[Portfolio] ' + f.get('subjek'))
    + '&body=' + encodeURIComponent(body);
});
})();