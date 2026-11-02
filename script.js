/* ==========================================================================
   TEAM MATCH — Interaksi Utama & Logika Aplikasi
   ================================================================          */

// 1. Helper Selectors & Utility Functions
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const ROLE_OPTIONS = [
  "UI/UX Designer",
  "Frontend Developer",
  "Backend Developer",
  "Mobile Developer",
  "Data Analyst",
  "AI/ML Engineer",
  "Cyber Security",
  "Project Manager"
];

const initialProjects = [
  {
    id: 1,
    name: "Campus Event Management",
    category: "Web Development",
    description: "Platform untuk mengelola acara kampus mulai dari pengajuan, publikasi, pendaftaran, hingga sertifikat peserta.",
    roles: ["UI/UX Designer", "Frontend Developer", "Backend Developer", "Project Manager"],
    skills: ["Figma", "HTML/CSS", "JavaScript"],
    creator: "Tim Kampus",
    members: "4–5 orang",
    slots: 5
  },
  {
    id: 2,
    name: "EduMate — Teman Belajar",
    category: "Mobile App",
    description: "Aplikasi belajar bersama yang membantu mahasiswa menemukan teman diskusi berdasarkan mata kuliah dan minat.",
    roles: ["UI/UX Designer", "Mobile Developer", "Backend Developer"],
    skills: ["Figma", "Flutter", "API"],
    creator: "Tim EduMate",
    members: "4–5 orang",
    slots: 5
  },
  {
    id: 3,
    name: "AI Deteksi Penyakit Tanaman",
    category: "Artificial Intelligence",
    description: "Sistem berbasis AI untuk mengenali gejala penyakit tanaman dari foto dan memberikan informasi penanganan awal.",
    roles: ["AI/ML Engineer", "Frontend Developer", "Data Analyst"],
    skills: ["Python", "Machine Learning", "Dataset"],
    creator: "Tim AgriTech",
    members: "2–3 orang",
    slots: 3
  },
  {
    id: 4,
    name: "Sistem Pelaporan Fasilitas",
    category: "Education",
    description: "Website pelaporan kerusakan fasilitas kampus dengan status laporan dan dashboard tindak lanjut.",
    roles: ["UI/UX Designer", "Frontend Developer", "Backend Developer"],
    skills: ["Figma", "PHP", "MySQL"],
    creator: "Tim Solutif",
    members: "4–5 orang",
    slots: 5
  },
  {
    id: 5,
    name: "Smart Garden IoT",
    category: "IoT",
    description: "Prototipe pemantauan kelembapan tanah dan penyiraman tanaman menggunakan sensor dan dashboard web.",
    roles: ["Frontend Developer", "Backend Developer", "Data Analyst"],
    skills: ["IoT", "Sensor", "Dashboard"],
    creator: "Tim GreenTech",
    members: "4–5 orang",
    slots: 5
  }
];

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

function split(v) {
  return String(v || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
}

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function notify(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.tmToast);
  window.tmToast = setTimeout(() => t.classList.remove("show"), 2600);
}

// 2. Application State & LocalStorage
let projects = load("tm_projects", initialProjects);
const defaultDeadline = new Date();
defaultDeadline.setDate(defaultDeadline.getDate() + 14);
const defaultDeadlineText = `${defaultDeadline.getFullYear()}-${String(defaultDeadline.getMonth()+1).padStart(2,"0")}-${String(defaultDeadline.getDate()).padStart(2,"0")}`;
projects = projects.map(project => ({ filledSlots: 0, ...project, deadline: project.deadline || defaultDeadlineText }));
save("tm_projects", projects);
let profile = load("tm_profile", {
  name: "Raihan Firdaus",
  year: "2025",
  className: "TRPL",
  npm: "",
  ipk: "",
  portfolio: "",
  role: "Frontend Developer",
  skills: "HTML, CSS, JavaScript",
  interests: "Web development, UI/UX, Artificial Intelligence",
  experience: "Sedang mengembangkan skill web development dan UI/UX melalui project kampus."
});
let savedProjects = load("tm_saved_projects", []);
let savedStudents = load("tm_saved_students", []);
let reminders = load("tm_competition_reminders", []);

