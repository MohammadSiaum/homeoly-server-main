const express  = require("express");
const router = express.Router();
const HelpAndSup = require("../models/helpAndSupport");
const mongoose = require('mongoose');

const cors = require("cors");
const app = express();

const jwt = require('jsonwebtoken');

require("dotenv").config();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// All message helpAndSupport
router.get('/all', async(req, res) => {
    const query = {};
    const result = await HelpAndSup.find(query);
    res.status(200).json(result);
});

// Find a helpAndSupport by doctorsID
router.get('/message/:id', async (req, res) => {
    const { id } = req.params;
    // console.log(id);
  
    try {
      const helpAndSup = await HelpAndSup.find({doctorId: id});
  
      if (!helpAndSup) {
        return res.status(404).send('Prescription not found');
      }

      return res.status(200).json(helpAndSup);
    } catch (error) {
      console.error('Error finding Help And Support:', error);
      return res.status(500).send('Error finding Help And Support');
    }
  });

// Add prescription
router.post('/new-message', async(req, res) => {
    // console.log(req.body);
    const {
        userId,
        doctorId,
        fullName,
        phone,
        email,
        message

      } = req.body;
  
      try {
        const newHelpAndSup = new HelpAndSup({
            userId,
            doctorId,
            fullName,
            phone,
            email,
            message
        });
    
        const savedHelpAndSup = await newHelpAndSup.save();
        res.status(200).json(savedHelpAndSup);

      } catch (error) {
        console.error('Error creating Help And Support:', error);
        res.status(500).send('Error creating Help And Support');
      }
});


module.exports = router;