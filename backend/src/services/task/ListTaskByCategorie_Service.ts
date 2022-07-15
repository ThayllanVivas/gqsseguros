import prismaClient from "../../prisma";

class ListTaskByCategories_SERVICE {
    async execute(category_id: string){
        
        const listOfFilteredProducts = await prismaClient.task.findMany(
            {
                where: {
                    category_id: category_id
                }
            }
        )

        return listOfFilteredProducts;
    }
}

export {ListTaskByCategories_SERVICE}