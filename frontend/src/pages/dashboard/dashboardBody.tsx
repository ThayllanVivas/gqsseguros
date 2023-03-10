// -- IMPORTs AREA -- //
import STYLES from './dashboard.module.scss'
import { api } from '../../services/api'
import { toast } from 'react-toastify'
import { FiRefreshCcw } from "react-icons/fi"
import { ModalComponent } from '../../components/modal'
import { useContext, useEffect, useState } from 'react'
import { CommentTypes, CustomerType, DashboardProps, TaskType, UserType } from '../../contexts/TypesAndInterfaces'
import { AuthContext } from '../../contexts/AuthContext'


// -- COMPONENT AREA -- //
export function Body({tasksFSSP, customersFSSP, categoriesFSSP}: DashboardProps){

    // -- USESTATE section -- //
    const [tasks, set_Tasks] = useState<TaskType[]>(tasksFSSP) //KEEP IT ON THIS COMPONENT
    const [customers, set_Customers] = useState(customersFSSP) //KEEP IT ON THIS COMPONENT
    const [tasks2, set_Tasks2] = useState<TaskType[]>(tasks) //KEEP IT ON THIS COMPONENT
    const [tasksDates, set_TaskDates] = useState<string[]>([])
    const [tasksStatusTrueQuantity, set_TasksStatusTrueQuantity] = useState<number>() //KEEP IT ON THIS COMPONENT
    const [tasksStatusFalseQuantity, set_TasksStatusFalseQuantity] = useState<number>() //KEEP IT ON THIS COMPONENT

    const [modalView, set_ModalView] = useState(false) //KEEP IT ON THIS COMPONENT
    const [user, set_user] = useState<UserType>()
    const [users, set_users] = useState<UserType[]>()

    const [modalTaskID, set_ModalTaskID] = useState<string>('') // KEEP IT ON THIS COMPONENT
    const [modalComments, set_ModalComments] = useState<CommentTypes[]>([]) //KEEP IT ON THIS COMPONENT
    const [modalCustomer, set_ModalCustomer] = useState<CustomerType>() //KEEP IT ON THIS COMPONENT
    const [usersNotResponsable, set_UsersNotResponsable] = useState<UserType[]>()
    const [trueTasksActive, set_TrueTasksActive] =  useState<boolean>(false)
    const [falseTasksActive, set_FalseTasksActive] =  useState<boolean>(false)
    const [totalTasksActive, set_TotalTasksActive] =  useState<boolean>(true)

    // -- USECONTEXT section -- //
    const {setSearchInfo} = useContext(AuthContext)
    const {tasksFiltered} = useContext(AuthContext)
    const {modalTask, setModalTask} = useContext(AuthContext)

    

    // to change tasks being show
    useEffect(() => {
        func_toShowTotalTasks()
      }, [tasksFiltered])

    // to change quantity of task's status and change tasks date
    useEffect(() => {
        func_toUpdateTasksQuantity()
        func_toGetDatesOfTasks()
    }, [tasks2])

    //to get user info
    useEffect(() => {
      func_toGetUsersInfo()
    }, [])

    // ----------------- FUNCTION section -----------------

    //it get info of users
    async function func_toGetUsersInfo(){
        const response = await api.get('/me')
        set_user(response.data)
        
        const responseUsers = await api.get('/users')
        set_users(responseUsers.data)
    }

    // it update modal task
    async function func_toUpdateModalTask(){
        const response  = await api.get("/task")
        let taskFiltered = response.data.find((task) => task.id === modalTaskID)
        setModalTask(taskFiltered)
    }

    async function func_toGetTheOnesNotResponsable(task: TaskType){
        let notMe = users.filter((userX) => userX.id !== user.id)

        let notResponsable = users.filter((userX) => userX.id !== task.user_id)
        set_UsersNotResponsable(notResponsable)
        // console.log('notResponsable', notResponsable)
    }

    // it changes all tasks who is being show to the filtered ones
    async function func_handleSetFilteredTasks(){
        if(tasksFiltered.length>0){
            set_Tasks2(tasksFiltered)
        } else {
            set_Tasks2(tasks)
        }
    }

    // it get task state up to date
    async function func_toUpdateTasks(){
        const response  = await api.get("/tasks")
        set_Tasks(response.data)
        set_Tasks2(response.data)
    }

    // it update and get modal comments into modaComments state
    async function func_toUpdateAndFilterModalComments(taskID: string){
        let commentsFilteredForModal = [] //to aux
        const response = await api.get("/comments")

        response.data.map((comment: CommentTypes) => {
            if(comment.task_id === taskID) {
                commentsFilteredForModal.push(comment)
            }
        })
        commentsFilteredForModal.reverse()
        set_ModalComments(commentsFilteredForModal) //set modal comments
    }

    // it update dashboard to base datas
    async function func_toUpdateDashboard(){
        await func_toUpdateTasks()
        await func_toupdateCustomers()
        await func_toUpdateTasksQuantity()

        setSearchInfo('')
        set_TotalTasksActive(true)
        set_TrueTasksActive(false)
        set_FalseTasksActive(false)

        toast.success('Dashboard atualizado')
    }

    // it updates customers state variable
    async function func_toupdateCustomers(){
        const response = await api.get("/customers")
        set_Customers(response.data)
    }

    // it counts quantity of each status tasks
    async function func_toUpdateTasksQuantity(){
        const response  = await api.get("/tasks")

        let statusTRUE = 0
        let statusFALSE = 0

        if(tasksFiltered.length > 0){
            tasksFiltered.map((task: TaskType)=> {
                if(task.status) {
                    statusTRUE += 1
                }
                else {
                    statusFALSE += 1
                }
            })
        } else {
            response.data.map((task: TaskType)=> {
                if(task.status) {
                    statusTRUE += 1
                }
                else {
                    statusFALSE += 1
                }
            })
        }
        
        set_TasksStatusTrueQuantity(statusTRUE)
        set_TasksStatusFalseQuantity(statusFALSE)
    }

    // it works with tasks dates 
    async function func_toGetDatesOfTasks(){
        let dates = [] //var aux

        //transformando a data em object e inserindo dentro da variavel DATES
        tasks2.map((task: any) => {
            let timeSlamp = new Date(task.created_at) 
            dates.push(timeSlamp) 
        })

        // organizando as datas por ordem cronológica
        dates.sort((a,b) => {
            if (a > b) return 1
            if (b > a) return -1
            return 0
        })

        let datesToString = [] //aux

        //trasnformando as datas organizadas em string
        dates.map((date) => {
            datesToString.push(date.toLocaleDateString())
        })

        //filtering dates to avoid duplicates dates
        const filteredArray = datesToString.filter((ele, pos) => {
            return datesToString.indexOf(ele) == pos
        })
        filteredArray.reverse()
        

        set_TaskDates(filteredArray)
    }

    // main function to update modal data
    async function func_toUpdateModalData(taskID: string){
        await func_toUpdateAndFilterModalComments(taskID) // to update the user comments

        const taskFilteredForModal = tasks.find((task: any) => task.id === taskID)
        const customerFilteredForModal = customers.find(customer => customer?.id == taskFilteredForModal?.customer_id)
      
        set_ModalTaskID(taskID) //set ID of modal task
        setModalTask(taskFilteredForModal) //set modal task
        set_ModalCustomer(customerFilteredForModal) //set modal customer
    }

    // it updates home dashboard page with tasks available
    async function func_toShowTotalTasks(){
        set_TotalTasksActive(true)
        set_TrueTasksActive(false)
        set_FalseTasksActive(false)
        await func_handleSetFilteredTasks()
    }

    // it filter tasks according to status of the tasks and tasks avaible at the moment
    async function func_handleFilterTasks(status: boolean){
        await func_toUpdateTasks()

        if(status){
            set_TrueTasksActive(true)
            set_FalseTasksActive(false)
            set_TotalTasksActive(false)
        } else {
            set_FalseTasksActive(true)
            set_TrueTasksActive(false)
            set_TotalTasksActive(false)
        }

        let data = new Array// to aux
        if(tasksFiltered.length > 0){
            console.log('entrou')
            // set_Tasks2(tasksFiltered)
            data.push(tasksFiltered.filter((task) => task.status === status))
        } else {
            // set_Tasks2(tasks)
            data.push(tasks.filter((task) => task.status === status))
        }
        
        set_Tasks2(data[0])
        await func_toGetDatesOfTasks()
    }

    // it add a comment into comment database
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

        await func_toUpdateModalData(modalTaskID) //call function to update modal data
        
    }

    // it delete a comment into comment database
    async function func_handleDeleteComment(comment_id: string){    
        await api.delete("/comment", {
            data: {
                id: comment_id
            }
        })

        toast.success("Comentário removido com sucesso")

        await func_toUpdateModalData(modalTaskID) //call function to update modal data
    }

    // it finish or unfinish a specific task from Modal
    async function func_handleFinishUnfinishTask(task: TaskType){
        const response = await api.put("/task/status", {
            id: task.id,
            status: task.status
        })

        if(response.data.status){
            toast.success('Tarefa concluída!')
            set_ModalView(false)
        } else {
            toast.warning('Status de conclusão desfeito!')
        }
        
        await func_toUpdateTasks()
    }

    // it close modal 
    async function func_handleCloseModalView(){
        set_ModalView(!modalView)
    } 

    // it open modal
    async function func_handleOpenModalView(task: TaskType){
        await func_toUpdateModalData(task.id)
        await func_toGetTheOnesNotResponsable(task)
        set_ModalView(!modalView)
    } 
    

    return (
        <>            
            <div>
                <main id={STYLES.container}>

                        <article id={STYLES.taskSection}>
                                <section id={STYLES.tasksStatusSection}>
                                    <button id={totalTasksActive ? STYLES.statusTOTAL: STYLES.statusOFF} onClick={async () => await func_toShowTotalTasks()}>
                                        <p> Tarefas no total: {tasksStatusTrueQuantity + tasksStatusFalseQuantity} </p>
                                    </button>
                                    <button id={trueTasksActive ? STYLES.statusTRUE: STYLES.statusOFF} onClick={async () => await func_handleFilterTasks(true)}>
                                        <p> Tarefas concluídas: {tasksStatusTrueQuantity} </p>
                                    </button>
                                    <button id={falseTasksActive ? STYLES.statusFALSE: STYLES.statusOFF} onClick={async () => await func_handleFilterTasks(false)}>
                                        <p> Tarefas aguardando conclusão: {tasksStatusFalseQuantity} </p>
                                    </button>
                                    <button id={STYLES.refreshButton} onClick={() => func_toUpdateDashboard()}>
                                        <FiRefreshCcw />
                                    </button>
                                </section>

                                {tasksDates.map((date: string) => {
                                    return (
                                        <>
                                            <div className={STYLES.taskContainer}>                  
                                                <div className={STYLES.dateText}>
                                                    <p>
                                                        {date}
                                                    </p>
                                                </div>
                                                
                                                <div className={STYLES.taskInfoContainer}>
                                                    {tasks2.map((task: TaskType, index) => {
                                                        let customer = customers.find(customer => customer.id == task.customer_id)
                                                
                                                        let timeSlamp = new Date(task.created_at)
                                                        let localeDateString = timeSlamp.toLocaleDateString()
                                                        let dateTimeCustomer = localeDateString
                                                
                                                        if(dateTimeCustomer === date){
                                                            return (
                                                                <>
                                                                    <section key={index} className={STYLES.taskList}>
                                                                        <button className={STYLES.taskItem} onClick={() => func_handleOpenModalView(task)} >
                                                                            {task.status ? (
                                                                                <div className={STYLES.activeClass}></div> ): (
                                                                                <div className={STYLES.notActiveClass}></div> 
                                                                            )}
                                                                            <div className={STYLES.taskItemDetails}>
                                                                                <span className={STYLES.customerName}>{customer.name}<p className={STYLES.branch_name}>({categoriesFSSP[Number(task.category_id)-1].name})</p></span>
                                                                                <span className={STYLES.slash}></span>
                                                                                <span className={STYLES.vehicleName}>{task.vehicleName.toUpperCase()}</span>
                                                                            </div>
                                                                        </button>
                                                                    </section>
                                                                </>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )
                                    
                                })}

                        </article>
                </main>

                <div>
                    {modalView && (
                        <ModalComponent
                            user={user}
                            users={users}
                            isOpen={modalView}
                            comments={modalComments}
                            customer={modalCustomer}
                            usersNotResponsable={usersNotResponsable}
                            onRequestClose={func_handleCloseModalView}
                            onRequestAddComent={func_handleAddComment}
                            onRequestUpdateTask={func_toUpdateModalTask}
                            onRequestFinishUnfinish={func_handleFinishUnfinishTask}
                            onRequestDeleteComment={func_handleDeleteComment}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
