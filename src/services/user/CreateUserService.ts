import prismaClient from "../../prisma"
interface UserRequest{
    name: String
    email: String
    password: String
}

class CreateUserService {
    async execute({name, email, password}: UserRequest){
        
        //verificar se enviou o email
        if(!email){
            throw new Error("Email incorrect")
        }

        //Verificar se esse email já esta cadastrado na plataforma
        const userAlreadyExists = await prismaClient.user.findFirst({
            where:{
                email: `${email}`
            }
        })

        if(userAlreadyExists){
            throw new Error("User already exists");
        }

        const user = await prismaClient.user.create({
            data: {
                name: `${name}`,
                email: `${email}`,
                password: `${password}`
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })


        return user;
    }
}


export {CreateUserService}