const students = [
  { id: "nadia", name: "Nadia Putri", role: "UI/UX Designer", skills: ["Figma", "UI/UX", "User Research", "Prototyping"], interests: ["Web Development", "Education", "Design"], experience: "Pernah membuat prototype aplikasi kampus dan mengikuti kompetisi UI/UX.", year: "2024" },
  { id: "dimas", name: "Dimas Pratama", role: "Backend Developer", skills: ["Node.js", "API", "MySQL", "JavaScript"], interests: ["Web Development", "Technology"], experience: "Berpengalaman membangun REST API dan database untuk project organisasi.", year: "2023" },
  { id: "raka", name: "Raka Aditya", role: "Project Manager", skills: ["Agile", "Communication", "Planning", "Documentation"], interests: ["Education", "Business", "Technology"], experience: "Pernah menjadi koordinator tim pada dua project kampus.", year: "2024" },
  { id: "salsa", name: "Salsa Maharani", role: "Frontend Developer", skills: ["HTML", "CSS", "JavaScript", "React", "Figma"], interests: ["Web Development", "UI/UX", "Education"], experience: "Membuat beberapa website responsif dan aktif belajar React.", year: "2025" },
  { id: "fajar", name: "Fajar Ramadhan", role: "AI/ML Engineer", skills: ["Python", "Machine Learning", "Data", "TensorFlow"], interests: ["Artificial Intelligence", "Data Science", "IoT"], experience: "Mengembangkan model klasifikasi sederhana untuk project akademik.", year: "2023" },
  { id: "alya", name: "Alya Safitri", role: "Data Analyst", skills: ["Python", "SQL", "Excel", "Data Visualization"], interests: ["Data Science", "Artificial Intelligence", "Business"], experience: "Pernah mengolah dataset dan membuat dashboard visualisasi.", year: "2024" },
  { id: "bima", name: "Bima Saputra", role: "Mobile Developer", skills: ["Flutter", "Dart", "Firebase", "API"], interests: ["Mobile App", "Education", "Technology"], experience: "Membangun aplikasi mobile sederhana menggunakan Flutter.", year: "2025" }
];

const competitions = [
  { id: 1, name: "Gemastik XIX — Divisi UX Design & Software Development", field: "UI/UX Design", organizer: "Puspresnas / Balai Pengembangan Talenta Indonesia", deadline: "2026-11-02", prize: "Rp 60.000.000 + Medali & Sertifikat Juara", fee: "Gratis", type: "Tim", level: "Nasional", skills: ["Figma", "User Research", "Usability Testing"] },
  { id: 2, name: "BRI Hackathon 2026 — FinTech & AI Innovation", field: "Software Development", organizer: "BRI Innovation Center", deadline: "2026-11-05", prize: "Total hadiah Rp 100.000.000", fee: "Gratis", type: "Tim", level: "Nasional", skills: ["Software", "FinTech", "AI"] },
  { id: 3, name: "Data Science Student Challenge", field: "Data Science", organizer: "Data Academy Indonesia", deadline: "2026-11-18", prize: "Rp 25.000.000 + Sertifikat", fee: "Rp 50.000", type: "Individu", level: "Nasional", skills: ["Python", "SQL", "Data Visualization"] },
  { id: 4, name: "Business Plan Competition 2026", field: "Business", organizer: "Entrepreneur Student Network", deadline: "2026-11-25", prize: "Rp 35.000.000", fee: "Rp 75.000 / tim", type: "Tim", level: "Nasional", skills: ["Business Model", "Pitch Deck", "Riset Pasar"] },
  { id: 5, name: "Lomba Esai Inovasi Pendidikan", field: "Esai", organizer: "Forum Pendidikan Muda", deadline: "2026-12-10", prize: "Rp 10.000.000 + Publikasi", fee: "Gratis", type: "Individu", level: "Nasional", skills: ["Menulis", "Riset", "Pendidikan"] }
];

function initials(name) {
  return (name || "TM").trim().split(/\s+/).slice(0, 2).map(x => x[0] || "").join("").toUpperCase();
}

