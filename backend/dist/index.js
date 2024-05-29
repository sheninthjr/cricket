"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, express_1.default)());
app.use(express_1.default.json());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, role } = req.body;
    try {
        const existingUser = yield prisma.user.findUnique({
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
            const newUser = yield prisma.user.create({
                data: Object.assign(Object.assign({}, userData), { Buyer: {
                        create: {},
                    } }),
            });
            return res
                .status(201)
                .json({ message: "User created successfully", newUser });
        }
        const newUser = yield prisma.user.create({
            data: userData,
        });
        res.status(201).json({ message: "User created successfully", newUser });
    }
    catch (error) {
        console.error(error);
    }
}));
app.post("/player", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, age, matches, category, economy, average, careerBest, basePrice, } = req.body;
    try {
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ error: "Player already exists" });
        }
        const newUser = yield prisma.user.create({
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
    }
    catch (error) {
        console.error(error);
    }
}));
app.post("/purchase", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { buyerEmail, playerId } = req.body;
    console.log(buyerEmail);
    try {
        const buyer = yield prisma.user.findUnique({
            where: { email: buyerEmail },
            include: { Buyer: true },
        });
        if (!buyer || !buyer.Buyer) {
            return res.status(404).json({ error: "Buyer not found" });
        }
        const player = yield prisma.player.findUnique({
            where: { id: playerId },
        });
        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }
        const updatedPlayer = yield prisma.player.update({
            where: { id: playerId },
            data: {
                buyerId: buyer.Buyer.id,
                purchased: true,
            },
        });
        res
            .status(200)
            .json({ message: "Player purchased successfully", updatedPlayer });
    }
    catch (error) {
        console.error(error);
    }
}));
app.get("/players/not-sold", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unsoldPlayers = yield prisma.player.findMany({
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
    }
    catch (error) {
        console.error(error);
    }
}));
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
