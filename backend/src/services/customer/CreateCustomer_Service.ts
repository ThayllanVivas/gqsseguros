import prismaClient from "../../prisma"

interface CustomerType {
    cpf: string;
    name: string;
    phoneNumber: string;
}

class CreateCustomer_SERVICE {
    async execute({cpf, name, phoneNumber}: CustomerType){

        const verifyCustomer = await prismaClient.customer.findFirst(
            {
                where: {
                    name: name
                }
            }
        )

        if(verifyCustomer) {
            throw new Error("Cliente já existente no banco de dados")
        }

        const response = await prismaClient.customer.create({
            data: {
                cpf: cpf,
                name: name,
                phoneNumber: phoneNumber
            }
        })

        return response
    }
}

export { CreateCustomer_SERVICE}