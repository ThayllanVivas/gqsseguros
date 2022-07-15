import prismaClient from "../../prisma";

interface COMMENTTYPES{
    user_id: string
}

class GetComment_SERVICE {
    async execute({ user_id }: COMMENTTYPES) {

        const response = await prismaClient.comment.findMany(
            {
                select: {
                    id: true,
                    text: true,
                    task_id: true,
                    created_at: true
                }
            })

        return response
    }
}

export { GetComment_SERVICE }