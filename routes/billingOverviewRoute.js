const express = require("express");
const router = express.Router();

const {
  createBillingOverviewController,
  getAllBillingOverviewController,
  getBillingOverviewControllerById,
  updateBillingOverviewController,
  deleteBillingOverviewController,
} = require("../controllers/billingOverview/billingOverviewcontroller");
const verifyAuthMiddleware = require("../middlewares/verifyAuthMiddleware");

router.post(
  "/create-billing-overview",
  verifyAuthMiddleware,
  createBillingOverviewController
);
router.get(
  "/get-all-billing-overview",
  verifyAuthMiddleware,
  getAllBillingOverviewController
);
router.get(
  "/get-billing-overview/:id",
  verifyAuthMiddleware,
  getBillingOverviewControllerById
);
router.post(
  "/update-billing-overview/:id",
  verifyAuthMiddleware,
  updateBillingOverviewController
);
router.post(
  "/delete-billing-overview/:id",
  verifyAuthMiddleware,
  deleteBillingOverviewController
);

module.exports = router;
