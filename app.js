const API_URL = ""; // Add your Apps Script / backend URL here when ready.
const DISCUSSION_URL = "https://disccussion-nasho-hc.vercel.app/";
const ADMIN_URL = "https://nasho-health-center.vercel.app/admin.html";

const services = [
  ["🩺","General Consultation","OPD Services"],
  ["👶","Maternal & Child Health","Maternity, ANC, IMCI"],
  ["💜","Family Planning","Reproductive Health"],
  ["💉","Immunization","Vaccination Services"],
  ["🧪","Laboratory","Lab Tests & Diagnostics"],
  ["💊","Pharmacy","Medicines & Supplies"],
  ["🩸","TB & HIV","Testing & Treatment"],
  ["💚","NCDs","Non-Communicable Diseases"]
];

const staff = [
  ["👨‍⚕️","Medical Officer","Clinical Services"],
  ["👩‍⚕️","Nurse","OPD & Maternity"],
  ["👩‍⚕️","Midwife","Maternal Health"],
  ["🧑‍🔬","Lab Technician","Laboratory"],
  ["👨‍💼","Health Information Staff","Data & Reporting"]
];

const content = document.getElementById("content");
const splash = document.getElementById("splash");
const app = document.getElementById("app");
const drawer = document.getElementById("drawer");
const toast = document.getElementById("toast");

setTimeout(()=>{
  splash.classList.add("hidden");
  app.classList.remove("hidden");
  render("home");
},1200);

function serviceHTML(s){
  return `<div class="service" onclick="serviceSelected('${s[1]}')">
    <div class="sicon">${s[0]}</div>
    <div><strong>${s[1]}</strong><small>${s[2]}</small></div>
    <span class="arrow">›</span>
  </div>`;
}

function render(page){
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
  if(page==="home") renderHome();
  if(page==="services") renderServices();
  if(page==="appointment") renderAppointment();
  if(page==="discussion") renderDiscussion();
  if(page==="contact") renderContact();
  if(page==="account") renderAccount();
  window.scrollTo({top:0,behavior:"smooth"});
  drawer.classList.add("hidden");
}

function renderHome(){
 content.innerHTML = `
 <section class="hero">
   <img src="/nasho-logo.png" alt="NASHO logo">
   <h1>Welcome to NASHO Health Center</h1>
   <p>Quality, accessible and affordable health services for everyone.</p>
   <div class="tagline">Healthy People • Strong Community</div>
 </section>

 <div class="grid">
   <button class="card action" onclick="render('services')"><span class="emoji">🩺</span><strong>Services</strong><small>Our health services</small></button>
   <button class="card action" onclick="render('appointment')"><span class="emoji">📅</span><strong>Book Appointment</strong><small>Request a visit</small></button>
   <button class="card action" onclick="render('discussion')"><span class="emoji">💬</span><strong>Discussion</strong><small>Ask & share</small></button>
   <button class="card action" onclick="render('contact')"><span class="emoji">📞</span><strong>Contact</strong><small>Get in touch</small></button>
   <button class="card action" onclick="callEmergency()"><span class="emoji">🚨</span><strong>Emergency</strong><small>Quick help</small></button>
   <button class="card action" onclick="render('account')"><span class="emoji">👤</span><strong>My Account</strong><small>Manage your profile</small></button>
 </div>

 <div class="section-title"><h2>Our Statistics</h2></div>
 <div class="stats">
   <div class="stat"><b>7+</b><span>Expert Staff</span></div>
   <div class="stat"><b>5000+</b><span>Patients</span></div>
   <div class="stat"><b>8</b><span>Departments</span></div>
   <div class="stat"><b>24/7</b><span>Service</span></div>
 </div>

 <div class="section-title"><h2>Popular Services</h2><button onclick="render('services')">View all</button></div>
 <div class="service-list">${services.slice(0,4).map(serviceHTML).join("")}</div>

 <div class="emergency">
   <h3>🚨 Need Urgent Help?</h3>
   <p>For emergencies, call NASHO Health Center immediately.</p>
   <div class="call-grid">
     <a class="call" href="tel:+250790261899">☎ +250 790 261 899</a>
     <a class="call" href="tel:+250787126902">☎ +250 787 126 902</a>
   </div>
 </div>`;
}

function renderServices(){
 content.innerHTML = `<h1 class="page-title">Our Services</h1>
 <p class="page-subtitle">Quality health services for the community.</p>
 <div class="service-list">${services.map(serviceHTML).join("")}</div>
 <div class="section-title"><h2>Doctors & Staff</h2></div>
 <div class="service-list">${staff.map(s=>`<div class="staff"><div class="avatar">${s[0]}</div><div><strong>${s[1]}</strong><small>${s[2]}</small></div></div>`).join("")}</div>`;
}

function renderAppointment(){
 content.innerHTML = `<h1 class="page-title">Book Appointment</h1>
 <p class="page-subtitle">Send your appointment request to NASHO Health Center.</p>
 <form class="form" id="appointmentForm">
   <label>Full Name</label><input name="name" required placeholder="Enter your full name">
   <label>Phone Number</label><input name="phone" required type="tel" placeholder="+250...">
   <label>Patient ID</label><input name="patientId" placeholder="Optional">
   <label>Department / Service</label>
   <select name="department" required><option value="">Select service</option>${services.map(s=>`<option>${s[1]}</option>`).join("")}</select>
   <label>Preferred Date</label><input name="date" type="date" required>
   <label>Preferred Time</label><input name="time" type="time" required>
   <label>Message</label><textarea name="message" placeholder="Tell us anything important..."></textarea>
   <button class="primary">Submit Appointment Request</button>
 </form>`;
 document.getElementById("appointmentForm").onsubmit=submitAppointment;
}

