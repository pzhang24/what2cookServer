"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    const result = await prisma.group.create({
        data: {}
    });
    res.json(result);
});
router.get('/', async (req, res) => {
    const groups = await prisma.group.findMany({});
    res.json(groups);
});
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const group = await prisma.group.findUnique({
        where: {
            id: id
        }
    });
    if (!group) {
        return res.status(404).json({ msg: 'Group not found' });
    }
    res.json(group);
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const groupDeleted = await prisma.group.delete({ where: { id } });
        res.json({
            "group deleted": groupDeleted
        });
    }
    catch {
        return res.status(404).json({ msg: 'Group not found' });
    }
});
router.post('/:id/members', async (req, res) => {
    const { id } = req.params;
    const { membersToAdd } = req.body;
    const updatedGroup = await prisma.group.update({
        where: {
            id: id
        },
        data: {
            members: {
                createMany: {
                    data: membersToAdd,
                }
            }
        }
    });
    res.json(updatedGroup);
});
router.get('/:id/members', async (req, res) => {
    const { id } = req.params;
    const groupWithMembers = await prisma.group.findUnique({
        where: {
            id: id,
        },
        select: {
            members: true,
        }
    });
    res.json(groupWithMembers);
});
router.delete('/:id/members/:memberId', async (req, res) => {
    const { id, memberId } = req.params;
    const groupWithDeletedMembers = await prisma.group.update({
        where: {
            id: id,
        },
        data: {
            members: {
                deleteMany: { id: memberId },
            }
        }
    });
    res.json(groupWithDeletedMembers);
});
exports.default = router;
//# sourceMappingURL=groups.js.map