// 3. Navigation Management
function goTo(page) {
  $$(".page").forEach(p => p.classList.toggle("active", p.id === `page-${page}`));
  $$(".nav-link").forEach(n => n.classList.toggle("active", n.dataset.page === page));
  
  const titles = {
    home: "Dashboard",
    explore: "Jelajah Project",
    matches: "Rekomendasi Mahasiswa",
    myprojects: "Proyek Saya",
    invites: "Undangan",
    competitions: "Pusat Informasi Lomba",
    profile: "Profile",
    chat: "Chat Mahasiswa"
  };
  
  $("#pageTitle").textContent = titles[page] || "Dashboard";
  $("#sidebar").classList.remove("open");
  
  if (page === "home") renderHome();
  if (page === "explore") renderProjects();
  if (page === "matches") renderStudentRecommendations();
  if (page === "myprojects") renderMyProjects();
  if (page === "invites") renderDashboardInvites();
  if (page === "competitions") renderCompetitions();
  if (page === "chat") renderConversationList();
  
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$$("[data-page]").forEach(el => el.addEventListener("click", e => { e.preventDefault(); goTo(el.dataset.page); }));
$$("[data-goto]").forEach(el => el.addEventListener("click", () => goTo(el.dataset.goto)));
$("#menuToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
document.addEventListener("click", e => {
  if (innerWidth <= 760 && !$("#sidebar").contains(e.target) && !$("#menuToggle").contains(e.target)) {
    $("#sidebar").classList.remove("open");
  }
});

// 4. SAW Scoring Algorithm & Project Components
/* SAW Weights: role 40%, skill 30%, minat 20%, pengalaman 10%. */
function scoreSAW(person, project) {
  const roles = (project.roles || []).map(x => x.toLowerCase());
  const pRole = (person.role || "").toLowerCase();
  const role = roles.length ? (roles.some(r => r === pRole) ? 1 : roles.some(r => pRole.includes(r) || r.includes(pRole)) ? .65 : .15) : .5;
  
  const pSkills = split(person.skills);
  const reqSkills = (project.skills || []).map(x => x.toLowerCase());
  const skill = reqSkills.length ? reqSkills.filter(s => pSkills.some(ps => ps.includes(s) || s.includes(ps))).length / reqSkills.length : .5;
  
  const interests = split(person.interests);
  const category = (project.category || "").toLowerCase();
  const interest = interests.length ? (interests.some(i => category.includes(i) || i.includes(category) || category.includes(i.split(" ")[0])) ? 1 : .35) : .5;
  
  const exp = String(person.experience || "").trim().length > 30 ? 1 : String(person.experience || "").trim().length > 0 ? .65 : .25;
  
  return Math.round((role * .4 + skill * .3 + interest * .2 + exp * .1) * 100);
}

function projectCard(project) {
  const match = scoreSAW(profile, project);
  const saved = savedProjects.includes(project.id);
  return `
    <article class="project-card">
      <div class="project-card-top">
        <span class="project-symbol">✦</span>
        <span class="category-tag">${esc(project.category)}</span>
      </div>
      <div class="match-line">
        <strong>${match}% cocok</strong>
        <span class="match-track"><i style="width:${match}%"></i></span>
      </div>
      <h3>${esc(project.name)}</h3>
      <p>${esc(project.description)}</p>
      <div class="tag-list">
        ${(project.skills || []).slice(0, 4).map(s => `<span class="skill-tag">${esc(s)}</span>`).join("")}
      </div>
      <div class="project-meta">
        <span>♧ ${Math.min(Number(project.filledSlots || 0), Number(project.slots || 0))} dari ${Number(project.slots || 0)} slot terisi · ${Math.max(0, Number(project.slots || 0) - Number(project.filledSlots || 0))} slot tersisa</span>
        <span>Role: ${(project.roles || []).length}</span>
        <span class="project-deadline">◷ Batas gabung: ${project.deadline ? new Date(project.deadline + "T00:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}) : "Belum ditentukan"}</span>
      </div>
      <div class="project-actions">
        <button class="icon-action" data-share-project="${project.id}" title="Bagikan" aria-label="Bagikan">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4"/></svg>
          <span>Bagikan</span>
        </button>
        <button class="icon-action ${saved ? "is-saved" : ""}" data-save-project="${project.id}" title="Simpan" aria-label="Simpan">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4z"/></svg>
          <span>${saved ? "Tersimpan" : "Simpan"}</span>
        </button>
        <button class="mini-btn" data-detail="${project.id}">Detail →</button>
      </div>
    </article>
  `;
}

function renderHome() {
  $("#homeProjects").innerHTML = projects.slice(0, 3).map(projectCard).join("");
  $("#statProjects").textContent = projects.length;
  $("#statRoles").textContent = projects.filter(p => p.creator === profile.name).length;
  $("#statSkills").textContent = chatData.filter(c => c.invite).length;
  bindCardActions();
  applyProfile();
  renderJoinRequests();
}

function renderProjects() {
  const q = $("#searchInput").value.trim().toLowerCase();
  const role = $("#roleFilter").value;
  const category = $("#categoryFilter").value;
  
  const list = projects.filter(p => 
    (!q || [p.name, p.description, p.category, ...(p.skills || []), ...(p.roles || [])].join(" ").toLowerCase().includes(q)) &&
    (!role || (p.roles || []).includes(role)) &&
    (!category || p.category === category)
  ).sort((a, b) => scoreSAW(profile, b) - scoreSAW(profile, a));
  
  $("#allProjects").innerHTML = list.map(projectCard).join("");
  $("#resultCount").textContent = `${list.length} project ditemukan`;
  $("#emptyState").classList.toggle("hidden", list.length > 0);
  $("#allProjects").classList.toggle("hidden", !list.length);
  bindCardActions();
  if ($("#page-profile")?.classList.contains("active")) applyProfile();
}

function bindCardActions() {
  $$("[data-detail]").forEach(b => b.onclick = () => showDetail(Number(b.dataset.detail)));
  $$("[data-save-project]").forEach(b => b.onclick = () => {
    const id = Number(b.dataset.saveProject);
    savedProjects = savedProjects.includes(id) ? savedProjects.filter(x => x !== id) : [...savedProjects, id];
    save("tm_saved_projects", savedProjects);
    refreshProjectViews();
    notify(savedProjects.includes(id) ? "Project disimpan." : "Project dihapus dari simpanan.");
  });
  $$("[data-share-project]").forEach(b => b.onclick = () => shareProject(Number(b.dataset.shareProject)));
}

function refreshProjectViews() {
  renderProjects();
  renderHome();
  if ($("#page-myprojects").classList.contains("active")) renderMyProjects();
}

async function shareText(text) {
  if (navigator.share) {
    try { await navigator.share({ title: "Team Match", text }); } catch {}
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    notify("Tautan/informasi berhasil disalin.");
  } else {
    notify(text);
  }
}

function shareProject(id) {
  const p = projects.find(x => x.id === id);
  if (p) shareText(`Project Team Match: ${p.name}\n${p.description}\nRole: ${(p.roles || []).join(", ")}`);
}

function showDetail(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  
  $("#detailContent").innerHTML = `
    <span class="category-tag">${esc(p.category)}</span>
    <h2>${esc(p.name)}</h2>
    <p>${esc(p.description)}</p>
    <h4>Persentase kecocokan SAW: ${scoreSAW(profile, p)}%</h4>
    <h4>Slot anggota</h4>
    <p>${Math.min(Number(p.filledSlots || 0), Number(p.slots || 0))} dari ${Number(p.slots || 0)} slot terisi · ${Math.max(0, Number(p.slots || 0) - Number(p.filledSlots || 0))} slot tersisa</p><p><b>Batas waktu bergabung:</b> ${p.deadline ? new Date(p.deadline + "T00:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}) : "Belum ditentukan"}</p>
    <h4>Skill</h4>
    <div class="tag-list">${(p.skills || []).map(x => `<span class="skill-tag">${esc(x)}</span>`).join("")}</div>
    <h4>Role dibutuhkan</h4>
    <div class="tag-list">${(p.roles || []).map(x => `<span class="category-tag">${esc(x)}</span>`).join("")}</div>
    <p><b>Pembuat:</b> ${esc(p.creator)}</p>
    <div class="detail-actions">
      <button class="btn btn-primary" id="interestBtn">Saya tertarik</button>
      <button class="btn btn-soft" id="detailShare">Bagikan</button>
    </div>
  `;
  
  $("#detailDialog").showModal();
  $("#interestBtn").onclick = () => { notify("Minat bergabung dicatat (demo)."); $("#detailDialog").close(); };
  $("#detailShare").onclick = () => shareProject(id);
}

$("#closeDialog").onclick = () => $("#detailDialog").close();
$("#searchInput").addEventListener("input", renderProjects);
$("#roleFilter").addEventListener("change", renderProjects);
$("#categoryFilter").addEventListener("change", renderProjects);

function resetFilters() {
  $("#searchInput").value = "";
  $("#roleFilter").value = "";
  $("#categoryFilter").value = "";
  renderProjects();
}
$("#resetFilters").onclick = resetFilters;
$("#emptyReset").onclick = resetFilters;

// 5. Project Creation & Management
$("#createProjectStat").addEventListener("click", () => {
  $("#dashboardCreate").classList.remove("hidden");
  $("#dashboardCreate").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#createProjectStat").addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") $("#createProjectStat").click();
});
$("#closeCreate").onclick = () => $("#dashboardCreate").classList.add("hidden");

$("#projectForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.currentTarget);
  const roles = f.getAll("roles");
  if (!roles.length) { notify("Pilih minimal satu role."); return; }
  
  const p = {
    id: Date.now(),
    name: f.get("name").trim(),
    category: f.get("category"),
    description: f.get("description").trim(),
    roles,
    skills: split(f.get("skills")).map(x => x.replace(/\b\w/g, c => c.toUpperCase())),
    creator: profile.name,
    members: f.get("members"),
    slots: parseInt((f.get("members").match(/\d+/) || ["0"])[0], 10),
    filledSlots: 0,
    deadline: f.get("deadline") || ""
  };
  
  projects.unshift(p);
  save("tm_projects", projects);
  e.currentTarget.reset();
  $("#dashboardCreate").classList.add("hidden");
  renderHome();
  notify("Project berhasil dipublikasikan. Rekomendasi mahasiswa sekarang tersedia.");
  goTo("matches");
});

$("#myProjectsStat").onclick = () => goTo("myprojects");
$("#invitesStat").onclick = () => goTo("invites");

function renderMyProjects() {
  const mine = projects.filter(p => p.creator === profile.name);
  $("#myProjectList").innerHTML = mine.map(projectCard).join("");
  $("#myProjectEmpty").classList.toggle("hidden", mine.length > 0);
  bindCardActions();
}

// 6. Student Matching System
function studentCard(s, p) {
  const score = scoreSAW(s, p);
  const saved = savedStudents.includes(s.id);
  return `
    <article class="student-card">
      <div class="student-head">
        <span class="student-avatar">${initials(s.name)}</span>
        <div>
          <h3>${esc(s.name)}</h3>
          <p>${esc(s.role)} · Angkatan ${esc(s.year)}</p>
        </div>
      </div>
      <div class="match-line">
        <strong>${score}% cocok</strong>
        <span class="match-track"><i style="width:${score}%"></i></span>
      </div>
      <p class="student-experience">${esc(s.experience)}</p>
      <div class="tag-list">
        ${s.skills.slice(0, 4).map(x => `<span class="skill-tag">${esc(x)}</span>`).join("")}
      </div>
      <div class="project-actions">
        <button class="icon-action" data-share-student="${s.id}">
          <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4"/></svg>
          <span>Bagikan</span>
        </button>
        <button class="icon-action ${saved ? "is-saved" : ""}" data-save-student="${s.id}">
          <svg viewBox="0 0 24 24"><path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4z"/></svg>
          <span>${saved ? "Tersimpan" : "Simpan"}</span>
        </button>
        <button class="btn btn-primary btn-small" data-chat-student="${s.id}">Chat</button>
      </div>
    </article>
  `;
}

function renderStudentRecommendations() {
  const mine = projects.filter(p => p.creator === profile.name);
  const sel = $("#matchProjectSelect");
  const old = sel.value;
  
  sel.innerHTML = '<option value="">Pilih project</option>' + mine.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join("");
  
  if (mine.some(p => String(p.id) === old)) sel.value = old;
  else if (mine.length) sel.value = String(mine[0].id);
  
  const p = mine.find(x => String(x.id) === sel.value);
  $("#studentEmpty").classList.toggle("hidden", mine.length > 0);
  $("#studentResults").classList.toggle("hidden", !p);
  
  if (!p) {
    $("#studentResultCount").textContent = mine.length ? "Pilih project untuk melihat mahasiswa" : "Belum ada project yang dipublikasikan";
    $("#studentResults").innerHTML = "";
    return;
  }
  
  const ranked = [...students].sort((a, b) => scoreSAW(b, p) - scoreSAW(a, p));
  $("#studentResultCount").textContent = `${ranked.length} mahasiswa direkomendasikan`;
  $("#studentResults").innerHTML = ranked.map(s => studentCard(s, p)).join("");
  
  $$("[data-chat-student]").forEach(b => b.onclick = () => openStudentChat(b.dataset.chatStudent));
  $$("[data-save-student]").forEach(b => b.onclick = () => {
    const id = b.dataset.saveStudent;
    savedStudents = savedStudents.includes(id) ? savedStudents.filter(x => x !== id) : [...savedStudents, id];
    save("tm_saved_students", savedStudents);
    renderStudentRecommendations();
    notify("Status simpan mahasiswa diperbarui.");
  });
  $$("[data-share-student]").forEach(b => b.onclick = () => {
    const s = students.find(x => x.id === b.dataset.shareStudent);
    if (s) shareText(`Mahasiswa Team Match: ${s.name} — ${s.role}`);
  });
}

$("#matchProjectSelect").addEventListener("change", renderStudentRecommendations);


function renderJoinRequests() {
  const host = $("#dashboardJoinRequests");
  if (!host) return;
  const mine = projects.filter(project => project.creator === profile.name);
  const requests = load("tm_join_requests", []);
  const visible = requests.filter(request => mine.some(project => project.id === request.projectId));
  host.innerHTML = visible.length ? visible.map(request => `
    <article class="join-request-card">
      <div class="student-avatar">${esc(request.initials || "M")}</div>
      <div class="join-request-copy"><strong>${esc(request.name || "Mahasiswa")}</strong><p>Mengajukan permintaan bergabung ke <b>${esc(mine.find(project => project.id === request.projectId)?.name || "projek")}</b></p></div>
      <span class="request-status">${esc(request.status || "Menunggu")}</span>
    </article>`).join("") : '<div class="join-request-empty">Belum ada permintaan bergabung. Permintaan mahasiswa untuk projek yang kamu buat akan tampil di sini.</div>';
}

function renderDashboardInvites() {
  const invites = chatData.filter(c => c.invite);
  $("#dashboardInviteList").innerHTML = invites.map(c => `
    <article class="invite-card">
      <div class="student-avatar">${esc(c.initials)}</div>
      <div class="invite-card-copy">
        <h3>${esc(c.name)}</h3>
        <p>Mengundangmu bergabung ke project <b>Campus Connect</b>.</p>
        <small>${esc(c.role)}</small>
      </div>
      <button class="btn btn-primary btn-small" data-invite-chat="${c.id}">Lihat undangan</button>
    </article>
  `).join("") || `
    <div class="empty-state">
      <h3>Tidak ada undangan baru</h3>
      <p>Undangan yang masuk akan muncul di sini.</p>
    </div>
  `;
  
  $$("[data-invite-chat]").forEach(b => b.onclick = () => {
    goTo("chat");
    openChat(b.dataset.inviteChat);
  });
}

// 7. Competitions Center
function daysLeft(date) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(date + "T00:00:00") - now) / 86400000);
}

