import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { createContext, ReactNode, useEffect, useState} from 'react'
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { TaskType } from './TypesAndInterfaces';

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
    searchInfo: string;
    setSearchInfo: (searchInfo: string) => void;
    tasksFiltered: TaskType[];
    setTasksFiltered: (tasks: TaskType[])  => void;
    modalTask: TaskType;
    setModalTask: (task: TaskType)  => void;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export function signOut(){
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    } catch {
        console.log("Erro ao deslogar")
    }
}

const delay = (amount = 2000) => new Promise(resolve => setTimeout(resolve, amount)) //usar para tornar alguma funcionalidae mais lenta ao olho

async function toastMessage (type: string, msg: string){
    if(type == "sucess"){
        toast.success(msg)
    } else {
        toast.error(msg)
    }

    await delay(0)
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({children}: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>() //KEEP IT ON THIS COMPONENT
    const [searchInfo, setSearchInfo] = useState<string>('') //KEEP IT ON THIS COMPONENT
    const [tasksFiltered, setTasksFiltered] = useState<TaskType[]>([]) //KEEP IT ON THIS COMPONENT
    const [modalTask, setModalTask] = useState<TaskType>() //KEEP IT ON THIS COMPONENT
    const isAuthenticated = !!user;

    //verify token of the user
    useEffect(() => {
        const {'@nextauth.token': token} = parseCookies();

        if(token) {
            api.get('/me').then((response) => {
                const {id, name, email} = response.data;

                setUser({id, name, email});
            })
            .catch (() => {
                //caso não haja token nos cookies necessario deslogar usuario
                signOut()
            })
        }
    }, [])

    //  SIGN IN function
    async function signIn({email, password}: SignInProps){
        try {
            const response = await api.post('/signin', {
                email, 
                password
            })

            const {id, name, token} = response.data

            setCookie(undefined, "@nextauth.token", token, {
                maxAge: 60 * 60 * 24 * 30, //30
                path: "/"
            })

            setUser ({id, name, email})

            // Passar para próximas requisições o token do usuário
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            // Exibir mensagem de sucesso
            toastMessage("sucess", "Login realizado com sucesso")

            // Redirecionar o user para a página de dashboard
            // Router.push("/dashboard")
            Router.push('/dashboard')
        } catch (err){
            toast.error(err.response.data)
        }
    }

    //  SIGN UP function
    async function signUp({name, email, password}: SignUpProps){
        
        try {
            await api.post('/signup', {
                name, email, password
            })

            // Exibir mensagem de sucesso
            toast.success("Conta criada com sucesso")

        } catch (err) {
            toast.error(err.response.data)
            console.log(err.response.data)
        }   
    }

    return (
        <AuthContext.Provider value={
            {user, 
            isAuthenticated, 
            signIn, signOut, 
            signUp, 
            searchInfo, 
            setSearchInfo, 
            tasksFiltered, 
            setTasksFiltered,
            modalTask,
            setModalTask}}>
            {children}
        </AuthContext.Provider>
    )
}