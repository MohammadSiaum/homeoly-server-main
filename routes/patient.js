const express  = require("express");
const router = express.Router();
const Patient = require("../models/patient");
const mongoose = require('mongoose');


// All patient and count total patient by Doctor ID
router.get('/:id', async(req, res) => {

  try {

    const { id } = req.params;
    const patients = await Patient.find({doctorId: id});
    const totalPatients = patients.length;
    res.status(200).json({patients, totalPatients});

  } catch(error) {
    return res.status(500).json({ status: 'fail', message: error.message });
  }
});

// Find a patient by ID
router.get('/patient/:id', async (req, res) => {
  const doctorId = req.headers.doctor_id;
  const { id } = req.params;
  // console.log(id);

  try {
    const patient = await Patient.findOne({doctorId, _id: id});

    if (!patient) {
      return res.status(404).send('Patient not found');
    }

    return res.status(200).json(patient);
  } catch (error) {
    console.error('Error finding patient:', error);
    return res.status(500).send('Error finding patient');
  }
});

// Find a Male patient by Doctor ID
router.get('/male/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const malePatients = await Patient.find({ doctorId: id, gender: 'Male' });

    const malePatientsCount = malePatients.length;

    return res.status(200).json({ status: 'success', data: { totalMale: malePatientsCount } });

  } catch (error) {
    return res.status(500).json({ status: 'fail', message: error.message });
  }
});

// Find a Female patient by Doctor ID
router.get('/female/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const femalePatients = await Patient.find({ doctorId: id, gender: 'Female' });

    const femalePatientsCount = femalePatients.length;

    return res.status(200).json({ status: 'success', data: { totalFemale: femalePatientsCount } });

  } catch (error) {
    return res.status(500).json({ status: 'fail', message: error.message });
  }
});



// Add patient
router.post('/add-patient', async(req, res) => {
    console.log(req.body);
    const {
        userId,
        doctorId,
        image,
        fullName,
        email,
        phone,
        dateOfBirth,
        gender,
        religion,
        presentAddress,
        permanentAddress
      } = req.body;
  
      try {
        const newPatient = new Patient({
            userId,
            doctorId,
            image,
            fullName,
            email,
            phone,
            dateOfBirth,
            gender,
            religion,
            presentAddress,
            permanentAddress
        });
    
        const savedPatient = await newPatient.save();
        res.status(200).json(savedPatient);

      } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).send('Error creating patient');
      }

});

// update patient
router.put('/update-patient/:id', async(req, res) => {
  // console.log(req.body);
  const doctorId = req.headers.doctor_id;
  const { id } = req.params;
  // console.log(id);
  const {
      image,
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      religion,
      presentAddress,
      permanentAddress
    } = req.body;

    try {
      const updatedPatient = await Patient.findOneAndUpdate(
        {doctorId, _id: id},

        {
          image,
          fullName,
          email,
          phone,
          dateOfBirth,
          gender,
          religion,
          presentAddress,
          permanentAddress
      },
      { new: true, runValidators: true}
    );

    if(!updatedPatient) {
      return res.status(404).send('Patient not found');
    }
    
    return res.status(200).json(updatedPatient);

    } catch (error) {
      console.error('Error updating patient:', error);
      return res.status(500).send('Error updating patient');
    }

});

// Delete a patient by ID
router.delete('/delete-patient/:id', async (req, res) => {
  const doctorId = req.headers.doctor_id;
  const { id } = req.params;

  try {
    const deletedPatient = await Patient.findOneAndDelete({doctorId, _id: id});

    if (!deletedPatient) {
      return res.status(404).send('Patient not found');
    }

    return res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return res.status(500).send('Error deleting patient');
  }
});

module.exports = router;