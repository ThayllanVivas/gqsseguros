import prismaClient from "../../prisma";

class ListCategory_SERVICE{
    async execute(){

        const categories = await prismaClient.category.findMany(
            {
                select: {
                    id: true,
                    name: true,
                }
            }
        )

        return categories;
    }
}

export {ListCategory_SERVICE}