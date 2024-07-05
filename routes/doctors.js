const express  = require("express");
const router = express.Router();
const Doctor = require("../models/doctor");
const User = require("../models/user");
const mongoose = require('mongoose');
const verifyAuthMiddleware = require("../middlewares/verifyAuthMiddleware");


const cors = require("cors");
const app = express();

// const connectDB = require("../db/connect");
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

require("dotenv").config();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// Find a user by ID
router.get('/doctor', verifyAuthMiddleware, async (req, res) => {
  // const { id } = req.params;
  const  userId  = req.headers.userId;

  try {
    const doctor = await Doctor.findOne({userId});
    // const { userId } = doctor;
    const user = await User.findById({_id: userId});
    // console.log(user);

    // if (!user || !doctor) {
    //   return res.status(404).send('User not found');
    // }
    // return res.status(200).json({ user,doctor });

    if (user) {
      if (doctor) {
        return res.status(200).json({ user,doctor });
      }
      return res.status(200).json({ user });

    }
    return res.status(404).send('User not found');

  } catch (error) {
    console.error('Error finding doctor:', error);
    return res.status(500).send('Error finding doctor');
  }
});


// update doctor --> userId
router.post('/update-doctor',verifyAuthMiddleware, async(req, res) => {
  
  const userId  = req.headers.userId;
  const doctor = await Doctor.findOne({userId});
  // console.log(doctor, "doctor");

  const {
      fullName, 
      phone, 
      email,
      image,
      medicalName,
      degrees,
      registrationNo,
      dateOfBirth,
      gender,
      religion,
      presentAddress,
      permanentAddress,
    } = req.body;

    try {

      if (!userId || !registrationNo || !email || !degrees || !medicalName || !fullName || !gender || !religion || !presentAddress || !permanentAddress) {
        return res
          .status(400)
          .json({ status: "fail", data: "All fields are required" });
      }
      
      // user--
      const updatedUser = await User.findByIdAndUpdate(
        {_id: userId},
        {
          fullName, 
          phone, 
          email,
        }
      );

    // doctor--
    if (doctor) {

      // update doctor
      const { _id } = doctor
      const updatedDoctor = await Doctor.findOneAndUpdate(
        {_id: _id},

        {
          image,
          medicalName,
          degrees,
          registrationNo,
          dateOfBirth,
          gender,
          religion,
          presentAddress,
          permanentAddress,
      }
     );
    
     if(!updatedUser || !updatedDoctor) {
        return res.status(404).send('Doctor not found');

    }
    return res.status(200).json({updatedUser, updatedDoctor});

        
    }

    // create doctor--
    const newDoctor = new Doctor({
      userId,
      image,
      medicalName,
      degrees,
      registrationNo,
      dateOfBirth,
      gender,
      religion,
      presentAddress,
      permanentAddress
    });

    const savedDoctor = await newDoctor.save();
    return res.status(201).json({updatedUser, savedDoctor});

      
    } catch (error) {
      console.error('Error updating doctor:', error);
      return res.status(500).send('Error updating doctor');
    }

});

// Delete a doctor by ID
router.delete('/delete-doctor',verifyAuthMiddleware, async (req, res) => {
  // const { id } = req.params;
  const  userId  = req.headers.userId;

  try {
    const deletedDoctor = await Doctor.findOneAndDelete({userId});

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

