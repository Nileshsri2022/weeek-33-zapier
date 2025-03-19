
import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";
import { prismaClient } from "../db";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const id: string = req.id;
        const body = req.body;
        const parsedData = ZapCreateSchema.safeParse(body);
        console.log("Parsed data:");
        console.log(parsedData);

        if (!parsedData.success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            });
        }
        console.log("Parsed data success");


        console.log("hererskmc")
        console.log("cdsjcsdhjc")
        const actionIds = parsedData.data.actions.map(x => x.availableActionId);
        console.log("actionIds");
        const existingActions = await prismaClient.availableAction.findMany({
            where: {
                id: {
                    in: actionIds
                }
            }
        });
        console.log(actionIds,existingActions)
        console.log(actionIds.length, existingActions.length);

        if (existingActions.length !== actionIds.length) {
            return res.status(400).json({
                message: "Some actions do not exist",
                available: existingActions.map(a => a.id),
                requested: actionIds
            });
        }
        console.log("here")

        // Check if user exists
        const user = await prismaClient.user.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        console.log("here2")
        const zapId = await prismaClient.$transaction(async tx => {
            const zap = await tx.zap.create({
                data: {
                    userId: parseInt(id),
                    triggerId: "",
                    actions: {
                        create: parsedData.data.actions.map((x, index) => ({
                            actionId: x.availableActionId,
                            sortingOrder: index,
                            metadata: x.actionMetadata || {}
                        }))
                    }
                }
            });


            const trigger = await tx.trigger.create({
                data: {
                    triggerId: parsedData.data.availableTriggerId,
                    zapId: zap.id,
                }
            });
            console.log("trigger",trigger);

            await tx.zap.update({
                where: {
                    id: zap.id
                },
                data: {
                    triggerId: trigger.id
                }
            });

            return zap.id;
        });
        console.log("zapid",zapId);
        return res.json({ zapId });
    } catch (error) {
        console.error("Error creating zap:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const id = req.id;
    const zaps = await prismaClient.zap.findMany({
        where: {
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zaps
    })
})

router.get("/:zapId", authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;

    const zap = await prismaClient.zap.findFirst({
        where: {
            id: zapId,
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zap
    })

})

export const zapRouter = router;