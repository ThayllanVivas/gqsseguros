import { NextFunction, Request, Response } from "express";
import prismaClient from "../prisma";

class CustomerController {
    //list all customer
    async Customers(req: Request, res: Response, next: NextFunction){
        const response = await prismaClient.customer.findMany({
            select: {
                id: true,
                cpf: true,
                name: true,
                phoneNumber: true
            }
        })

        return res.json(response)
    }

    //create a customer
    async CustomerCreate(req: Request, res: Response, next: NextFunction){

        const {cpf, name, phoneNumber} = req.body

        const verifyCustomer = await prismaClient.customer.findFirst(
            {
                where: {
                    name: name
                }
            }
        )

        if(verifyCustomer) {
            throw new Error("Cliente já existente no banco de dados")
        }

        const response = await prismaClient.customer.create({
            data: {
                cpf: cpf,
                name: name,
                phoneNumber: phoneNumber
            }
        })

        return res.json(response)
    }
}

export {CustomerController}