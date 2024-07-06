const express  = require("express");
const router = express.Router();
const Doctor = require("../models/doctor");
const User = require("../models/user");
const Prescription = require("../models/prescription");
const Patient = require("../models/patient");
const mongoose = require('mongoose');


// const mongoose = require('mongoose');
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

// All prescription by userId(Doctor)
router.get('/', verifyAuthMiddleware, async(req, res) => {

  const userId = req.headers.userId;

  try {

    if (!userId) {
      return res
        .status(400)
        .json({ status: "fail", data: "All fields are required" });
    }

    
    const result = await Prescription.find({userId});
    res.status(200).json(result);

  } catch(error) {
    return res.status(500).json({ status: 'fail', message: error.message });
  }
});

 // Finance dashboard
router.get('/finance-dashboard', verifyAuthMiddleware, async(req, res) => {

  const userId = req.headers.userId;

  try {

    if (!userId) {
      return res
        .status(400)
        .json({ status: "fail", data: "All fields are required" });
    }

    const prescriptions = await Prescription.find({ userId });
    
    
    const prescriptionsWithPatients = await Promise.all(
      prescriptions.map(async (prescription) => {
        const _id = prescription.patientId; // Assuming patientId is properly populated
        const patient = await Patient.findById(_id);

        // Merge patient details into prescription object
        return {
          ...prescription.toObject(),
          patient: patient.toObject()
        };
      })
    );


    const totalEarnings = prescriptions.reduce((sum, prescription) => sum + prescription.billing.receivedAmount, 0);
    const totalDue = prescriptions.reduce((sum, prescription) => sum + prescription.billing.dueAmount, 0);
    const totalDrafts = prescriptions.filter(prescription => prescription.draft).length;
 
    // const result = await Prescription.find({userId});
    res.status(200).json({prescriptionsWithPatients, totalEarnings, totalDue, totalDrafts});

  } catch(error) {
    return res.status(500).json({ status: 'fail', message: error.message });
  }
});

// Find all prescriptions by patient Id
router.get('/all-prescription/:id', verifyAuthMiddleware, async (req, res) => {
    // const doctorId = req.headers.doctor_id;
    const userId = req.headers.userId;
    
    const { id } = req.params;
    // console.log(doctorId);
  
    try {

      if (!userId || !id) {
        return res
          .status(400)
          .json({ status: "fail", data: "All fields are required" });
      }

      const prescription = await Prescription.find({userId, patientId: id});
      // console.log(prescription);

      if (!prescription) {
        return res.status(404).send('Prescription not found');
      }

      return res.status(200).json(prescription);
    } catch (error) {
      console.error('Error finding prescription:', error);
      return res.status(500).send('Error finding prescription');
    }
  });

// Find prescription by prescription Id --> single prescription
router.get('/prescription/:id', verifyAuthMiddleware, async (req, res) => {
  // const doctorId = req.headers.doctor_id;
  const userId = req.headers.userId;
  const { id } = req.params;
  
  try {
    if (!userId || !id) {
      return res
        .status(400)
        .json({ status: "fail", data: "All fields are required" });
    }

    const prescription = await Prescription.findOne({userId, _id: id});
    if (!prescription) {
      return res.status(404).send('Prescription not found');
    }

    return res.status(200).json(prescription);
  } catch (error) {
    console.error('Error finding prescription:', error);
    return res.status(500).send('Error finding prescription');
  }
});

// Add prescription
router.post('/add-prescription',verifyAuthMiddleware, async(req, res) => {
    // console.log(req.body);
  // const doctorId = req.headers.doctor_id;
    const userId = req.headers.userId;

    const {
        patientId,
        symptoms,
        prescription,
        comment,
        billing,
        draft

      } = req.body;
  
      try {

        if (!patientId || !userId || !symptoms || !prescription || !billing) {
          return res
            .status(400)
            .json({ status: "fail", data: "All fields are required" });
        }

        const newPrescription = new Prescription({
            userId,
            patientId,
            symptoms,
            prescription,
            comment,
            billing,
            draft
        });
    
        const savedPrescription = await newPrescription.save();
        res.status(200).json(savedPrescription);

      } catch (error) {
        console.error('Error creating prescription:', error);
        res.status(500).send('Error creating prescription');
      }
});

