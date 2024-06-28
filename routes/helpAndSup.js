const express  = require("express");
const router = express.Router();
const HelpAndSup = require("../models/helpAndSupport");
const mongoose = require('mongoose');
const verifyAuthMiddleware = require("../middlewares/verifyAuthMiddleware");


const cors = require("cors");
const app = express();

// const jwt = require('jsonwebtoken');

require("dotenv").config();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// All message helpAndSupport
router.get('/all', verifyAuthMiddleware, async(req, res) => {
    // const id = req.headers.doctor_id;
    const userId = req.headers.userId;

    if (!userId) {
      return res.status(404).send('Help And Support not found');
    }
    const query = {};
    const result = await HelpAndSup.find(query);
    res.status(200).json(result);
});

// Find  helpAndSupport by doctorId
router.get('/message', verifyAuthMiddleware, async (req, res) => {
    // const { id } = req.params;
  // const id = req.headers.doctor_id;
  const userId = req.headers.userId;


    // console.log(id);
  
    try {
      const helpAndSup = await HelpAndSup.find({userId});
  
      if (!helpAndSup) {
        return res.status(404).send('Help And Support not found');
      }

      return res.status(200).json(helpAndSup);
    } catch (error) {
      console.error('Error finding Help And Support:', error);
      return res.status(500).send('Error finding Help And Support');
    }
  });

// Add prescription
router.post('/new-message', verifyAuthMiddleware, async(req, res) => {
    // console.log(req.body);
  // const doctorId = req.headers.doctor_id;
  const userId = req.headers.userId;

    const {
        fullName,
        phone,
        email,
        message

      } = req.body;
  
      try {
        if (!userId || !fullName || !email || !message) {
          return res
            .status(400)
            .json({ status: "fail", data: "All fields are required" });
        }

        const newHelpAndSup = new HelpAndSup({
            userId,
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