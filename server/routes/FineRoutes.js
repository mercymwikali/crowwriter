const express = require("express");
const router = express.Router();
const fineController = require("../controllers/FinesController");

router.route("/create-fine").post(fineController.CreateFine);
router.route("/update-fine/:id").patch(fineController.editFine);
router.route("/get-fines").get(fineController.getFines);
router.route("/get-fine/:id").get(fineController.getFineById);
router.route("/get-writers-fines/:writerId").get(fineController.getFinesByUserId);
router.route("/delete-fine/:id").delete(fineController.deleteFine);

module.exports = router;
