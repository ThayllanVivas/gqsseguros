import prismaClient from "../../prisma"

class ListAllBranches_SERVICES {
    async execute(){
        const response = await prismaClient.branch.findMany(
            {
                select: {
                    id: true,
                    name: true
                }
            }
        )

        return response
    }
}

export { ListAllBranches_SERVICES }