// update prescription
router.put('/update-prescription/:id', verifyAuthMiddleware, async(req, res) => {
    // console.log(req.body);
    // const doctorId = req.headers.doctor_id;

    const userId = req.headers.userId;
    const { id } = req.params;

    const {
        symptoms,
        prescription,
        comment,
        billing,
        draft
      } = req.body;
  
      try {
        if (!userId || !id || !symptoms || !prescription || !billing) {
          return res
            .status(400)
            .json({ status: "fail", data: "All fields are required" });
        }

        const updatedPrescription = await Prescription.findOneAndUpdate(
          {userId, _id: id},
  
          {
            symptoms,
            prescription,
            comment,
            billing,
            draft
        },
        { new: true, runValidators: true}
      );
  
      if(!updatedPrescription) {
        return res.status(404).send('Prescription not found');
      }
      
      return res.status(200).json(updatedPrescription);
  
      } catch (error) {
        console.error('Error updating prescription:', error);
        return res.status(500).send('Error updating prescription');
      }
  
  });

  // update due
  router.put('/update-due/:id', verifyAuthMiddleware, async(req, res) => {
    // console.log(req.body);
    // const doctorId = req.headers.doctor_id;

    const userId = req.headers.userId;
    const { id } = req.params;

    const {

        billing
      } = req.body;
  
      try {
        if (!userId || !id || !billing) {
          return res
            .status(400)
            .json({ status: "fail", data: "All fields are required" });
        }

        const updatedPrescription = await Prescription.findOneAndUpdate(
          {userId, _id: id},
  
          {
            billing
        },
        { new: true, runValidators: true}
      );
  
      if(!updatedPrescription) {
        return res.status(404).send('Prescription not found');
      }
      
      return res.status(200).json(updatedPrescription);
  
      } catch (error) {
        console.error('Error updating due:', error);
        return res.status(500).send('Error updating due');
      }
  
  });

  // update bill
  router.put('/update-bill/:id', verifyAuthMiddleware, async(req, res) => {
    // console.log(req.body);
    // const doctorId = req.headers.doctor_id;

    const userId = req.headers.userId;
    const { id } = req.params;

    const {

        billing
      } = req.body;
  
      try {
        if (!userId || !id || !billing) {
          return res
            .status(400)
            .json({ status: "fail", data: "All fields are required" });
        }

        const updatedPrescription = await Prescription.findOneAndUpdate(
          {userId, _id: id},
  
          {
            billing
        },
        { new: true, runValidators: true}
      );
  
      if(!updatedPrescription) {
        return res.status(404).send('Prescription not found');
      }
      
      return res.status(200).json(updatedPrescription);
  
      } catch (error) {
        console.error('Error updating bill:', error);
        return res.status(500).send('Error updating bill');
      }
  
  });


// Delete a prescription by id
router.delete('/delete-prescription/:id', verifyAuthMiddleware, async (req, res) => {
    const userId = req.headers.userId;
    const { id } = req.params;
  
    try {

      if (!userId || !id) {
        return res
          .status(400)
          .json({ status: "fail", data: "All fields are required" });
      }

      const deletedPrescription = await Prescription.findOneAndDelete({userId, _id: id});
  
      if (!deletedPrescription) {
        return res.status(404).send('Prescription not found');
      }
  
      res.status(200).json({ message: 'Prescription deleted successfully' });
    } catch (error) {
      console.error('Error deleting prescription:', error);
      res.status(500).send('Error deleting prescription');
    }
  });

module.exports = router;