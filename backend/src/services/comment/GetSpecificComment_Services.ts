import prismaClient from "../../prisma";

class GetSpecificComment_SERVICES {
    async execute(id: string) {
        const response = await prismaClient.comment.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                text: true
            }
        })

        return response
    }
}
export { GetSpecificComment_SERVICES }