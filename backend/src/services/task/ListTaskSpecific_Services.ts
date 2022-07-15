import prismaClient from "../../prisma";

class ListTaskSpecific_SERVICE {
    async execute(insurance_id: string){

        const listofProducts = await prismaClient.task.findMany(
            {
                where: {
                    id: insurance_id
                },
                select: {
                    id: true,
                    vehiclePrice: true,
                    vehicleName: true,
                    vehicleYear: true,
                    description: true,
                    category_id: true
                }
            }
        )
        // console.log("->", listofProducts[0].id)
        return listofProducts;
    }
}

export {ListTaskSpecific_SERVICE}