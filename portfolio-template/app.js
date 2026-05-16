// POW Portfolio Template — vanilla TS
// Compile with: tsc app.ts --target ES2020 --module ES2020
// Or rename to app.js (it's valid JS too aside from the type aliases below).
const KEY = "pow-portfolio-v1";
const uid = () => Math.random().toString(36).slice(2, 10);
const defaultData = {
    name: "Ava Mercer",
    title: "Product Designer & Creative Developer",
    bio: "I craft expressive interfaces and playful brand systems. I work with founders and studios to ship products people remember — somewhere between calm utility and pure delight.",
    avatar: "",
    email: "hello@avamercer.com",
    phone: "+1 (555) 010-2245",
    location: "Lisbon, PT",
    yearsExperience: "7+",
    projectsCount: "120+",
    theme: "light",
    accent: "#7be3a8",
    social: [
        { id: uid(), label: "Twitter", url: "https://twitter.com" },
        { id: uid(), label: "GitHub", url: "https://github.com" },
        { id: uid(), label: "LinkedIn", url: "https://linkedin.com" },
        { id: uid(), label: "Dribbble", url: "https://dribbble.com" },
    ],
    skills: [
        { id: uid(), name: "Product Design", level: 95 },
        { id: uid(), name: "React & TypeScript", level: 88 },
        { id: uid(), name: "Motion & 3D", level: 82 },
        { id: uid(), name: "Design Systems", level: 90 },
        { id: uid(), name: "Brand Identity", level: 78 },
    ],
    experience: [
        { id: uid(), role: "Senior Product Designer", company: "Northwind Studio", period: "2023 — Present", description: "Leading design for a suite of creator tools used by 200k+ makers." },
        { id: uid(), role: "Design Engineer", company: "Lumen Labs", period: "2020 — 2023", description: "Shipped the design system, marketing site, and onboarding for a Series B SaaS." },
        { id: uid(), role: "Freelance Designer", company: "Independent", period: "2018 — 2020", description: "Built brands and product UI for early-stage startups across Europe." },
    ],
    education: [
        { id: uid(), degree: "BFA, Interaction Design", school: "Royal College of Art", period: "2014 — 2018", description: "Focus on motion, prototyping, and computational design." },
    ],
    projects: [
        { id: uid(), title: "Orbit", tag: "Mobile App", description: "A calmer way to plan your week with friends.", image: "", url: "#", color: "#7be3a8" },
        { id: uid(), title: "Folio OS", tag: "Web Platform", description: "Portfolio builder for designers and engineers.", image: "", url: "#", color: "#9bd2ff" },
        { id: uid(), title: "Bloom", tag: "Brand Identity", description: "Visual identity for an indie florist studio.", image: "", url: "#", color: "#ffc6a8" },
        { id: uid(), title: "Pixel Diary", tag: "Side Project", description: "Tiny canvas for daily creative warmups.", image: "", url: "#", color: "#d6b8ff" },
    ],
};
let data = load();
let editing = false;
function load() {
    try {
        const raw = localStorage.getItem(KEY);
        if (raw)
            return { ...defaultData, ...JSON.parse(raw) };
    }
    catch { }
    return structuredClone(defaultData);
}
function save() { try {
    localStorage.setItem(KEY, JSON.stringify(data));
}
catch { } }
// ---------- Theme ----------
function applyTheme() {
    const root = document.documentElement;
    root.classList.remove("dark", "theme-white");
    if (data.theme === "dark")
        root.classList.add("dark");
    if (data.theme === "white")
        root.classList.add("theme-white");
    root.style.setProperty("--accent", data.accent);
    document.querySelectorAll(".seg [data-theme]").forEach(b => {
        b.classList.toggle("active", b.dataset.theme === data.theme);
    });
}
// ---------- Render ----------
function $(sel) { return document.querySelector(sel); }
function render() {
    // Bind text
    document.querySelectorAll("[data-edit]").forEach(el => {
        const k = el.dataset.edit;
        el.textContent = String(data[k] ?? "");
        el.contentEditable = editing ? "true" : "false";
        el.oninput = () => { data[k] = el.textContent || ""; save(); };
    });
    // Avatar
    const av = $("#avatar");
    if (data.avatar) {
        av.style.backgroundImage = `url("${data.avatar}")`;
        av.classList.add("has-image");
    }
    else {
        av.style.backgroundImage = "";
        av.classList.remove("has-image");
    }
    // Skills
    const sg = $("#skillsGrid");
    sg.innerHTML = data.skills.map(s => `
    <div class="skill" data-id="${s.id}">
      <div class="skill-name"><span contenteditable="${editing}" data-field="name">${esc(s.name)}</span><span>${s.level}%</span></div>
      <div class="bar"><i style="width:${s.level}%"></i></div>
      ${editing ? `<input type="range" min="0" max="100" value="${s.level}" data-field="level" style="width:100%; margin-top:8px"/>
        <div class="row-actions"><button class="btn small" data-del="skills">×</button></div>` : ""}
    </div>`).join("");
    sg.querySelectorAll(".skill").forEach(card => {
        const id = card.dataset.id;
        card.querySelector('[data-field="name"]')?.addEventListener("input", e => {
            const item = data.skills.find(x => x.id === id);
            item.name = e.target.textContent || "";
            save();
        });
        card.querySelector('[data-field="level"]')?.addEventListener("input", e => {
            const item = data.skills.find(x => x.id === id);
            item.level = +e.target.value;
            save();
            render();
        });
    });
    // Experience / Education
    $("#experienceList").innerHTML = data.experience.map(e => timelineItem(e.id, e.role, e.company, e.period, e.description, "experience", ["role", "company", "period", "description"])).join("");
    $("#educationList").innerHTML = data.education.map(e => timelineItem(e.id, e.degree, e.school, e.period, e.description, "education", ["degree", "school", "period", "description"])).join("");
    bindTimeline("experience");
    bindTimeline("education");
    // Projects
    const pg = $("#projectsGrid");
    pg.innerHTML = data.projects.map(p => `
    <a class="project" data-id="${p.id}" href="${esc(p.url)}" style="background: linear-gradient(135deg, ${p.color}, color-mix(in oklab, ${p.color} 50%, white));">
      <span class="tag" contenteditable="${editing}" data-field="tag">${esc(p.tag)}</span>
      <div>
        <h3 contenteditable="${editing}" data-field="title">${esc(p.title)}</h3>
        <p contenteditable="${editing}" data-field="description">${esc(p.description)}</p>
      </div>
      ${editing ? `<div class="row-actions">
        <input type="color" value="${p.color}" data-field="color" style="width:32px;height:32px;border:0;background:transparent;cursor:pointer" />
        <button class="btn small" data-del="projects">×</button>
      </div>` : ""}
    </a>`).join("");
    pg.querySelectorAll(".project").forEach(card => {
        if (editing)
            card.addEventListener("click", e => e.preventDefault());
        const id = card.dataset.id;
        card.querySelectorAll("[data-field]").forEach(f => {
            const field = f.dataset.field;
            const handler = (e) => {
                const item = data.projects.find(x => x.id === id);
                item[field] = e.target.value ?? e.target.textContent;
                save();
                if (field === "color")
                    render();
            };
            f.addEventListener(f.tagName === "INPUT" ? "input" : "input", handler);
        });
    });
    // Tilt on projects
    attachTilt();
    // Socials
    const sl = $("#socialList");
    sl.innerHTML = data.social.map(s => `
    <a class="social" data-id="${s.id}" href="${esc(s.url)}" target="_blank" rel="noreferrer">
      <span contenteditable="${editing}" data-field="label">${esc(s.label)}</span>
      ${editing ? `<input type="text" value="${esc(s.url)}" data-field="url" style="margin-left:8px;width:140px"/>
        <button class="btn small" data-del="social">×</button>` : ""}
    </a>`).join("");
    sl.querySelectorAll(".social").forEach(el => {
        if (editing)
            el.addEventListener("click", e => e.preventDefault());
        const id = el.dataset.id;
        el.querySelectorAll("[data-field]").forEach(f => {
            f.addEventListener("input", e => {
                const item = data.social.find(x => x.id === id);
                item[f.dataset.field] = e.target.value ?? e.target.textContent;
                save();
            });
        });
    });
    document.body.classList.toggle("editing", editing);
    $("#editBtn").textContent = editing ? "Done" : "Edit";
    $("#year").textContent = String(new Date().getFullYear());
}
function timelineItem(id, a, b, c, d, kind, fields) {
    return `<div class="tl-item" data-id="${id}" data-kind="${kind}">
    <h4 contenteditable="${editing}" data-field="${fields[0]}">${esc(a)}</h4>
    <div class="meta"><span contenteditable="${editing}" data-field="${fields[1]}">${esc(b)}</span> · <span contenteditable="${editing}" data-field="${fields[2]}">${esc(c)}</span></div>
    <p contenteditable="${editing}" data-field="${fields[3]}">${esc(d)}</p>
    ${editing ? `<div class="row-actions"><button class="btn small" data-del="${kind}">×</button></div>` : ""}
  </div>`;
}
function bindTimeline(kind) {
    const list = data[kind];
    document.querySelectorAll(`.tl-item[data-kind="${kind}"]`).forEach(el => {
        const id = el.dataset.id;
        el.querySelectorAll("[data-field]").forEach(f => {
            f.addEventListener("input", e => {
                const item = list.find((x) => x.id === id);
                item[f.dataset.field] = e.target.textContent || "";
                save();
            });
        });
    });
}
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c])); }
// ---------- Add / delete ----------
document.addEventListener("click", (e) => {
    const t = e.target;
    const add = t.closest("[data-add]");
    if (add) {
        addItem(add.dataset.add);
    }
    const del = t.closest("[data-del]");
    if (del) {
        const kind = del.dataset.del;
        const id = del.closest("[data-id]")?.dataset.id;
        if (id) {
            data[kind] = data[kind].filter((x) => x.id !== id);
            save();
            render();
        }
    }
});
function addItem(kind) {
    if (kind === "skills")
        data.skills.push({ id: uid(), name: "New skill", level: 60 });
    if (kind === "experience")
        data.experience.push({ id: uid(), role: "Role", company: "Company", period: "2024 — Present", description: "Describe your impact." });
    if (kind === "education")
        data.education.push({ id: uid(), degree: "Degree", school: "School", period: "Year — Year", description: "Focus area." });
    if (kind === "projects")
        data.projects.push({ id: uid(), title: "New project", tag: "Tag", description: "Short description.", image: "", url: "#", color: "#9bd2ff" });
    if (kind === "social")
        data.social.push({ id: uid(), label: "Site", url: "https://" });
    save();
    render();
}
// ---------- Tilt ----------
function attachTilt() {
    document.querySelectorAll(".project").forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - .5;
            const py = (e.clientY - r.top) / r.height - .5;
            card.style.transform = `perspective(900px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg)`;
        });
        card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
}
// ---------- Solar system (DOM) ----------
function buildSolar() {
    const orbits = [
        { d: .34, dur: 4, planet: 10, color: "var(--coral)", glow: true, moon: false },
        { d: .50, dur: 6, planet: 14, color: "var(--sky)", glow: false, moon: false },
        { d: .68, dur: 9, planet: 18, color: "var(--lavender)", glow: true, moon: true },
        { d: .86, dur: 13, planet: 12, color: "var(--lemon)", glow: false, moon: false },
        { d: 1.00, dur: 18, planet: 22, color: "var(--brand)", glow: true, moon: false },
    ];
    const size = 520;
    const html = `<div class="solar-wrap" style="width:${size}px;height:${size}px">
    <div class="sun"></div>
    ${orbits.map(o => {
        const os = size * o.d;
        return `<div class="orbit" style="width:${os}px;height:${os}px">
        <div class="arm" style="animation-duration:${o.dur}s">
          <div class="planet ${o.glow ? 'glow' : ''}" style="width:${o.planet}px;height:${o.planet}px;left:${os / 2}px;top:0;color:${o.color};background:radial-gradient(circle at 30% 30%, white, ${o.color} 60%, color-mix(in oklab, ${o.color} 55%, black));">
            ${o.moon ? `<div class="moon-arm"><div class="moon"></div></div>` : ""}
          </div>
        </div>
      </div>`;
    }).join("")}
  </div>`;
    $("#solar").innerHTML = html;
}
// ---------- Sparkles ----------
function buildSparkles() {
    const wrap = $("#sparkles");
    const out = [];
    for (let i = 0; i < 18; i++) {
        out.push(`<span style="top:${(i * 53) % 100}%; left:${(i * 37) % 100}%; animation-delay:${i * 0.2}s; animation-duration:${2 + (i % 5)}s"></span>`);
    }
    wrap.innerHTML = out.join("");
}
// ---------- Scroll progress + parallax ----------
function onScroll() {
    const h = document.documentElement;
    const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    $("#progress").style.width = `${p * 100}%`;
    document.querySelectorAll("[data-parallax]").forEach(el => {
        const kind = el.dataset.parallax;
        if (kind === "rotate")
            el.style.transform = `translate(-50%,-50%) rotate(${p * 360}deg) scale(${1 + p * 0.3})`;
        if (kind === "cube")
            el.style.transform = `perspective(800px) rotateX(${35 + p * 180}deg) rotateY(${-25 + p * -360}deg) translateY(${p * -200}px)`;
    });
}
// ---------- Drawer ----------
function openDrawer(open) { $("#drawer").classList.toggle("open", open); }
// ---------- Wire up ----------
function init() {
    applyTheme();
    buildSolar();
    buildSparkles();
    render();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    $("#editBtn").addEventListener("click", () => { editing = !editing; render(); });
    $("#themeBtn").addEventListener("click", () => {
        const order = ["light", "white", "dark"];
        data.theme = order[(order.indexOf(data.theme) + 1) % order.length];
        save();
        applyTheme();
    });
    $("#settingsBtn").addEventListener("click", () => openDrawer(true));
    $("#drawerClose").addEventListener("click", () => openDrawer(false));
    $("#drawerScrim").addEventListener("click", () => openDrawer(false));
    document.querySelectorAll(".seg [data-theme]").forEach(b => {
        b.addEventListener("click", () => { data.theme = b.dataset.theme; save(); applyTheme(); });
    });
    $("#accentInput").value = data.accent;
    $("#accentInput").addEventListener("input", e => { data.accent = e.target.value; save(); applyTheme(); });
    $("#avatarInput").value = data.avatar;
    $("#avatarInput").addEventListener("input", e => { data.avatar = e.target.value; save(); render(); });
    $("#exportBtn").addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.name.replace(/\s+/g, "-").toLowerCase()}-portfolio.json`;
        a.click();
        URL.revokeObjectURL(url);
    });
    $("#importInput").addEventListener("change", (e) => {
        const f = e.target.files?.[0];
        if (!f)
            return;
        const r = new FileReader();
        r.onload = () => { try {
            data = { ...defaultData, ...JSON.parse(String(r.result)) };
            save();
            applyTheme();
            render();
        }
        catch {
            alert("Invalid JSON");
        } };
        r.readAsText(f);
    });
    $("#resetBtn").addEventListener("click", () => { if (confirm("Reset all content?")) {
        data = structuredClone(defaultData);
        save();
        applyTheme();
        render();
    } });
    // Avatar upload from file
    const fileInput = $("#avatarFile");
    fileInput.addEventListener("change", () => {
        const f = fileInput.files?.[0];
        if (!f)
            return;
        if (!f.type.startsWith("image/")) {
            alert("Please choose an image file.");
            return;
        }
        if (f.size > 4 * 1024 * 1024) {
            alert("Image is large (>4MB) and may not persist.");
        }
        const r = new FileReader();
        r.onload = () => { data.avatar = String(r.result); save(); render(); };
        r.readAsDataURL(f);
    });
    $("#avatarClear").addEventListener("click", () => { data.avatar = ""; save(); render(); });
}
init();
