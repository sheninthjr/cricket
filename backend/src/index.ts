import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express());
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }
    const userData = {
      firstName,
      lastName,
      email,
      role,
    };

    if (role === "Buyer") {
      const newUser = await prisma.user.create({
        data: {
          ...userData,
          Buyer: {
            create: {},
          },
        },
      });

      return res
        .status(201)
        .json({ message: "User created successfully", newUser });
    }
    const newUser = await prisma.user.create({
      data: userData,
    });

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    console.error(error);
  }
});

app.post("/player", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    age,
    matches,
    category,
    economy,
    average,
    careerBest,
    basePrice,
  } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Player already exists" });
    }
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        role: "Player",
        Player: {
          create: {
            age,
            matches,
            category,
            economy: category === "Bowler" ? economy : null,
            average: category === "Bastman" ? average : null,
            careerBest,
            basePrice,
          },
        },
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
  }
});

app.post("/purchase", async (req, res) => {
  const { buyerEmail, playerId } = req.body;
  console.log(buyerEmail);
  try {
    const buyer = await prisma.user.findUnique({
      where: { email: buyerEmail },
      include: { Buyer: true },
    });

    if (!buyer || !buyer.Buyer) {
      return res.status(404).json({ error: "Buyer not found" });
    }
    const player = await prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: {
        buyerId: buyer.Buyer.id,
        purchased: true,
      },
    });

    res
      .status(200)
      .json({ message: "Player purchased successfully", updatedPlayer });
  } catch (error) {
    console.error(error);
  }
});

app.get("/players/not-sold", async (req, res) => {
  try {
    const unsoldPlayers = await prisma.player.findMany({
      where: { buyerId: null },
      include: { user: true },
    });

    const players = unsoldPlayers.map((player) => ({
      id: player.id,
      firstName: player.user.firstName,
      lastName: player.user.lastName,
      age: player.age,
      matches: player.matches,
      category: player.category,
      careerBest: player.careerBest,
      basePrice: player.basePrice,
    }));

    res.status(200).json(players);
  } catch (error) {
    console.error(error);
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
