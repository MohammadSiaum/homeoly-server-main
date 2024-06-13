const { default: mongoose } = require("mongoose");
const BillingOverviewModel = require("../../models/billingOverview");
const Patient = require("../../models/patient");
exports.createBillingOverviewController = async (req, res) => {
  const { patientId, totalBill, receivedBill, draft } = req.body;
  const doctorId = patientId;
  console.log(req.body, doctorId);
  const total = Number(totalBill);
  const received = Number(receivedBill)
  try {
    if (!patientId || !totalBill || !receivedBill) {
      return res
        .status(400)
        .json({ status: "fail", data: "All fields are required" });
    }

    if (received > total) {
      return res.status(400).json({
        status: "fail",
        data: "Received bill cannot be greater than total bill",
      });
    }

    const DueBill = total - received;

    const data = await BillingOverviewModel.create({
      doctorId,
      patientId,
      totalBill: total,
      receivedBill: received,
      DueBill,
      draft,
    });

    return res.status(200).json({ status: "success", data });
  } catch (error) {
    return res.status(400).json({ status: "fail", data: error });
  }
};

exports.getAllBillingOverviewController = async (req, res) => {
  const doctorId = req.headers.userId;
  const {userId} = req.body

  try {
    const data = await BillingOverviewModel.find({ userId });
    const finalData = []
    for(const d of data){
      const patientId = d.patientId;
      const patient = await Patient.findById(patientId)
      finalData.push({fullName: patient.fullName, ...d})
      console.log(patient.fullName);
    }
    return res.status(200).json({ status: "success", data: data });
  } catch (error) {
    return res.status(400).json({ status: "fail", data: error });
  }
};
exports.getBillingOverviewControllerById = async (req, res) => {
  const doctorId = req.headers.userId;
  const { id } = req.params;

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const data = await BillingOverviewModel.find({ doctorId, _id: id });
      return res.status(200).json({ status: "success", data });
    } else {
      return res.status(400).json({ status: "fail", data: "Invalid id" });
    }
  } catch (error) {
    return res.status(400).json({ status: "fail", data: error });
  }
};
exports.updateBillingOverviewController = async (req, res) => {
  const doctorId = req.headers.userId;
  const { id } = req.params;
  const { totalBill, receivedBill } = req.body;

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const DueBill = Number(totalBill) - Number(receivedBill);
      req.body.DueBill = DueBill;
      const data = await BillingOverviewModel.findOneAndUpdate(
        {
          doctorId,
          _id: id,
        },
        req.body
      );
      return res.status(200).json({ status: "success", data });
    } else {
      return res.status(400).json({ status: "fail", data: "Invalid id" });
    }
  } catch (error) {
    return res.status(400).json({ status: "fail", data: error });
  }
};

exports.deleteBillingOverviewController = async (req, res) => {
  const doctorId = req.headers.userId;
  const { id } = req.params;

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const data = await BillingOverviewModel.findOneAndDelete({
        doctorId,
        _id: id,
      });
      return res.status(200).json({ status: "success", data });
    } else {
      return res.status(400).json({ status: "fail", data: "Invalid id" });
    }
  } catch (error) {
    return res.status(400).json({ status: "fail", data: error });
  }
};
