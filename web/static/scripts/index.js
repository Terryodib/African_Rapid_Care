// When the user clicks on user profile
// toggle between hiding and showing the dropdown content
function profile_options() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

/* consultation-day input checkbox */
function checkOnlyOne(b) {
  let x = document.getElementsByClassName('dayCheckbox');
  let i;
  for (i = 0; i< x.length; i++) {
    if (x[i].value !=b) {
      x[i].checked = false;
    }
  }
}

function checkOnlyOne2(b) {
  let x = document.getElementsByClassName('timeCheckbox');
  let i;
  for (i = 0; i< x.length; i++) {
    if (x[i].value !=b) {
      x[i].checked = false;
    }
  }
}

function checkOnlyOne3(b) {
  let x = document.getElementsByClassName('fieldCheckbox');
  let i;
  for (i = 0; i< x.length; i++) {
    if (x[i].value !=b) {
      x[i].checked = false;
    }
  }
}

function checkOnlyOne4(b) {
  let x = document.getElementsByClassName('typeCheckbox');
  let i;
  for (i = 0; i< x.length; i++) {
    if (x[i].value !=b) {
      x[i].checked = false;
    }
  }
}

function getQueryString() {
	let result = {};
	if(!window.location.search.length) return result;
	let qs = window.location.search.slice(1);
	let parts = qs.split("&");
	for(let i=0, len=parts.length; i<len; i++) {
		let tokens = parts[i].split("=");
		result[tokens[0]] = decodeURIComponent(tokens[1]);
	}
	return result;
}

function resetPage(formName) {
  let thisForm = doc
}

user_geocode = {};

function handleError(error) {
  let errorStr;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorStr = 'User denied the request for Geolocation.';
      break;
    case error.POSITION_UNAVAILABLE:
      errorStr = 'Location information is unavailable.';
      break;
    case error.TIMEOUT:
      errorStr = 'The request to get user location timed out.';
      break;
    case error.UNKNOWN_ERROR:
      errorStr = 'An unknown error occurred.';
      break;
    default:
      errorStr = 'An unknown error occurred.';
  }
  console.error('Error occurred: ' + errorStr);
}

function showPosition(position) {
  user_geocode['latitude'] = `${position.coords.latitude}`;
  user_geocode['longitude'] = `${position.coords.longitude}`;
  console.log(`Latitude: ${position.coords.latitude}, longitude: ${position.coords.longitude}`);
  // console.log(user_geocode);
}

