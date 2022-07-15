import { prisma } from "@prisma/client";
import prismaClient from "../../prisma";

interface CATEGORYREQUEST{
    name: string;
}

class CreateCategory_SERVICE{
    async execute({name}: CATEGORYREQUEST){

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
        
        return response
    }
}

export {CreateCategory_SERVICE}