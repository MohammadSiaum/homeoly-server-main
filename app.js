const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./db/connect");
require('dotenv').config();


const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes
const auth_route = require('./routes/Auth.route');
const doctors_routes = require("./routes/doctors");
const patient_routes = require('./routes/patient');
const prescription_routes = require('./routes/prescription');
const helpAndSupport_routes = require('./routes/helpAndSup');
const billingOverviewRoute = require("./routes/billingOverviewRoute");




app.get("/", (req, res) => {
    res.send("My app server is running....");
});


app.use("/auth/api", auth_route);
app.use("/api/users", doctors_routes);
app.use("/api/patients", patient_routes);
app.use("/api/prescriptions", prescription_routes);
app.use("/api/help-and-support", helpAndSupport_routes);

// create billing overview
app.use("/api", billingOverviewRoute);




const start = async () => {
    await connectDB(process.env.DB_URL);

    try {
        app.listen(PORT, () => {
            console.log(`${PORT} Yes I am connected`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