/* Document */
$(document).ready(function(){
/* Highlight current page*/
const activePage = window.location.pathname;
console.log(activePage);
const navLinks = document.querySelectorAll('nav a').forEach(link => {
  if(link.href.includes(`${activePage}`)) {
  link.classList.add('active');
  }
});

/*
const dates = document.getElementsByTagName("date").forEach(a_date => {
  a_date.value = a_date.format("hh:mm");
});
*/

/* consultation-day input checkbox */
const checkedOH = {};
$('.dayCheckbox').click(function () {
  if ($(this).prop('checked')) {
    checkedOH[$(this).attr('data-id')] = $(this).attr('data-name'); 
  } else if (!$(this).prop('checked')) {
    delete checkedOH[$(this).attr('data-id')];
  }
});

/* consultation-time input checkbox */
const checkedTS = {};
$('.timeCheckbox').click(function () {
  if ($(this).prop('checked')) {
    checkedTS[$(this).attr('data-id')] = $(this).attr('data-name'); 
  } else if (!$(this).prop('checked')) {
    delete checkedTS[$(this).attr('data-id')];
  }
});

/* get user geolocation */
if (window.navigator.geolocation) {
  // Geolocation available, get current position */
  window.navigator.geolocation.getCurrentPosition(showPosition, handleError);
 } else {
  console.error("Geolocation is not supported by this browser.");
}

/*get user ID*/
userId = $('.header-flex-user').attr('data-name'); 
console.log(userId);

/* When Book appointment is clicked */
$('.bk-ap').click(function() {
$.ajax({
  type: 'POST',
  url: 'http://127.0.0.1:5001/api/v1/doctors_search/' + userId, /* + '/' + user_geocode['latitude'] + '/' + user_geocode['longitude'],*/
  contentType: 'application/json',
  dataType: 'json',
  data: JSON.stringify({'latitude': user_geocode['latitude'], 'longitude': user_geocode['longitude']})
}).done(function (data) {
/*  if (data.length == 0) {
    const template = `<p class="coming-ap">Sorry there is no doctor available!`;
    $('.doctors .flex-cards').append(template);
  } else {
*/
    $('.doctors .flex-cards').empty();
    for (let i = 0; i < data.length; i++) {
      let doc = data[i];
      const template = `<article>
      <div class="title_box">
        <div class="photo"><img class="center-img" src="../static/images/user.png" alt="Doctor"></div>
        <div class="doctor-identity">
          <h2><strong>Dr. ${doc.doctor.first_name}&nbsp;${doc.doctor.last_name}</strong></h2>
          <h3>${doc.specialization.specialization_name}</h3>
          <h3>${doc.office.office_address}</h3>
          <h3><span>${doc.distance.distance_text}</span> from you</h3>
          <h3>Start Time:&nbsp;&nbsp;${doc.office_hour.start_time}</h3>
          <h3>End Time:&nbsp;&nbsp;${doc.office_hour.end_time}</h3>
        </div>
      </div>
      <hr>
      <div class="information">
        <p>${doc.doctor.doctor_info}</p>
      </div>
      <a href="/booking?patient_id=${userId}&office_id=${doc.office.id}&day_of_the_week=${doc.office_hour.day_of_the_week}&start_time=${doc.office_hour.start_time}&end_time=${doc.office_hour.end_time}&appointment_status_id=730a8a28-83f3-422c-9435-ee4327c2b0b7&office_hour_id=${doc.office_hour.id}"><button class="btn-book center-img">Book</button></a>
      </article>`;
      $('.doctors .flex-cards').append(template); 
    }
//  }
}); /*end of done */
});

/* Button search for filters is clicked*/
$('.filters > button').click(function() {
  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5001/api/v1/doctors_search/' + userId, /* + '/' + user_geocode['latitude'] + '/' + user_geocode['longitude'],*/
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({'latitude': user_geocode['latitude'], 'longitude': user_geocode['longitude']})
  }).done(function (data) {
  /*  if (data.length == 0) {
      const template = `<p class="coming-ap">Sorry there is no doctor available!`;
      $('.doctors .flex-cards').append(template);
    } else {
  */
      $('.doctors .flex-cards').empty();
      for (let i = 0; i < data.length; i++) {
        let doc = data[i];
        const template = `<article>
        <div class="title_box">
          <div class="photo"><img class="center-img" src="../static/images/user.png" alt="Doctor"></div>
          <div class="doctor-identity">
            <h2><strong>Dr. ${doc.doctor.first_name}&nbsp;${doc.doctor.last_name}</strong></h2>
            <h3>${doc.specialization.specialization_name}</h3>
            <h3>${doc.office.office_address}</h3>
            <h3><span>${doc.distance.distance_text}</span> from you</h3>
            <h3>Start Time:&nbsp;&nbsp;${doc.office_hour.start_time}</h3>
          <h3>End Time:&nbsp;&nbsp;${doc.office_hour.end_time}</h3>
            </div>
        </div>
        <hr>
        <div class="information">
          <p>${doc.doctor.doctor_info}</p>
        </div>
        <a href="/booking?patient_id=${userId}&office_id=${doc.office.id}&day_of_the_week=${doc.office_hour.day_of_the_week}&start_time=${doc.office_hour.start_time}&end_time=${doc.office_hour.end_time}&appointment_status_id=730a8a28-83f3-422c-9435-ee4327c2b0b7&office_hour_id=${doc.office_hour.id}"><button class="btn-book center-img">Book</button></a>
        </article>`;
        $('.doctors .flex-cards').append(template); 
      }
  //  }
  }); /*end of done */

}); 
/* end of function after click */


