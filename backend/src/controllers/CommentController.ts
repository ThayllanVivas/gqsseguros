import { NextFunction, Request, Response } from "express"
import prismaClient from "../prisma"

interface EditCommentType{
    text: string,
    id: string
}

class CommentController {
    //get a specifc comment
    async Comment(req: Request, res: Response, next: NextFunction) {
        const id = req.body.id as string
        
        const response = await prismaClient.comment.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                text: true
            }
        })

        return res.json(response);
    }

    //get all comments
    async Comments(req: Request, res: Response, next: NextFunction) {

        const response = await prismaClient.comment.findMany(
            {
                select: {
                    id: true,
                    text: true,
                    task_id: true,
                    created_at: true
                }
            })

        return res.json(response)
    }

    //create a comment
    async CommentCreate(req: Request, res: Response, next: NextFunction) {

        const { text, task_id } = req.body;
        const user_id = req.user_id

        if(!text) {
            throw new Error ("Insira um comentário")
        }
        const response = await prismaClient.comment.create(
            {
                data: {
                    text: text,
                    task_id: task_id,
                    user_id: user_id
                }, 
                select: {
                    id: true,
                    text: true,
                    task_id: true,
                    user_id: true
                }
            })

        return res.json(response);
    }

    //delete a comment
    async CommentDelete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.body

        const response = await prismaClient.comment.delete(
            {
                where: {
                    id: id
                }
            })

        return res.json(response);
    }

    //edit a comment
    async CommentEdit(req: Request, res: Response, next: NextFunction) {

        const { text, id } = req.body;

        //verify if the text was passed
        if(!text) {
            throw new Error ("Insira um comentário")
        }

        const response = await prismaClient.comment.update({
            where: {
                id: id
            }, 
            data: {
                text: text
            }
        })

        return res.json(response);
    }
}

export {CommentController}