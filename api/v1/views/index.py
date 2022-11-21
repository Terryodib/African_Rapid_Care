#!/usr/bin/python3

from api.v1.views import app_views
from flask import jsonify
from models import database_storage
from models.user import User
from models.patient import Patient
from models.doctor import Doctor
from models.specialization import Specialization
from models.review import Review
from models.hospital_affiliation import HospitalAffiliation
from models.office import Office
from models.office_hours import OfficeHours
from models.appointment import Appointment
from models.appointment_status import AppointmentStatus


@app_views.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """ returns API status if okay 200 response"""
    return jsonify({"status": "OK"})

@app_views.route('/stats', methods=['GET'], strict_slashes=False)
def number_objects():
    """an endpoint that retrieves the number of each objects by type:"""
    classes = [User, Patient, Doctor, Specialization, Review, HospitalAffiliation, Office, 
            OfficeHours, Appointment, AppointmentStatus]
    names = ["user, patient, doctor, specialization, review, hospitalaffiliation, office,
            officeHours, appointment, appointmentstatus"]

    number_of_obj = {}
    for i in range(len(classes)):
        num_objs[names[i]] = storage.count(classes[i])

    return jsonify(number_of_obj)