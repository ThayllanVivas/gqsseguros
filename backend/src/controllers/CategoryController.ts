import { NextFunction, Request, Response } from "express";
import prismaClient from "../prisma";

class CategoryController {

    // list all categories
    async Categories(req: Request, res: Response, next: NextFunction){

        const response = await prismaClient.category.findMany(
            {
                select: {
                    id: true,
                    name: true,
                }
            }
        )

        return res.json(response);
    }

    // create a category
    async CategoryCreate(req: Request, res: Response, next: NextFunction){

        const {name} = req.body;

        //validating name of category
        if(!name){
            throw new Error("Invalid name")
        }

        //verifying if name of the category already exists
        const categoryExists = await prismaClient.category.findFirst(
            {
                where: {
                    name: name
                }
            }
        )   
        if (categoryExists && categoryExists.name == name){
            return "Category already exists!!!"
            // throw new Error("Category already exists!!")
        }

        //creating the new category
        const response = await prismaClient.category.create(
            {
                data: {
                    name: name,
                },
                select: {
                    id: true,
                    name: true,
                }
            }
        )
        
        return res.json(response)
    }
}

export {CategoryController}