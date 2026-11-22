const doctors = [
  {id:'dr-anika-rao',name:'Dr. Anika Rao',initials:'AR',specialty:'Cardiology',experience:'12 years experience',rating:'4.9',next:'Today, 2:30 PM',fee:'₹800',color:'avatar-green'},
  {id:'dr-rahul-mehta',name:'Dr. Rahul Mehta',initials:'RM',specialty:'Dermatology',experience:'9 years experience',rating:'4.8',next:'Today, 4:00 PM',fee:'₹650',color:'avatar-coral'},
  {id:'dr-sana-kapoor',name:'Dr. Sana Kapoor',initials:'SK',specialty:'Neurology',experience:'14 years experience',rating:'5.0',next:'Tomorrow, 9:30 AM',fee:'₹1,000',color:'avatar-blue'},
  {id:'dr-isha-nair',name:'Dr. Isha Nair',initials:'IN',specialty:'Orthopedics',experience:'11 years experience',rating:'4.9',next:'Tomorrow, 11:00 AM',fee:'₹750',color:'avatar-purple'},
  {id:'dr-kabir-sen',name:'Dr. Kabir Sen',initials:'KS',specialty:'Pediatrics',experience:'8 years experience',rating:'4.9',next:'Today, 3:15 PM',fee:'₹600',color:'avatar-gold'},
  {id:'dr-meera-joshi',name:'Dr. Meera Joshi',initials:'MJ',specialty:'General Medicine',experience:'10 years experience',rating:'4.8',next:'Today, 5:00 PM',fee:'₹500',color:'avatar-rose'}
];

const doctorGrid=document.querySelector('#doctor-grid');
const bookingModal=document.querySelector('#booking-modal');
const resultModal=document.querySelector('#result-modal');
const appointmentsModal=document.querySelector('#appointments-modal');
const specialtySelect=document.querySelector('#booking-specialty');
const doctorSelect=document.querySelector('#booking-doctor');
const dateInput=document.querySelector('#booking-date');
const form=document.querySelector('#booking-form');
let activeDoctor=null;

function renderDoctors(filter=''){
  const matched=doctors.filter(doctor=>!filter||doctor.specialty===filter);
  doctorGrid.innerHTML=matched.length?matched.map(doctor=>`<article class="doctor-card">
    <div class="doctor-top"><div class="doctor-avatar ${doctor.color}" aria-hidden="true">${doctor.initials}</div><div><div class="doctor-name">${doctor.name}</div><div class="doctor-specialty">${doctor.specialty}</div></div><div class="doctor-rating">★ <b>${doctor.rating}</b></div></div>
    <div class="doctor-info"><span>◷ <b>${doctor.experience}</b></span><span>₹ <b>${doctor.fee.replace('₹','')}</b> consultation</span></div>
    <div class="doctor-bottom"><div class="doctor-next">Next available<strong>${doctor.next}</strong></div><button class="doctor-book" data-book-doctor="${doctor.id}">Book a visit ↗</button></div>
  </article>`).join(''):`<p class="empty-doctors">No doctors in this specialty yet. Try another specialty or view all doctors.</p>`;
}

function refreshDoctorOptions(preferredId=''){
  const specialty=specialtySelect.value;
  const eligible=doctors.filter(doctor=>!specialty||doctor.specialty===specialty);
  doctorSelect.innerHTML='<option value="">Select a doctor</option>'+eligible.map(doctor=>`<option value="${doctor.id}">${doctor.name} · ${doctor.specialty}</option>`).join('');
  if(preferredId&&eligible.some(doctor=>doctor.id===preferredId))doctorSelect.value=preferredId;
}

function openBooking({specialty='',doctorId='',date=''}={}){
  document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
  specialtySelect.value=specialty;
  refreshDoctorOptions(doctorId);
  if(date)dateInput.value=date;
  bookingModal.showModal();
  document.body.classList.add('modal-open');
}

