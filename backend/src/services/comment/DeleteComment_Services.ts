import prismaClient from "../../prisma";

class DeleteComment_SERVICE {
    async handle(id: string) {

        const response = await prismaClient.comment.delete(
            {
                where: {
                    id: id
                }
            })

        return response
    }
}

export { DeleteComment_SERVICE }