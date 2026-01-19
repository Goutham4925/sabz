const express = require("express");
const prisma = require("../prisma/client");
const router = express.Router();

// ------------------------------------
// ADD team member
// POST /api/about-team
// ------------------------------------
router.post("/", async (req, res) => {
  const { aboutId } = req.body;

  const last = await prisma.teamMember.findFirst({
    where: { aboutId },
    orderBy: { order: "desc" },
  });

  const order = last ? last.order + 1 : 1;

  const member = await prisma.teamMember.create({
    data: {
      aboutId,
      name: "",
      role: "",
      image: "",
      order,
    },
  });

  res.json(member);
});

// ------------------------------------
// UPDATE team member
// PUT /api/about-team/:id
// ------------------------------------
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const updated = await prisma.teamMember.update({
    where: { id },
    data: req.body,
  });

  res.json(updated);
});

// ------------------------------------
// DELETE team member
// DELETE /api/about-team/:id
// ------------------------------------
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  await prisma.teamMember.delete({ where: { id } });

  res.json({ success: true });
});

module.exports = router;
