import prismaClient from "../../prisma";

interface INSURANCE_REQUEST{
    description: string,
    vehiclePrice: string, 
    vehicleName: string,
    vehicleYear: string, 
    category_id: string,
    branch_id: string,
    user_id: string, 
    customer_id: string
}

class CreateTask_SERVICE {
    async execute({description, vehiclePrice, vehicleName, vehicleYear, category_id, branch_id, user_id, customer_id}: INSURANCE_REQUEST){

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

        return newTask;
    }
}

export {CreateTask_SERVICE}