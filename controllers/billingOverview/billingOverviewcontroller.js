const  mongoose = require("mongoose");
const BillingOverviewModel = require("../../models/billingOverview");


exports.createBillingOverviewController = async (req, res) => {
  const {doctorId, patientId, totalBill, receivedBill, draft } = req.body;

  try {
    if (!doctorId || !patientId || !totalBill || !receivedBill) {
      return res
        .status(400)
        .json({ status: "fail", data: "All fields are required" });
    }

    if (receivedBill > totalBill) {
      return res.status(400).json({
        status: "fail",
        data: "Received bill cannot be greater than total bill",
      });
    }

    const DueBill = Number(totalBill) - Number(receivedBill);

    const data = await BillingOverviewModel.create({
      doctorId,
      patientId,
      totalBill,
      receivedBill,
      DueBill,
      draft,
    });

    return res.status(200).json({ status: "success", data });
  } catch (error) {
    return res.status(400).json({ status: "fail", data: error });
  }
};

exports.getAllBillingOverviewController = async (req, res) => {
  const doctorId = req.headers.doctor_id;
  // console.log(doctorId);

  try {
    const data = await BillingOverviewModel.find({ doctorId });
    // console.log(data);

    return res.status(200).json({ status: "success", data });
  } catch (error) {
    return res.status(400).json({ status: "fail", data: error });
  }
};
exports.getBillingOverviewControllerById = async (req, res) => {
  const doctorId = req.headers.doctor_id;
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
  const doctorId = req.headers.doctor_id;
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
  const doctorId = req.headers.doctor_id;
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
