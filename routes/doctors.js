const express  = require("express");
const router = express.Router();
const Doctor = require("../models/doctor");
const User = require("../models/user");
const mongoose = require('mongoose');

const cors = require("cors");
const app = express();
const connectDB = require("../db/connect");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require("dotenv").config();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// All users
router.get('/', async(req, res) => {
    const query = {};
    const users = await User.find(query);
    res.status(200).json(users);
});

// one user by id --> user id
// router.get('/user', async(req, res) => {
//     const { _id } = req.body;
//     const query = { _id };
//     const user = await User.findOne(query);
//     const doctor = await Doctor.findOne({userId: _id})

//     res.status(200).json(...user, ...doctor);
// });


// Find a user by ID
router.get('/doctor/:id', async (req, res) => {
  const { id } = req.params;
  // console.log(id);

  try {
    const doctor = await Doctor.findById({_id: id});
    const { userId } = doctor;
    const user = await User.findById({_id: userId});
    // console.log(user);

    if (!user || !doctor) {
      return res.status(404).send('User not found');
    }

    return res.status(200).json({ user,doctor });
  } catch (error) {
    console.error('Error finding doctor:', error);
    return res.status(500).send('Error finding doctor');
  }
});

// Add doctor
router.post('/add-doctor', async(req, res) => {
    console.log(req.body);
    const {
        _id,
        image,
        medicalName,
        degrees,
        registrationNo,
        dateOfBirth,
        specialty,
        gender,
        religion,
        presentAddress,
        permanentAddress
      } = req.body;

      
      try {
        const newDoctor = new Doctor({
          userId: _id,
          image,
          medicalName,
          degrees,
          registrationNo,
          dateOfBirth,
          specialty,
          gender,
          religion,
          presentAddress,
          permanentAddress,
        });
    
        const savedDoctor = await newDoctor.save();
        res.status(200).json(savedDoctor);

      } catch (error) {
        console.error('Error creating doctor:', error);
        res.status(500).send('Error creating doctor');
      }

    // const query = { _id };
    // const user = await User.findOne(query);
    // const doctor = new User({  });
    // res.status(200).json(user);


});

// update doctor --> pass doctor id
router.put('/update-doctor/:id', async(req, res) => {
  // console.log(req.body);
  const { id } = req.params;
  const doctor = await Doctor.findById({_id: id});

  const { userId } = doctor;
  const user = await User.findById({_id: userId});
  // const {fullName, phone, email} = user;

  const {
      fullName, 
      phone, 
      email,
      image,
      dateOfBirth,
      gender,
      religion,
      presentAddress,
      permanentAddress
    } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        {_id: userId},
        {
          fullName, 
          phone, 
          email,
      },
      { new: true, runValidators: true}
    );
      const updatedDoctor = await Doctor.findByIdAndUpdate(
        {_id: id},

        {
          image,
          dateOfBirth,
          gender,
          religion,
          presentAddress,
          permanentAddress
      },
      { new: true, runValidators: true}
    );
    
    if(!updatedUser || !updatedDoctor) {
      return res.status(404).send('Doctor not found');
    }
  
    res.status(200).json({updatedUser, updatedDoctor});

    } catch (error) {
      console.error('Error updating doctor:', error);
      res.status(500).send('Error updating doctor');
    }

});

// Delete a doctor by ID
router.delete('/delete-doctor/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoctor = await Doctor.findByIdAndDelete({_id: id});

    if (!deletedDoctor) {
      return res.status(404).send('Doctor not found');
    }

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).send('Error deleting doctor');
  }
});


module.exports = router;

