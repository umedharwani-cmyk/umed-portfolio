/* ---------- mobile menu ---------- */
const nav = document.querySelector("nav");
const menuBtn = document.querySelector(".menu-btn");

function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
}
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

/* ---------- scroll reveal ---------- */
const revealer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add("in");
            revealer.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach(el => revealer.observe(el));

/* ---------- hero dots ---------- */
const canvas = document.getElementById("dots");
const ctx = canvas.getContext("2d");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let dots = [], lastW = 0, raf = 0, resizeTimer;

function resize() {
    const r = canvas.getBoundingClientRect();
    // ignore height-only changes (mobile address bar) so dots don't reshuffle on scroll
    if (Math.round(r.width) === lastW && dots.length) return;
    lastW = Math.round(r.width);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    dots = [];
    const gap = r.width < 700 ? 22 : 18; // fewer dots on phones
    for (let x = 0; x < r.width; x += gap) {
        for (let y = 0; y < r.height; y += gap) {
            const d = Math.hypot(r.width - x, r.height - y) / Math.hypot(r.width, r.height);
            const strength = Math.max(0.2, 1 - d * 0.9);
            if (Math.random() < strength) {
                dots.push({
                    x, y,
                    r: Math.random() * 1.2 + 0.4,
                    a: strength * (0.25 + Math.random() * 0.5),
                    p: Math.random() * Math.PI * 2,
                    pink: Math.random() < 0.12
                });
            }
        }
    }
    render(0);
}

function render(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const d of dots) {
        const tw = reduceMotion ? 1 : 0.6 + 0.4 * Math.sin(t / 900 + d.p);
        ctx.fillStyle = d.pink
            ? `rgba(255,110,190,${d.a * tw})`
            : `rgba(120,215,255,${d.a * tw})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

function loop(t) { render(t); raf = requestAnimationFrame(loop); }
function start() { if (!raf && !reduceMotion) raf = requestAnimationFrame(loop); }
function stop() { cancelAnimationFrame(raf); raf = 0; }

// only animate while the hero is on screen (saves battery on phones)
new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas);

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
});
resize();

/* ---------- footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();