async function submitAppointment(e){
 e.preventDefault();
 const data=Object.fromEntries(new FormData(e.target).entries());
 if(!API_URL){toastMsg("Appointment form is ready. Connect your Apps Script URL in app.js to save requests.");return;}
 try{
   const res=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"appointment",...data})});
   const out=await res.json();
   toastMsg(out.message || "Appointment submitted successfully.");
   e.target.reset();
 }catch(err){toastMsg("Network/server error. Please try again.");}
}

function renderDiscussion(){
 content.innerHTML = `<h1 class="page-title">Discussion</h1>
 <p class="page-subtitle">Ask, share and support one another.</p>
 <div class="card" style="background:linear-gradient(135deg,#008f72,#00a982);color:#fff">
   <h2>💬 NASHO Community</h2><p style="margin-top:7px;opacity:.9">Join the discussion board for health information and community conversations.</p>
   <button class="primary" style="background:#fff;color:#008f72" onclick="window.location.href=DISCUSSION_URL">Open Discussion Board</button>
 </div>
 <div class="section-title"><h2>Example discussions</h2></div>
 <div class="post"><div class="post-head"><div class="avatar">👩</div><div><strong>Community Member</strong><div class="meta">Today</div></div></div><p>Welcome to the NASHO Health Center community discussion.</p><div class="meta">♡ 12 • General</div></div>
 <div class="post"><div class="post-head"><div class="avatar">👨</div><div><strong>Community Member</strong><div class="meta">Yesterday</div></div></div><p>Share questions and useful health information respectfully.</p><div class="meta">♡ 8 • Community</div></div>`;
}

function renderContact(){
 content.innerHTML = `<h1 class="page-title">Contact NASHO</h1>
 <p class="page-subtitle">We are here to help.</p>
 <div class="card">
   <div class="contact-row"><span class="contact-icon">📞</span><div><strong>Phone</strong><br><a href="tel:+250790261899">+250 790 261 899</a><br><a href="tel:+250787126902">+250 787 126 902</a></div></div>
   <div class="contact-row"><span class="contact-icon">✉️</span><div><strong>Email</strong><br><span>nashohc0428@gmail.com</span></div></div>
   <div class="contact-row"><span class="contact-icon">📍</span><div><strong>Location</strong><br><span>Kirehe District, Eastern Province, Rwanda</span></div></div>
 </div>
 <div class="emergency"><h3>🚨 Emergency</h3><p>Call either emergency line for urgent assistance.</p><div class="call-grid"><a class="call" href="tel:+250790261899">Call Line 1</a><a class="call" href="tel:+250787126902">Call Line 2</a></div></div>
 <button class="primary" onclick="openMaps()">📍 Get Directions</button>`;
}

function renderAccount(){
 content.innerHTML = `<h1 class="page-title">My Account</h1>
 <div class="account-head"><div class="account-avatar">👤</div><div><strong>Patient Account</strong><small style="display:block;color:var(--muted);margin-top:4px">NASHO Health Center</small></div></div>
 <div class="account-menu">
   <button onclick="toastMsg('My appointments will appear here.')">📅 &nbsp; My Appointments</button>
   <button onclick="toastMsg('Profile management is ready to connect to your backend.')">👤 &nbsp; My Profile</button>
   <button onclick="toastMsg('App settings')">⚙️ &nbsp; Settings</button>
   <button onclick="toastMsg('You are currently using the NASHO Health Center app.')">ℹ️ &nbsp; About App</button>
 </div>
 <div class="section-title"><h2>Staff / Administration</h2></div>
 <button class="primary" onclick="window.location.href=ADMIN_URL">🔐 Open Admin Portal</button>`;
}

function serviceSelected(name){toastMsg(name+" selected.");}
function callEmergency(){window.location.href="tel:+250790261899"}
function openMaps(){window.open("https://www.google.com/maps/search/?api=1&query=NASHO+Health+Center+Kirehe+Rwanda","_blank")}
function toastMsg(msg){
 toast.textContent=msg;toast.classList.add("show");
 clearTimeout(window.__toast);window.__toast=setTimeout(()=>toast.classList.remove("show"),3200);
}

document.querySelectorAll(".nav-item").forEach(btn=>btn.onclick=()=>render(btn.dataset.page));
document.getElementById("menuBtn").onclick=()=>drawer.classList.remove("hidden");
document.getElementById("closeDrawer").onclick=()=>drawer.classList.add("hidden");
drawer.querySelectorAll("[data-page]").forEach(btn=>btn.onclick=()=>render(btn.dataset.page));
document.getElementById("notifyBtn").onclick=()=>toastMsg("No new notifications.");
window.callEmergency=callEmergency;
window.openMaps=openMaps;
window.render=render;
window.serviceSelected=serviceSelected;

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
}