function closeDialog(dialog){dialog.close();if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');}
function getSavedAppointments(){try{return JSON.parse(localStorage.getItem('carewellAppointments')||'[]')}catch{return []}}
function saveAppointments(items){localStorage.setItem('carewellAppointments',JSON.stringify(items))}
function formatDate(dateString){if(!dateString)return '';return new Date(`${dateString}T12:00:00`).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})}
function fillReceipt(appointment){
  document.querySelector('#result-copy').textContent=`Thanks, ${appointment.patientName}. Your appointment request is saved on this device.`;
  document.querySelector('#appointment-receipt').innerHTML=[['Doctor',appointment.doctorName],['Specialty',appointment.specialty],['Date & time',`${formatDate(appointment.date)} · ${appointment.time}`],['Contact',appointment.email]].map(([label,value])=>`<div class="receipt-row"><span>${label}</span><strong>${value}</strong></div>`).join('');
}
function renderAppointments(){
  const host=document.querySelector('#appointments-list');
  const items=getSavedAppointments().sort((a,b)=>`${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  host.innerHTML=items.length?items.map(item=>`<div class="appointment-item"><strong>${item.doctorName}</strong><span>${item.specialty} · ${formatDate(item.date)} at ${item.time}</span><span>Booked for ${item.patientName}</span></div>`).join(''):'<div class="no-appointments">No appointments saved yet.<br>Once you book a visit, it will show up here.</div>';
}

document.querySelectorAll('[data-open-booking]').forEach(button=>button.addEventListener('click',()=>openBooking()));
document.querySelectorAll('[data-close-modal]').forEach(button=>button.addEventListener('click',()=>closeDialog(button.closest('dialog'))));
document.querySelector('[data-open-appointments]').addEventListener('click',()=>{renderAppointments();appointmentsModal.showModal();document.body.classList.add('modal-open')});
specialtySelect.addEventListener('change',()=>refreshDoctorOptions());
document.addEventListener('click',event=>{
  const bookButton=event.target.closest('[data-book-doctor]');
  if(bookButton){activeDoctor=doctors.find(doctor=>doctor.id===bookButton.dataset.bookDoctor);openBooking({specialty:activeDoctor.specialty,doctorId:activeDoctor.id});}
  const specialtyButton=event.target.closest('[data-specialty]');
  if(specialtyButton)openBooking({specialty:specialtyButton.dataset.specialty});
  if(event.target===bookingModal||event.target===resultModal||event.target===appointmentsModal)closeDialog(event.target);
});

document.querySelector('#quick-search-button').addEventListener('click',()=>{
  const specialty=document.querySelector('#quick-specialty').value;
  const date=document.querySelector('#quick-date').value;
  openBooking({specialty,date});
});

form.addEventListener('submit',event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(form).entries());
  const doctor=doctors.find(item=>item.id===data.doctor);
  const appointment={...data,doctorName:doctor.name,id:globalThis.crypto?.randomUUID?.()||String(Date.now()),createdAt:new Date().toISOString()};
  const appointments=getSavedAppointments();appointments.push(appointment);saveAppointments(appointments);
  form.reset();refreshDoctorOptions();closeDialog(bookingModal);fillReceipt(appointment);resultModal.showModal();document.body.classList.add('modal-open');
});

document.querySelector('#architecture-toggle').addEventListener('click',event=>{
  const button=event.currentTarget,detail=document.querySelector('#architecture-detail');
  const isOpen=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!isOpen));detail.hidden=isOpen;button.querySelector('span').textContent=isOpen?'＋':'−';
});

const menuToggle=document.querySelector('.menu-toggle');
menuToggle.addEventListener('click',()=>{const nav=document.querySelector('.main-nav'),open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelector('.main-nav').classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}));
document.querySelector('#show-all-doctors').addEventListener('click',event=>{event.preventDefault();renderDoctors();});

const today=new Date();
for(const input of [dateInput,document.querySelector('#quick-date')]){
  const offset=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
  input.min=offset;
  if(input===dateInput)input.value=offset;
}
renderDoctors();
