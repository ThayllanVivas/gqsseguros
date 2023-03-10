import { NextFunction, Request, Response } from "express"
import prismaClient from "../prisma"

class TaskController {
    //list an specific task
    async Task(req: Request, res: Response, next: NextFunction){

        const task_id = req.query.task_id as string


        const listofProducts = await prismaClient.task.findMany(
            {
                where: {
                    id: task_id
                },
                select: {
                    id: true,
                    description: true,
                    status: true,

                    vehiclePrice: true,
                    vehicleName: true,
                    vehicleYear: true,

                    branch_id: true,
                    category_id: true,
                    user_id: true,
                    customer_id: true,
                    
                    created_at: true
                }
            }
        )
        // console.log("->", listofProducts[0].id)
        return res.json(listofProducts);
    }

    //list all tasks
    async Tasks(req: Request, res: Response, next: NextFunction){

        const user_id = req.user_id

        const admin_user = await prismaClient.user.findFirst({
            where: {
                id: user_id,
                admin_mode: true
            }
        })

        let listOfProducts

        if(admin_user){
            listOfProducts = await prismaClient.task.findMany(
                {
                    select: {
                        id: true,
                        description: true,
                        status: true,
    
                        vehiclePrice: true,
                        vehicleName: true,
                        vehicleYear: true,
    
                        branch_id: true,
                        category_id: true,
                        user_id: true,
                        customer_id: true,
                        
                        created_at: true
                    }
                }
            )
        } else {
            listOfProducts = await prismaClient.task.findMany(
            {
                where: {
                    user_id: user_id
                },
                select: {
                    id: true,
                    description: true,
                    status: true,

                    vehiclePrice: true,
                    vehicleName: true,
                    vehicleYear: true,

                    branch_id: true,
                    category_id: true,
                    user_id: true,
                    customer_id: true,
                    
                    created_at: true
                }
            }
        )
    }

        return res.json(listOfProducts);
    }

    //list all tasks by CATEGORY
    async TasksByCategory(req: Request, res: Response, next: NextFunction){

        const category_id = req.query.category_id as string;
        
        const listOfFilteredProducts = await prismaClient.task.findMany(
            {
                where: {
                    category_id: category_id
                }
            }
        )

        return res.json(listOfFilteredProducts);
    }

    //create new task
    async TaskCreate(req: Request, res: Response, next: NextFunction){

        const user_id = req.user_id

        const {description, vehicleName, vehicleYear, vehiclePrice, branch_id, category_id ,customer_id} = req.body;

        const newTask = await prismaClient.task.create(
            {
                data: {
                    description: description,

                    vehicleName: vehicleName,
                    vehicleYear: vehicleYear,
                    vehiclePrice: vehiclePrice,

                    user_id: user_id,

                    branch_id: branch_id,
                    category_id: category_id,
                    customer_id: customer_id,
                },
                select: {
                    id: true,
                    description: true
                }
            }
        )

        return res.json(newTask);
    }

    //finish or unfinish a task
    async TaskChangeStatus(req: Request, res: Response, next: NextFunction){

        const {id, status} = req.body

        const response = await prismaClient.task.update(
            {
                where: {
                    id: id,
                },
                data: {
                    status: !status
                },
                select: {
                    description: true,
                    status: true
                }
            }
        )

        return res.json(response);
    }

    //change responsable for task
    async TaskChangeUser(req: Request, res: Response, next: NextFunction){

        const {taskID, newUserID} = req.body

        const response = await prismaClient.task.update({
            where:{
                id: taskID
            },
            data: {
                user_id: newUserID
            },
            select: {
                id: true,
                description: true,
                status: true,

                vehiclePrice: true,
                vehicleName: true,
                vehicleYear: true,

                branch_id: true,
                category_id: true,
                user_id: true,
                customer_id: true,
                
                created_at: true
            }
        })

        return res.json(response);
    }
}

export {TaskController}