import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { createContext, ReactNode, useEffect, useState} from 'react'
import { toast } from 'react-toastify';
// import { taskListToAuthContext } from '../pages/dashboard';
import { api } from '../services/apiClient';

interface AuthContextData {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;

    modalViewStatus: boolean;
    setModalViewStatus: (value: boolean) => void;
    modalTask: TaskType;
    setModalTask: (value: TaskType) => void;
    modalTaskID: string;
    setModalTaskID: (value: string) => void;
    modalComments: CommentTaskType[];
    setModalComments: (value: CommentTaskType[]) => void;

    func_updateModalData: (TASK_ID: string) => Promise<void>;
    func_toogleOpenCloseModalView: (TASK_ID?: string) => Promise<void>;
    func_toogleFinishUnfinishTask: (TASK) => Promise<void>;
    func_handleAddComment: (comment: string) => Promise<void>;
    func_handleDeleteComment: (comment_id: string) => Promise<void>;
}

interface TaskInterface {
    data: TaskType[]
}

export type TaskType = {
    id: string,
    status: boolean,
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

interface CommentInterface {
    data: CommentTaskType[]
}

export type CommentTaskType = {
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

interface AuthProviderProps {
    children: ReactNode;
    taskList: TaskType[];
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
    const [tasks, setTasks] = useState([])
    const [comments, setComments] = useState([])
    const [customers, setCustomers] = useState([])
    
    const [modalViewStatus, setModalViewStatus] = useState(false)
    const [modalTask, setModalTask] = useState<TaskType>()
    const [modalTaskID, setModalTaskID] = useState<string>('')
    const [modalComments, setModalComments] = useState<CommentTaskType[]>([])

    const isAuthenticated = !!user;

    // function to update TASK variable
    async function toUpdateTaskList () {
        const response: TaskInterface = await api.get('/task')
        
        setTasks(response.data)

        return response.data
    }
    
    toUpdateTaskList()

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
     async function func_toUpdateTasks(){
        const response  = await api.get("/task")
        setTasks(response.data)
    }

    // function to update TASK variable
    async function toUpdateComments () {
        const response: CommentInterface = await api.get('/comment')
        
        setComments(response.data)

        return response.data
    }
    

    // -> function to FINISH or UNFINISH a task
    async function func_toogleFinishUnfinishTask(TASK){

        const response = await api.put("/task/finish-unfinish", {
            id: TASK.id,
            status: TASK.status
        })

        if(response.data.status){
            toast.success('Tarefa concluída!')
        } else {
            toast.warning('Status de conclusão desfeito!')
        }
        
        await func_toUpdateTasks()
    }

    // -> function to ADD a coment on database
    async function func_handleAddComment(comment: string){

        //verify is the user really types anything
        if(comment.length == 0){
          toast.error("Insira algum comentário antes")
          return
        }
    
        //insert the new comment inside database
        await api.post('/comment', {
          text: comment,
          task_id: modalTaskID
        })
    
        toast.success("Comentário adicionado com sucesso") //show a sucess message to user

        await func_updateModalData(modalTaskID) //call function to update modal data
        
    }

    // -> function to DELETE a coment on database
    async function func_handleDeleteComment(comment_id: string){    
        await api.delete("/comment", {
            data: {
                id: comment_id
            }
        })

        toast.success("Comentário removido com sucesso")

        await func_updateModalData(modalTaskID) //call function to update modal data
    }

    // -> function to INSERT data inside of the customer variable
    async function func_toUpdateCustomers(){
        const response = await api.get("/customer")
        setCustomers(response.data)
    }

    // -> function to UPDATE data for modal
    async function func_updateModalData(TASK_ID: string){

        const commentsUpdatedResponse: CommentTaskType[] = await toUpdateComments() // to update the user comments
        const response = await toUpdateTaskList()
        const taskFilteredForModal = response.find((task: any) => task.id === TASK_ID)
        let commentsFilteredForModal = [] //to aux

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
                func_toogleFinishUnfinishTask,
                func_handleAddComment,
                func_handleDeleteComment
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}