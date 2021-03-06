const { Router } = require("express");
const User = require("../models/User");
const Visualisation = require("../models/Visualisation");
const { catchAsync } = require("../middleware/errors");
const owner = require("../middleware/owner");
const { UnprocessableEntity } = require("../errors");
const router = Router();

router.get(
  "/",
  catchAsync(async (req, res) => {
    const data = await Visualisation.find(
      { owner: req.user.id },
      "id name type"
    );
    res.status(200).json({ data });
  })
);

router.get("/:id", owner, (req, res) => {
  const { type, data } = req.record;
  res.status(200).json({ type, data });
});

router.post(
  "/create",
  catchAsync(async (req, res) => {
    const { name, type, data } = req.body;
    const vis = await Visualisation.create({
      name,
      data,
      type,
      owner: req.user.id,
    });
    res.status(201).json({ _id: vis._id, name, type });
  })
);

// DELETE doesn't take a body
router.delete(
  "/delete/:id",
  owner,
  catchAsync(async (req, res) => {
    await Visualisation.deleteOne({ _id: req.params.id });
    res.status(204).send("resource deleted successfully");
  })
);

router.put(
  "/update/:id",
  owner,
  catchAsync(async (req, res) => {
    const doc = req.record;
    doc.data = req.body.data;
    await doc.save();
    res.status(204).send("resource updated successfully");
  })
);

module.exports = router;
