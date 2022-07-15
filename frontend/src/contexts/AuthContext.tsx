import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import {createContext, ReactNode, useEffect, useState} from 'react'
import { toast } from 'react-toastify';
import { api } from '../services/apiClient';

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
    context_toUpdateTasks: () => Promise<void>;
    context_toUpdateCustomers: () => Promise<void>;
    context_toUpdateComments: () => Promise<void>;
    context_updateButton: () => Promise<void>;
    context_toogleFinishUnfinishTask: (TASK) => Promise<void>;
    context_updateModalData: (TASK_ID) => Promise<void>;
    context_toogleOpenCloseModalView: (TASK_ID) => Promise<void>;
    context_handleAddComment: (comment: string) => Promise<void>;
    context_handleDeleteComment: (comment_id) => Promise<void>;
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

    const [user, setUser] = useState<UserProps>()
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
    async function context_toUpdateTasks(){
        const response  = await api.get("/task")
        set_tasks(response.data)
    }

    // -> function to INSERT data inside of the customer variable
    async function context_toUpdateCustomers(){
        const response = await api.get("/customer")
        set_customers(response.data)
    }

    // -> function to INSERT data inside of the modal variable
    async function context_toUpdateComments(){
        const response = await api.get("/comment")
        return response.data
    }

    // -> function to GET all data updated 
    async function context_updateButton(){
        toast.success('Dashboard atualizado')
        await context_toUpdateTasks()
        await context_toUpdateCustomers()
        await context_toUpdateComments()
    }

    // -> function to FINISH or UNFINISH a task
    async function context_toogleFinishUnfinishTask(TASK){

        const response = await api.put("/task/finish-unfinish", {
            id: TASK.id,
            status: TASK.status
        })

        if(response.data.status){
            toast.success('Tarefa concluída!')
        } else {
            toast.warning('Status de conclusão desfeito!')
        }
        
        await context_toUpdateTasks()
    }

    // -> function to UPDATE data for modal
    async function context_updateModalData(TASK_ID: string){
        const response = await context_toUpdateComments() // to update the user comments
    
        const taskFilteredForModal = tasks.find((task: any) => task.id === TASK_ID)
        let commentsFilteredForModal = [] //to aux

        response.map((comment: any) => {
            if(comment.task_id === TASK_ID) {
                commentsFilteredForModal.push(comment)
            }
        })

        set_modal_task(taskFilteredForModal) //set modal task
        set_modal_task_ID(TASK_ID) //set ID of modal task
        set_modal_comments(commentsFilteredForModal) //set modal comments
    }

    // -> function to OPEN / CLOSE modal
    async function context_toogleOpenCloseModalView(TASK_ID?: string){
        // await context_updateButton()
        await context_updateModalData(TASK_ID)
        set_moda_view(!modal_view)
    }

    // -> function to ADD a coment on database
    async function context_handleAddComment(description: string){

        //verify is the user really types anything
        if(description.length == 0){
          toast.error("Insira algum comentário antes")
          return
        }
    
        //insert the new comment inside database
        await api.post('/comment', {
          text: description,
          task_id: modal_task_ID
        })
    
        toast.success("Comentário adicionado com sucesso") //show a sucess message to user

        await context_updateModalData(modal_task_ID) //call function to update modal data
        
    }

    // -> function to DELETE a coment on database
    async function context_handleDeleteComment(comment_id: string){    
        await api.delete("/comment", {
            data: {
                id: comment_id
            }
        })

        toast.success("Comentário removido com sucesso")

        await context_updateModalData(modal_task_ID) //call function to update modal data
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, signIn, signOut, signUp, context_toogleFinishUnfinishTask, context_toogleOpenCloseModalView, context_toUpdateCustomers, context_toUpdateTasks, context_toUpdateComments, context_updateButton, context_updateModalData, context_handleAddComment, context_handleDeleteComment}}>
            {children}
        </AuthContext.Provider>
    )
}