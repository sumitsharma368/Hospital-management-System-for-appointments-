# Carewell Hospital Appointment System

A responsive front-end prototype for a BCA final-year Online Hospital Appointment System project.

## Run it

Open `index.html` in a modern browser. No build step or package installation is required.

## What’s included

- Responsive landing page, specialty browsing, and sample doctor listings
- Appointment booking form with date, time, doctor, and patient details
- Confirmation view and a “My appointments” list
- Appointment records saved in the browser’s local storage for this demo
- An explainer for the presentation, application, and data tiers

## Three-tier architecture plan

1. **Presentation layer:** HTML, CSS, and JavaScript UI in the browser.
2. **Application layer:** A future backend API for validation, availability, and booking rules.
3. **Data layer:** A future relational database for patients, doctors, departments, and appointments.

This folder implements the presentation tier as a demonstration. It does not connect to a backend server or database; browser local storage keeps sample bookings on the current device only. For a complete project, connect the form to a backend API and persist records in MySQL or another relational database.