function renderCompetitions() {
  const q = $("#competitionSearch").value.toLowerCase().trim();
  const field = $("#competitionField").value;
  const deadline = $("#competitionDeadline").value;
  const type = $("#competitionType").value;
  
  const list = competitions.filter(c => 
    (!q || [c.name, c.organizer, c.field, ...c.skills].join(" ").toLowerCase().includes(q)) &&
    (!field || c.field === field) &&
    (!type || c.type === type) &&
    (!deadline || (deadline === "urgent" ? daysLeft(c.deadline) >= 0 && daysLeft(c.deadline) < 7 : new Date(c.deadline).getMonth() === new Date().getMonth() && new Date(c.deadline).getFullYear() === new Date().getFullYear()))
  );
  
  const urgent = competitions.filter(c => daysLeft(c.deadline) >= 0 && daysLeft(c.deadline) < 7);
  $("#competitionAlert").classList.toggle("hidden", urgent.length === 0);
  $("#competitionAlertTitle").textContent = `Perhatian: ${urgent.length} lomba segera ditutup!`;
  $("#competitionAlertText").textContent = "Deadline kurang dari 7 hari. Jangan sampai terlambat mendaftar.";
  
  $("#competitionCount").textContent = `Menampilkan ${list.length} lomba`;
  $("#competitionList").innerHTML = list.map(c => {
    const d = daysLeft(c.deadline);
    const isUrgent = d >= 0 && d < 7;
    const rem = reminders.includes(c.id);
    return `
      <article class="competition-card ${isUrgent ? "urgent" : ""}">
        <div class="competition-tags">
          <span class="competition-field">${esc(c.field)}</span>
          <span class="competition-level">${esc(c.level)}</span>
          <span class="deadline-chip ${isUrgent ? "urgent-chip" : ""}">${d < 0 ? "Ditutup" : d === 0 ? "Hari terakhir" : `Tersisa ${d} hari`}</span>
        </div>
        <h3>${esc(c.name)}</h3>
        <p class="competition-organizer">▥ ${esc(c.organizer)}</p>
        <div class="competition-reward">🏆 ${esc(c.prize)}</div>
        <div class="competition-details">
          <span><b>Biaya daftar</b>${esc(c.fee)}</span>
          <span><b>Kategori peserta</b>${esc(c.type)}</span>
          <span><b>Deadline</b>${new Date(c.deadline + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
        <div class="tag-list">
          ${c.skills.map(s => `<span class="skill-tag">#${esc(s)}</span>`).join("")}
        </div>
        <div class="competition-actions">
          <button class="btn ${rem ? "btn-primary" : "btn-soft"} btn-small" data-reminder="${c.id}">${rem ? "✓ Pengingat aktif" : "♧ Aktifkan pengingat"}</button>
          <button class="icon-action" data-share-comp="${c.id}">
            <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4"/></svg>
            <span>Bagikan</span>
          </button>
        </div>
      </article>
    `;
  }).join("") || `
    <div class="empty-state">
      <h3>Lomba tidak ditemukan</h3>
      <p>Coba ubah kata kunci atau filter.</p>
    </div>
  `;
  
  $$("[data-reminder]").forEach(b => b.onclick = () => {
    const id = Number(b.dataset.reminder);
    reminders = reminders.includes(id) ? reminders.filter(x => x !== id) : [...reminders, id];
    save("tm_competition_reminders", reminders);
    renderCompetitions();
    notify(reminders.includes(id) ? "Pengingat lomba diaktifkan." : "Pengingat lomba dinonaktifkan.");
  });
  
  $$("[data-share-comp]").forEach(b => b.onclick = () => {
    const c = competitions.find(x => x.id === Number(b.dataset.shareComp));
    if (c) shareText(`${c.name}\nHadiah: ${c.prize}\nBiaya: ${c.fee}\nDeadline: ${c.deadline}`);
  });
}

["competitionSearch", "competitionField", "competitionDeadline", "competitionType"].forEach(id => {
  $("#" + id).addEventListener(id === "competitionSearch" ? "input" : "change", renderCompetitions);
});

$("#competitionReset").onclick = () => {
  ["competitionSearch", "competitionField", "competitionDeadline", "competitionType"].forEach(id => $("#" + id).value = "");
  renderCompetitions();
};
$("#showUrgentCompetitions").onclick = () => {
  $("#competitionDeadline").value = "urgent";
  renderCompetitions();
};

// 8. Profile Management
function applyProfile() {
  const name = profile.name || "Pengguna Team Match";
  $("#welcomeText").textContent = `Halo, ${name}! Selamat datang di website Team Match. Temukan project dan teman satu tim yang sesuai dengan skill kamu.`;
  $("#sideName").textContent = name;
  $("#topName").textContent = name;
  $("#sideAvatar").textContent = initials(name);
  $("#topAvatar").textContent = initials(name);
  const savedPhoto = load("tm_profile_photo", "");
  if (savedPhoto) $("#profileAvatar").innerHTML = `<img src="${savedPhoto}" alt="Foto profil">`;
  else $("#profileAvatar").textContent = initials(name);
  $("#profileDisplayName").textContent = name;
  $("#profileDisplayRole").textContent = `${profile.className || "Mahasiswa"} · ${profile.role || "Anggota Team Match"}`;
  
  $("#profileName").value = profile.name || "";
  $("#profileYear").value = profile.year || "";
  $("#profileClass").value = profile.className || "";
  $("#profileRole").value = profile.role || ROLE_OPTIONS[1];
  $("#profileSkills").value = profile.skills || "";
  $("#profileInterests").value = profile.interests || "";
  $("#profileExperience").value = profile.experience || "";
  $("#profileNpm").value = profile.npm || "";
  $("#profileIpk").value = profile.ipk || "";
  $("#profilePortfolio").value = profile.portfolio || "";
  $("#profileNpmView").textContent = profile.npm || "Belum diisi";
  $("#profileIpkView").textContent = profile.ipk || "Belum diisi";
  $("#profileYearClassView").textContent = `${profile.year || "Angkatan belum diisi"} · ${profile.className || "Kelas belum diisi"}`;
  const ownProjects = projects.filter(project => project.creator === profile.name);
  $("#profileCreatedProjects").innerHTML = ownProjects.length ? ownProjects.map(project => `<span class="profile-chip">${esc(project.name)}</span>`).join("") : '<span class="profile-muted">Belum ada projek yang dibuat.</span>';
  $("#profilePortfolioView").innerHTML = profile.portfolio ? `<a href="${esc(profile.portfolio)}" target="_blank" rel="noopener noreferrer">${esc(profile.portfolio)}</a>` : '<span class="profile-muted">Belum ada tautan portofolio.</span>';
  const saved = projects.filter(project => savedProjects.includes(project.id));
  $("#profileSavedProjects").innerHTML = saved.length ? saved.map(project => `<span class="profile-chip">${esc(project.name)}</span>`).join("") : '<span class="profile-muted">Belum ada projek tersimpan.</span>';
}

$("#profileForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.currentTarget);
  profile = {
    name: f.get("name").trim(),
    year: f.get("year").trim(),
    className: f.get("className").trim(),
    npm: (f.get("npm") || "").trim(),
    ipk: (f.get("ipk") || "").trim(),
    portfolio: (f.get("portfolio") || "").trim(),
    role: f.get("role"),
    skills: f.get("skills").trim(),
    interests: f.get("interests").trim(),
    experience: f.get("experience").trim()
  };
  save("tm_profile", profile);
  applyProfile();
  renderHome();
  renderProjects();
  notify("Profil berhasil disimpan.");
});

$("#editProfileBtn").onclick = () => $("#profileName").focus();

// 9. Chat System
const defaultChats = [
  { id: "nadia", name: "Nadia Putri", role: "UI/UX Designer · Online", initials: "NP", color: "lavender", unread: 2, preview: "Aku mengundang kamu ke Campus Connect!", time: "10:24", invite: true, messages: [{ from: "them", text: "Hai! Aku sedang mengembangkan project Campus Connect.", time: "10:20" }, { from: "them", text: "Aku mengundang kamu ke Campus Connect sebagai Frontend Developer. Mau bergabung?", time: "10:24" }] },
  { id: "dimas", name: "Dimas Pratama", role: "Backend Developer · Online", initials: "DP", color: "mint", unread: 0, preview: "API-nya sudah siap untuk dites.", time: "09:45", messages: [{ from: "them", text: "Halo! API-nya sudah siap untuk dites.", time: "09:45" }] },
  { id: "raka", name: "Raka Aditya", role: "Project Manager · Terakhir aktif 1 jam lalu", initials: "RA", color: "peach", unread: 1, preview: "Kita diskusi jam berapa hari ini?", time: "Kemarin", messages: [{ from: "them", text: "Kita diskusi jam berapa hari ini?", time: "Kemarin" }] },
  { id: "salsa", name: "Salsa Maharani", role: "Frontend Developer · Online", initials: "SM", color: "blue", unread: 0, preview: "Terima kasih, sampai ketemu!", time: "Senin", messages: [{ from: "them", text: "Terima kasih, sampai ketemu!", time: "Senin" }] }
];

let chatData = load("tm_chats", defaultChats);
let activeChatId = null;
let chatFilter = "all";

function persistChats() {
  save("tm_chats", chatData);
}

function renderConversationList() {
  const host = $("#conversationList");
  if (!host) return;
  const q = $("#chatSearch").value.toLowerCase().trim();
  
  const list = chatData.filter(c => 
    (c.name + " " + c.preview).toLowerCase().includes(q) &&
    (chatFilter === "all" || (chatFilter === "unread" && c.unread > 0) || (chatFilter === "invites" && c.invite))
  );
  
  host.innerHTML = list.map(c => `
    <button class="conversation-item ${c.id === activeChatId ? "selected" : ""}" data-conversation="${esc(c.id)}">
      <span class="chat-avatar ${esc(c.color)}">${esc(c.initials)}<i></i></span>
      <span class="conversation-summary"><strong>${esc(c.name)}</strong><span>${esc(c.preview)}</span></span>
      <span class="conversation-meta"><small>${esc(c.time)}</small>${c.unread ? `<b class="unread-count">${c.unread}</b>` : ""}</span>
    </button>
  `).join("") || '<div class="chat-empty-list">Tidak ada percakapan ditemukan.</div>';
  
  $$("[data-conversation]").forEach(b => b.onclick = () => openChat(b.dataset.conversation));
  
  const unread = chatData.reduce((n, c) => n + c.unread, 0);
  const inviteCount = chatData.filter(c => c.invite).length;
  $("#chatNavBadge").textContent = unread || "";
  $("#chatNavBadge").classList.toggle("hidden", !unread);
  $("#chatInviteCount").textContent = inviteCount;
}

function openChat(id) {
  let c = chatData.find(x => x.id === id);
  if (!c) return;
  activeChatId = id;
  c.unread = 0;
  persistChats();
  
  $("#chatWelcome").classList.add("hidden");
  $("#chatConversation").classList.remove("hidden");
  $("#page-chat").classList.add("chat-show-conversation");
  $("#activeChatAvatar").textContent = c.initials;
  $("#activeChatAvatar").className = "avatar chat-person-avatar " + c.color;
  $("#activeChatName").textContent = c.name;
  $("#activeChatStatus").textContent = c.role;
  $("#inviteBanner").classList.toggle("hidden", !c.invite);
  $("#inviteText").textContent = `${c.name} mengundang kamu untuk berkolaborasi dalam project Campus Connect.`;
  
  renderMessages();
  renderConversationList();
}

function renderMessages() {
  const c = chatData.find(x => x.id === activeChatId);
  if (!c) return;
  $("#messageList").innerHTML = '<div class="message-day">Percakapan</div>' + c.messages.map(m => `
    <div class="message-row ${m.from === "me" ? "mine" : "theirs"}">
      <div class="message-bubble">${esc(m.text)}<small>${esc(m.time)} ${m.from === "me" ? "✓✓" : ""}</small></div>
    </div>
  `).join("");
  $("#messageList").scrollTop = $("#messageList").scrollHeight;
}

function sendChatMessage(value) {
  const c = chatData.find(x => x.id === activeChatId);
  if (!c) return;
  const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  c.messages.push({ from: "me", text: value, time });
  c.preview = value;
  c.time = time;
  persistChats();
  renderMessages();
  renderConversationList();
}

function openStudentChat(id) {
  const s = students.find(x => x.id === id);
  if (!s) return;
  let c = chatData.find(x => x.id === id);
  if (!c) {
    c = {
      id: s.id,
      name: s.name,
      role: s.role + " · Mahasiswa",
      initials: initials(s.name),
      color: "blue",
      unread: 0,
      preview: "Mulai percakapan",
      time: "Baru",
      messages: [{ from: "them", text: `Halo, saya ${s.name}. Senang bisa terhubung!`, time: "Baru" }]
    };
    chatData.unshift(c);
    persistChats();
  }
  goTo("chat");
  openChat(id);
}

$("#chatForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("#chatMessageInput");
  const v = input.value.trim();
  if (v && activeChatId) {
    sendChatMessage(v);
    input.value = "";
    input.focus();
  }
});

$("#chatSearch").addEventListener("input", renderConversationList);
$("#chatBackBtn").onclick = () => {
  $("#page-chat").classList.remove("chat-show-conversation");
  activeChatId = null;
};
$$("[data-chat-filter]").forEach(b => b.onclick = () => {
  chatFilter = b.dataset.chatFilter;
  $$("[data-chat-filter]").forEach(x => x.classList.toggle("active", x === b));
  renderConversationList();
});
$$("[data-open-chat]").forEach(b => b.onclick = () => {
  goTo("chat");
  openChat(b.dataset.openChat);
});

$("#chatInviteBtn").onclick = () => {
  if (!activeChatId) return;
  const c = chatData.find(x => x.id === activeChatId);
  sendChatMessage(`Hai ${c.name.split(" ")[0]}, aku ingin mengundangmu berkolaborasi di project-ku. Tertarik?`);
  notify("Undangan dikirim melalui chat demo.");
};
$("#quickInvite").onclick = () => $("#chatInviteBtn").click();

$("#acceptInvite").onclick = () => {
  const c = chatData.find(x => x.id === activeChatId);
  if (!c) return;
  c.invite = false;
  sendChatMessage("Aku menerima undangan kolaborasi. Terima kasih!");
  openChat(activeChatId);
  renderDashboardInvites();
  notify("Undangan diterima.");
};

$("#declineInvite").onclick = () => {
  const c = chatData.find(x => x.id === activeChatId);
  if (!c) return;
  c.invite = false;
  sendChatMessage("Terima kasih atas undangannya, tetapi aku belum bisa bergabung.");
  openChat(activeChatId);
  renderDashboardInvites();
  notify("Undangan ditolak.");
};

$("#markNotificationsRead").onclick = () => {
  chatData.forEach(c => c.unread = 0);
  persistChats();
  renderConversationList();
  notify("Notifikasi ditandai sudah dibaca.");
};

// 10. Initialization
applyProfile();
renderHome();
renderProjects();
renderConversationList();
renderCompetitions();
// Aksi pada toolbar profil
$("#profileSettingsBtn")?.addEventListener("click", () => {
  $("#profileForm").scrollIntoView({ behavior: "smooth", block: "start" });
  $("#profileName").focus({ preventScroll: true });
});
$("#profilePhotoBtn")?.addEventListener("click", () => $("#profilePhotoInput").click());
$("#profilePhotoInput")?.addEventListener("change", event => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { notify("Pilih file gambar yang valid."); return; }
  const reader = new FileReader();
  reader.onload = () => {
    save("tm_profile_photo", reader.result);
    $("#profileAvatar").innerHTML = `<img src="${reader.result}" alt="Foto profil">`;
    notify("Foto profil diperbarui.");
  };
  reader.readAsDataURL(file);
});
$("#profileLogoutBtn")?.addEventListener("click", () => notify("Fitur keluar belum tersedia karena aplikasi berjalan dalam mode demo."));
