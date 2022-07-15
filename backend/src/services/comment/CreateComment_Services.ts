import prismaClient from "../../prisma";

interface COMMENTTYPES{
    text: string,
    task_id: string,
    user_id: string
}

class CreateComment_SERVICE {
    async handle({text, task_id, user_id}: COMMENTTYPES) {

        if(!text) {
            throw new Error ("Insira um comentário")
        }
        const response = await prismaClient.comment.create(
            {
                data: {
                    text: text,
                    task_id: task_id,
                    user_id: user_id
                }, 
                select: {
                    id: true,
                    text: true,
                    task_id: true,
                    user_id: true
                }
            })

        return response
    }
}

export { CreateComment_SERVICE }