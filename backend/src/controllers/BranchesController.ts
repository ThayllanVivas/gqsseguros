import { NextFunction, Request, Response } from "express";
import prismaClient from "../prisma";

class BranchesController {
    //get all branches
    async Branches(req: Request, res: Response, next: NextFunction){
        const response = await prismaClient.branch.findMany(
            {
                select: {
                    id: true,
                    name: true
                }
            }
        )

        return res.json(response)
    }
}

export {BranchesController}