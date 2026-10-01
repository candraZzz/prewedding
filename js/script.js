/* =====================================================
   KONFIGURASI
   ===================================================== */
const CONFIG = {
  groom: { nick: "Tomi", full: "Tomi", parents: "Bapak Anto & Ibu Dewi" },
  bride: { nick: "Jihan", full: "Herjianti Suantara", parents: "Bapak Muliyadi & Ibu Suriati Prapsi" },

  // Format: YYYY-MM-DDTHH:MM:SS+offset (WIB = +08:00, WIB= +07:00) — ganti [TANGGAL] di sini
  date: "2026-10-14T08:00:00+08:00",
  timeZone: "Asia/Makassar", // Asia/Jakarta untuk WIB (mis. Kalimantan Barat)

  events: [
    {
      title: "Akad Nikah", date: "2026-10-09T08:00:00+08:00",
      place: "KUA lahei 2", address: "", maps: "https://maps.app.goo.gl/zpsRyzGiNzgK3Rjt5"
    },
    {
      title: "Resepsi", date: "2026-10-15T11:00:00+08:00", time: "06.00 – Selesai ",
      place: "Desa muara inu rt 02", address: "Gang Wirahusada", maps: "https://maps.app.goo.gl/fbuYU2eYNiDxAwgn6?g_st=ic"
    }
  ],

  story: [
    { title: "Pertemuan", when: "2022", text: "Dua insan dipertemukan oleh takdir, lalu saling mengenal dengan niat yang baik." },
    { title: "Lamaran", when: "21 09 2026", text: "Dengan restu kedua keluarga, niat itu kami mantapkan dalam ikatan lamaran." },
    { title: "Pernikahan", when: "14 10 2026", text: "Insya Allah kami melangkah ke jenjang pernikahan untuk beribadah bersama." }
  ]
};

/* =====================================================
   Logika (tidak perlu diubah) BY Czzz
   ===================================================== */
