const express = require("express");
const prisma = require("../prisma/client");
const router = express.Router();

// ADD milestone
router.post("/", async (req, res) => {
  const { aboutId, year, title, desc } = req.body;

  const last = await prisma.aboutTimeline.findFirst({
    where: { aboutId },
    orderBy: { order: "desc" },
  });

  const order = last ? last.order + 1 : 1;

  const item = await prisma.aboutTimeline.create({
    data: { aboutId, year, title, desc, order },
  });

  res.json(item);
});

// UPDATE milestone
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const updated = await prisma.aboutTimeline.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
});

// DELETE milestone
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.aboutTimeline.delete({ where: { id } });
  res.json({ success: true });
});

module.exports = router;
