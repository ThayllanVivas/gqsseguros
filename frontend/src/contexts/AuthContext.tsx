import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { createContext, ReactNode, useEffect, useState} from 'react'
import { toast } from 'react-toastify';
import { api } from '../services/apiClient';

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;

    modalViewStatus: boolean;
    setModalViewStatus: (value: boolean) => void;
    modalTask: ModalTaskType;
    setModalTask: (value: ModalTaskType) => void;
    modalTaskID: string;
    setModalTaskID: (value: string) => void;
    modalComments: CommentTaskType[];
    setModalComments: (value: CommentTaskType[]) => void;

    func_updateModalData: (TASK_ID: string) => Promise<void>;
    func_toogleOpenCloseModalView: (TASK_ID?: string) => Promise<void>;
}

export type ModalTaskType = {
    id: string,
    status: string,
    description: string,

    vehicleName: string,
    vehiclePrice: string,
    vehicleYear: string,

    user_id: string,
    branch_id: string,
    category_id: string,
    customer_id: string,
    created_at: string
}

type CommentTaskType = {
    id: string,
    text: string,
    task_id: string,
    created_at: string
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

// CREATE CONTEXT section
export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({children}: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>()
    const [tasks, setTasks] = useState([]) //KEEP IT ON THIS COMPONENT
    
    const [modalViewStatus, setModalViewStatus] = useState(false) //KEEP IT ON THIS COMPONENT
    const [modalTask, setModalTask] = useState<ModalTaskType>() //KEEP IT ON THIS COMPONENT
    const [modalTaskID, setModalTaskID] = useState<string>('') // KEEP IT ON THIS COMPONENT
    const [modalComments, setModalComments] = useState<CommentTaskType[]>([]) //KEEP IT ON THIS COMPONENT

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

        async function toGetAllTask(){
            const taskList = await api.get("/task")

            setTasks(taskList.data)
        }

        toGetAllTask()
    }, [])

    //  SIGN IN function
    async function signIn({email, password}: SignInProps){
        try {
            const response = await api.post('/signin', {
                email, 
                password
            })

            // console.log(response)

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
            toast.error("Erro ao acessar!")
            console.log("Erro ao acessar " , err)
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

            Router.push('/')
        } catch (err) {
            toast.error("Erro ao criar conta!")
            console.log('ERRO AO CADASTRAR')
        }   
    }

    // -> function to INSERT data inside of the modal variable
    async function func_toUpdateCommments(){
        const response = await api.get("/comment")
        return response.data
    }

    // -> function to UPDATE data for modal
    async function func_updateModalData(TASK_ID: string){
        // console.log('-<><t>: ', TASK_ID)
        const commentsUpdatedResponse: CommentTaskType[] = await func_toUpdateCommments() // to update the user comments
        let commentsFilteredForModal = [] //to aux
    
        const taskFilteredForModal = tasks.find((task: any) => task.id === TASK_ID)
        commentsUpdatedResponse.map((comment: CommentTaskType) => {
            if(comment.task_id === TASK_ID) {
                commentsFilteredForModal.push(comment)
            }
        })

        setModalTask(taskFilteredForModal) //set modal task
        setModalTaskID(TASK_ID) //set ID of modal task
        setModalComments(commentsFilteredForModal) //set modal comments
    }

    // -> function to OPEN or CLOSE modal
    async function func_toogleOpenCloseModalView(TASK_ID?: string){
        // console.log('-<><s>: ', TASK_ID)
        await func_updateModalData(TASK_ID)
        setModalViewStatus(!modalViewStatus) // set modal view status
    }

    return (
        <AuthContext.Provider value={
            {
                user, 
                isAuthenticated, 
                signIn, signOut, 
                signUp, 
                modalViewStatus, 
                setModalViewStatus,
                modalTask,
                setModalTask, 
                modalTaskID, 
                setModalTaskID, 
                modalComments, 
                setModalComments,
                func_updateModalData,
                func_toogleOpenCloseModalView, 
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}