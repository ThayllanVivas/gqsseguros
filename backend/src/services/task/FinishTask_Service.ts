import prismaClient from "../../prisma";

class FinishTask_SERVICE {
    async execute(id: string, status: boolean){

        const response = await prismaClient.task.update(
            {
                where: {
                    id: id,
                },
                data: {
                    status: !status
                },
                select: {
                    description: true,
                    status: true
                }
            }
        )

        return response;
    }
}

export {FinishTask_SERVICE}