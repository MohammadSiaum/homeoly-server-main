const express  = require("express");
const router = express.Router();
const Patient = require("../models/patient");
const mongoose = require('mongoose');


// All patient
router.get('/', async(req, res) => {
    const query = {};
    const users = await Patient.find(query);
    res.status(200).json(users);
});

// Find a patient by ID
router.get('/patient/:id', async (req, res) => {
  const { id } = req.params;
  // console.log(id);

  try {
    const patient = await Patient.findById({_id: id});

    if (!patient) {
      return res.status(404).send('Patient not found');
    }

    return res.status(200).json(patient);
  } catch (error) {
    console.error('Error finding patient:', error);
    return res.status(500).send('Error finding patient');
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
  const { id } = req.params;
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
    // console.log(req.body, id);

    try {
      const updatedPatient = await Patient.findByIdAndUpdate(
        {_id: id},

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
  const { id } = req.params;
  try {
    const deletedPatient = await Patient.findByIdAndDelete({_id: id});

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