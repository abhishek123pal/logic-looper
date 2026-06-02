import express from "express";
import prisma from "../prisma/client.js";

const router = express.Router();

router.post("/guest", async (req, res) => {
  const user = await prisma.user.create({});
  res.json(user);
});

router.post("/google", async (req, res) => {
  const { email } = req.body;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({ data: { email } });
  }

  res.json(user);
});

export default router;
