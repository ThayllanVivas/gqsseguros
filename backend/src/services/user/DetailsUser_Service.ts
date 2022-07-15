import prismaClient from "../../prisma"

class DetailsUser_Service{
    async execute(user_id: string){

        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id
            }, 
            select: {
                id: true,
                name: true,
                email: true,
                admin_mode: true,
            }
        })
        return { user }
    }
}

export { DetailsUser_Service }