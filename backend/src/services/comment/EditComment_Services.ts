import prismaClient from "../../prisma";

interface COMMENTTYPES{
    text: string,
    id: string
}

class EditComment_SERVICE {
    async handle({text, id}: COMMENTTYPES) {

        if(!text) {
            throw new Error ("Insira um comentário")
        }
        const response = await prismaClient.comment.update({
            where: {
                id: id
            }, 
            data: {
                text: text
            }
        })

        return response
    }
}

export { EditComment_SERVICE }