/* Get appointments of a patient*/
$.ajax({
  type: 'POST',
  url: 'http://127.0.0.1:5001/api/v1/patients/' + userId + '/appointments',
  contentType: 'application/json',
  dataType: 'json',
  /* data: { 'user_id': userId} */
  success: function (data) {
    $('#appointments .flex-cards').empty();
      if (data.length == 0) {
        const template = `<p class="coming-ap">You have no appointments yet!
                            <a class="bk-ap" href="/book">Click here to book one!</a></p>`;
        $('#appointments .flex-cards').append(template);
      } else {
      for (let i = 0; i < data.length; i++) {
        let ap = data[i];
        if (ap.status.appointment_status != "Done" && ap.status.appointment_status != "Cancelled") {
          const template = `<article>
          <div class="title_box">
          <div class="photo"><img class="center-img" src="../static/images/user.png" alt="Doctor"></div>
          <div class="doctor-identity">
            <h2><strong>Dr. ${ap.doctor.first_name}&nbsp;${ap.doctor.last_name}</strong></h2>
            <h3>${ap.specialization.specialization_name}</h3>
            <h3><span>${ap.distance.distance_text}</span> from you</h3>
          </div>
        </div> 
        <hr>
        <div class="information ">
          <!--
          <div class="appointment-day"><strong>Date: </strong>Tueday 20 May, 2023</div>
          -->
          <div class="appointment-time"><strong>Start Time: </strong>${ap.appointment.start_time}</div>
          <div class="appointment-time"><strong>End Time: </strong>${ap.appointment.end_time}</div>
          <div class="appointment-status"><strong>Status: </strong>${ap.status.appointment_status}</div>
          <div class="appointmenttype"><strong>Type: </strong>${ap.appointment.appointment_type}</div>
          <div class="appointment-place"><strong>Office address: </strong>${ap.office.office_address}</div>
          <div class="appointment-symptoms"><strong>Symptoms: </strong>${ap.appointment.symptoms}</div>
        </div>
        <!--
        <a href=""><button class="btn-cancel center-img">Cancel</button></a>
        -->
        </article>`;
          $('#appointments .flex-cards').append(template); 
        }
      }
      }
      $('#appointments2 .flex-cards').empty();
      for (let i = 0; i < data.length; i++) {
        let ap = data[i];
        if (ap.status.appointment_status == "Done" || ap.status.appointment_status == "Cancelled") {
          const template = `<article>
          <div class="title_box">
          <div class="photo"><img class="center-img" src="../static/images/user.png" alt="Doctor"></div>
          <div class="doctor-identity">
            <h2><strong>Dr. ${ap.doctor.first_name}&nbsp;${ap.doctor.last_name}</strong></h2>
            <h3>${ap.specialization.specialization_name}</h3>
            <h3><span>1 km</span> from you</h3>
          </div>
        </div> 
        <hr>
        <div class="information ">
        <!--
          <div class="appointment-day"><strong>Date: </strong>Tueday 20 May, 2023</div>
          -->
          <div class="appointment-time"><strong>Start Time: </strong>${ap.appointment.start_time}</div>
          <div class="appointment-time"><strong>End Time: </strong>${ap.appointment.end_time}</div>
          <div class="appointment-status"><strong>Status: </strong>${ap.status.appointment_status}</div>
          <div class="appointmenttype"><strong>Type: </strong>${ap.appointment.appointment_type}</div>
          <div class="appointment-place"><strong>Office address: </strong>${ap.office.office_address}</div>
          <div class="appointment-symptoms"><strong>Symptoms: </strong>${ap.appointment.symptoms}</div>
        </div>
        </article>`;
          $('#appointments2 .flex-cards').append(template); 
        }
      }
  }
});

/*
var lots_of_stuff_already_done = false;
$('#theForm').on('submit',function(e){
  if (lots_of_stuff_already_done) {
    lots_of_stuff_already_done = false; // reset flag
    return; // let the event bubble away
  }
  e.preventDefault();
  let formData=$(this).serialize();
  let fullUrl = window.location.href;
  let finalUrl = fullUrl+"&"+formData;
  window.location.href = finalUrl;
  lots_of_stuff_already_done = true;
  $(this).trigger('submit');
}); 
*/

$("#theForm").submit(function(e) {
	//let that = this;
	let qs = getQueryString();
	for(let key in qs) {
		let field = $(document.createElement("input"));
		field.attr("name", key).attr("type","hidden");
		field.val(qs[key]);
		$(this).append(field);
	}
});

}); /* end document */