(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const fmt = (d, o) => new Intl.DateTimeFormat("id-ID", { timeZone: CONFIG.timeZone, ...o }).format(new Date(d));
  const get = (o, p) => p.split(".").reduce((a, k) => a[k], o);
  const use = (id, c) => `<svg class="d ${c}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const star = '<svg aria-hidden="true" viewBox="0 0 60 60"><use href="#star"/></svg>';

  /* ---------- Slide dinamis: Akad, Resepsi, Lokasi ---------- */
  const eventSlide = (e, i) => `
    <div class="frame ${i ? "dayak" : "arch"}">
      <p class="small rv">${i ? "Dilanjutkan dengan" : "Insya Allah akan dilaksanakan"}</p>
      <h2 class="ev-title rv">${e.title}</h2>
      <div class="ring rv">${star}<b>${fmt(e.date, { day: "numeric" })}</b></div>
      <p class="ev-d rv">${fmt(e.date, { weekday: "long" })}, ${fmt(e.date, { month: "long", year: "numeric" })}</p>
      <div class="div rv"><svg><use href="#spiral"/></svg></div>
    </div>`;
  $("#sAkad").insertAdjacentHTML("beforeend", eventSlide(CONFIG.events[0], 0));
  $("#sResepsi").insertAdjacentHTML("beforeend", eventSlide(CONFIG.events[1], 1));

  $("#sLokasi").insertAdjacentHTML("beforeend", `
    <h2 class="h rv">Lokasi Acara</h2>
    <div class="div rv"><svg><use href="#star"/></svg></div>` +
    CONFIG.events.map((e) => `
    <div class="loc rv">
      <h3>${e.title}</h3>
      <p class="place">${e.place}</p>
      <p class="addr">${e.address}</p>
      <a class="btn sm" href="${e.maps}" target="_blank" rel="noopener">Lihat Lokasi</a>
    </div>`).join(""));

  $("#timeline").innerHTML = CONFIG.story.map((s) =>
    `<li class="rv">${star}<h3>${s.title}</h3><div class="when">${s.when}</div><p>${s.text}</p></li>`).join("");

  /* ---------- Isi teks dari konfigurasi ---------- */
  $$("[data-bind]").forEach((el) => (el.textContent = get(CONFIG, el.dataset.bind)));
  document.title = `The Wedding of ${CONFIG.groom.nick} & ${CONFIG.bride.nick}`;
  const to = new URLSearchParams(location.search).get("to"); // ?to=Nama%20Tamu
  if (to) { $("#guest").textContent = to; $("#guestBox").hidden = false; }

  /* ---------- Dekorasi per slide ---------- */
  const DECO = {
    corners: () => ["tl", "tr", "bl", "br"].map((p) => use("corner", "cn " + p)).join(""),
    cornersTop: () => ["tl", "tr"].map((p) => use("corner", "cn " + p)).join(""),
    birds: () => use("bird", "bird l") + use("bird", "bird r"),
    vine: () => use("vine", "vine l") + use("vine", "vine r"),
    moon: () => use("moon", "moon")
  };
  const slides = $$(".slide");
  slides.forEach((s) => {
    s.insertAdjacentHTML("afterbegin", s.dataset.deco.split(" ").map((k) => DECO[k]()).join(""));
    [...s.querySelectorAll(".rv")].forEach((el, i) => el.style.setProperty("--i", i));
  });

  /* ---------- Navigasi: hanya lewat tombol ---------- */
  const N = slides.length, track = $("#track"), ind = $("#ind"), nextBtn = $("#nextBtn");
  const dots = $("#dots"); dots.innerHTML = "<i></i>".repeat(N);
  let cur = 0, busy = false;

  function go(i) {
    if (busy) return;
    cur = Math.max(0, Math.min(N - 1, i));
    track.style.transform = `translate3d(0,${(-cur * 100) / N}%,0)`;
    slides.forEach((s, k) => { s.classList.toggle("on", k === cur); s.inert = k !== cur; });
    [...dots.children].forEach((d, k) => d.classList.toggle("on", k === cur));
    document.body.classList.toggle("at0", cur === 0);
    ind.textContent = `${String(cur + 1).padStart(2, "0")} / ${N}`;
    nextBtn.textContent = cur === N - 1 ? "Ke Awal ↑" : "Lanjut ↓";
    busy = true; setTimeout(() => (busy = false), 700);
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    if (b.dataset.act === "prev") go(cur - 1);
    else go(cur === N - 1 ? 0 : cur + 1);
    if (b.dataset.act === "next" && cur === 1) $("#bgm").play().catch(() => { });
  });

  // Kunci scroll: wheel, swipe, keyboard, dan scroll akibat fokus
  const stop = (e) => e.preventDefault();
  addEventListener("wheel", stop, { passive: false });
  addEventListener("touchmove", stop, { passive: false });
  addEventListener("keydown", (e) => {
    if ([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.key) && !e.target.closest("a")) e.preventDefault();
  });
  $("#deck").addEventListener("scroll", (e) => { e.target.scrollTop = 0; e.target.scrollLeft = 0; });
  slides.forEach((s) => s.addEventListener("scroll", () => { s.scrollTop = 0; s.scrollLeft = 0; }));

  /* ---------- Countdown ---------- */
  const target = new Date(CONFIG.date).getTime(), pad = (n) => String(n).padStart(2, "0");
  const timer = setInterval(tick, 1000);
  function tick() {
    const t = Math.max(0, target - Date.now());
    $("#cd-d").textContent = Math.floor(t / 864e5);
    $("#cd-h").textContent = pad(Math.floor(t / 36e5) % 24);
    $("#cd-m").textContent = pad(Math.floor(t / 6e4) % 60);
    $("#cd-s").textContent = pad(Math.floor(t / 1e3) % 60);
    if (!t) { $("#count").hidden = true; $("#cdDone").hidden = false; clearInterval(timer); }
  }
  tick();

  /* ---------- Partikel kecil (ringan, CSS only) ---------- */
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $("#fx").innerHTML = Array.from({ length: 14 }, () => {
      const s = 5 + Math.random() * 6;
      return `<i style="left:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-duration:${14 + Math.random() * 12}s;animation-delay:-${Math.random() * 20}s"></i>`;
    }).join("");
  }

  go(0);
})();
