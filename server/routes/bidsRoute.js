const express = require("express");
const router = express.Router();
const bidController = require("../controllers/bidsController");
const { verifyJwt } = require("../middleware/verifyJwt"); // Import the verifyJwt middleware function

// Apply verifyJwt middleware to protected routes
// router.use(verifyJwt);

router.route("/create-bid").post(bidController.createBid);
router.route("/get-bids").get(bidController.getAllBidsWithCountsAndWriters);
router.route("/get-bid/:id").get(bidController.getBidById);
router.route("/listBids/:id").get(bidController.getAllBidsForOrder);
router.route("listbids").get(bidController.getAllBids);
router.route("/delete-bid/:id").delete(bidController.deleteBid)
router.route("/bids/get-writers-bids/:writerId").get(bidController.getBidsByWriterId);
router.route("delete-writer-bids/:writerId").delete(bidController.deleteBidByWriterId);


module.exports = router;