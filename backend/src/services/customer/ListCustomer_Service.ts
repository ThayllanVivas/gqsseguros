import prismaClient from "../../prisma"

class ListCustomer_SERVICE {
    async execute(){
        const response = await prismaClient.customer.findMany({
            select: {
                id: true,
                cpf: true,
                name: true,
                phoneNumber: true
            }
        })

        return response
    }
}

export { ListCustomer_SERVICE }