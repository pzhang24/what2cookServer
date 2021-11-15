import express from 'express';
import uuid from 'uuid';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router();

// Create new group
router.post(
    '/',
    async (req, res) => {
        const result = await prisma.group.create({
            data: {}
        })
        res.json(result);
    }
)

// Get all groups
router.get(
    '/',
    async (req, res) => {
        const groups = await prisma.group.findMany({});
        res.json(groups);
    }
)

// Get group by id
router.get(
    '/:id',
    async (req, res) => {
        const { id } = req.params;
        const group = await prisma.group.findUnique({
            where: {
                id: id
            }
        })
        if (!group) {
            return res.status(404).json({ msg: 'Group not found' });
        }
        res.json(group);
    }
)

// Delete group by id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const groupDeleted = await prisma.group.delete({ where: { id }});
        res.json({
            "group deleted": groupDeleted
        });
    } catch {
        return res.status(404).json({ msg: 'Group not found' });
    }
})

// Members
// Create new members within a group
router.post('/:id/members', async (req, res) => {
    const { id } = req.params;
    const { membersToAdd } = req.body; // Validate that it is an array?
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
        },
        include: {
            members: true,
        }
    })
    if (!updatedGroup) {
        return res.status(404).json({ msg: 'Group not found' });
    }
    res.json(updatedGroup);
})

// Get all members within a group
router.get('/:id/members', async (req, res) => {
    const { id } = req.params;
    const groupWithMembers = await prisma.group.findUnique({
        where: {
            id: id,
        },
        include: {
            members: true,
        }
    });
    if (!groupWithMembers) {
        return res.status(404).json({ msg: 'Group not found' });
    }
    res.json(groupWithMembers);
})

// Update a member within a group
router.patch('/:id/members/:memberId', async (req, res) => {
    const { id, memberId } = req.params;
    const { newMemberBody } = req.body;
    try {
        await prisma.member.update({
            where: {
                id: memberId,
            },
            data: {
                ...newMemberBody
            }
        })
    } catch {
        return res.status(404).json({ msg: 'Member not found' });
    }

    const groupWithUpdatedMember = await prisma.group.findUnique({
        where: {
            id: id,
        },
        include: {
            members: true,
        }
    });
    if (!groupWithUpdatedMember) {
        return res.status(404).json({ msg: 'Group not found' });
    }
    res.json(groupWithUpdatedMember);
})

// Delete a member within a group
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
        },
        include: {
            members: true,
        }
    });
    if (!groupWithDeletedMembers) {
        return res.status(404).json({ msg: 'Group not found' });
    }
    res.json(groupWithDeletedMembers);
})

export default router;
