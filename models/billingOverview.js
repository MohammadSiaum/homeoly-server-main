const mongoose = require("mongoose");

const billingOverviewSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    totalBill: {
      type: Number,
      required: true,
    },
    receivedBill: {
      type: Number,
      default: 0,
      required: true,
    },

    DueBill: {
      type: Number,
      default: 0,
      required: true,
    },

    draft: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BillingOverviewModel = mongoose.model(
  "BillingOverview",
  billingOverviewSchema
);

module.exports = BillingOverviewModel;
