import prismaClient from "../../prisma";

class ListTask_SERVICE {
    async execute(user_id: string){

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

        return listOfProducts;
    }
}

export {ListTask_SERVICE}