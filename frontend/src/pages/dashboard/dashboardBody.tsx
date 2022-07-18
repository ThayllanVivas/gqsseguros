// -- IMPORTs AREA -- //
import Styles from './dashboard.module.scss'
import { toast } from 'react-toastify'
import { FiRefreshCcw } from "react-icons/fi"
import { setupAPIClient } from '../../services/api'
import { ModalComponent } from '../../components/modal'
import { useEffect, useState } from 'react'
import { DashboardBodyProps, TaskTypes } from '../../contexts/TypesAndInterfaces'

// -- COMPONENT AREA -- //
export function Body({taskList, customerList, categoryList}: DashboardBodyProps){
    // -- USESTATE AREA -- //
    var [tasks, set_Tasks] = useState<TaskTypes[]>(taskList) //KEEP IT ON THIS COMPONENT
    var [tasksDates, set_TaskDates] = useState<string[]>([])
    var [tasksStatusTrueQuantity, set_TasksStatusTrueQuantity] = useState<number>() //KEEP IT ON THIS COMPONENT
    var [tasksStatusFalseQuantity, set_TasksStatusFalseQuantity] = useState<number>() //KEEP IT ON THIS COMPONENT

    var [customers, set_Customers] = useState(customerList) //KEEP IT ON THIS COMPONENT

    var [modalView, set_ModalView] = useState(false) //KEEP IT ON THIS COMPONENT
    var [modalTask, set_ModalTask] = useState<TaskTypes>() //KEEP IT ON THIS COMPONENT
    var [modalTaskID, set_ModalTaskID] = useState<string>('') // KEEP IT ON THIS COMPONENT
    var [modalComments, set_ModalComments] = useState([]) //KEEP IT ON THIS COMPONENT

    const api = setupAPIClient()

    // effect to change quantity of tasks's status
    useEffect(() => {
        async function toUpdateTasksStatus(){
            const response  = await api.get("/tasks")

            let statusTRUE = 0
            let statusFALSE = 0

            response.data.map((task, index)=> {
                if(task.status) {
                    statusTRUE += 1
                }
                else {
                    statusFALSE += 1
                }
            })
            
            set_TasksStatusTrueQuantity(statusTRUE)
            set_TasksStatusFalseQuantity(statusFALSE)
        }

        toUpdateTasksStatus()
    }, [tasks])
    // to change tasks date
    useEffect(() => {
        func_toGetDateOfTime()
    }, [tasks])
    // -> function to INSERT data inside of the modal variable
    async function func_updateTask(){
        const response  = await api.get("/tasks")
        set_Tasks(response.data)
    }
    // -> function to INSERT data inside of the customer variable
    async function func_updateCustomer(){
        const response = await api.get("/customers")
        set_Customers(response.data)
    }
    // -> function to INSERT data inside of the modal variable
    async function func_updateComments(){
        const response = await api.get("/comments")
        return response.data
    }
    // -> function to GET all data updated 
    async function func_updateButton(){
        toast.success('Dashboard atualizado')
        await func_updateTask()
        await func_updateCustomer()
        await func_updateComments()
    }
    // -> function to FINISH or UNFINISH a task
    async function func_updateTaskStatus(TASK: TaskTypes){

        const response = await api.put("/task/status", {
            id: TASK.id,
            status: TASK.status
        })

        if(response.data.status){
            toast.success('Tarefa concluída!')
            set_ModalView(false)
        } else {
            toast.warning('Status de conclusão desfeito!')
        }
        
        await func_updateTask()
    }
    // -> function to UPDATE data for modal
    async function func_updateModalData(TASK_ID: string){
        const response = await func_updateComments() // to update the user comments
    
        const taskFilteredForModal = tasks.find((task: any) => task.id === TASK_ID)
        let commentsFilteredForModal = [] //to aux

        response.map((comment: any) => {
            if(comment.task_id === TASK_ID) {
                commentsFilteredForModal.push(comment)
            }
        })

        set_ModalTask(taskFilteredForModal) //set modal task
        set_ModalTaskID(TASK_ID) //set ID of modal task
        set_ModalComments(commentsFilteredForModal) //set modal comments
    }
    // -> function to OPEN / CLOSE modal
    async function func_toogleOpenCloseModalView(TASK_ID?: string){
        // await func_updateButton()
        await func_updateModalData(TASK_ID)
        set_ModalView(!modalView)
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
    async function func_toogleFilterTasks(status: boolean){
        await func_updateTask()
        let data = new Array
        data.push(taskList.filter((task) => task.status === status))

        set_Tasks(data[0])
        await func_toGetDateOfTime()
        // console.log('data:', data)

    }
    // to get dates of tasks updated
    async function func_toGetDateOfTime(){
        let dates = [] //var aux

        //transformando a data em object e inserindo dentro da variavel DATES
        tasks.map((task: any) => {
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
        

        set_TaskDates(filteredArray)
    }


    return (
        <>            
            <div>
                <main id={Styles.container}>

                        <article id={Styles.taskSection}>
                                <section id={Styles.tasksStatusSection}>
                                    <button id={Styles.statusTOTAL} onClick={async () => await func_updateButton()}>
                                        <p> Tarefas no total: {tasksStatusTrueQuantity + tasksStatusFalseQuantity} </p>
                                    </button>
                                    <button id={Styles.statusTRUE} onClick={async () => await func_toogleFilterTasks(true)}>
                                        <p> Tarefas concluídas: {tasksStatusTrueQuantity} </p>
                                    </button>
                                    <button id={Styles.statusFALSE} onClick={async () => await func_toogleFilterTasks(false)}>
                                        <p> Tarefas aguardando conclusão: {tasksStatusFalseQuantity} </p>
                                    </button>
                                    <button id={Styles.refreshButton} onClick={() => func_updateButton()}>
                                        <FiRefreshCcw />
                                    </button>
                                </section>

                                {tasksDates.map((date: string, index) => {
                                    return (
                                        <>
                                            <div className={Styles.taskContainer}>                  
                                                <div className={Styles.dateText}>
                                                    <p>
                                                        {date}
                                                    </p>
                                                </div>
                                                <div className={Styles.taskInfoContainer}>
                                                    {tasks.map((task: TaskTypes, index) => {
                                                        let customer = customers.find(customer => customer.id == task.customer_id)
                                                
                                                        let timeSlamp = new Date(task.created_at)
                                                        let localeDateString = timeSlamp.toLocaleDateString()
                                                        let dateTimeCustomer = localeDateString
                                                
                                                        if(dateTimeCustomer === date){
                                                            return (
                                                                <>
                                                                    <section key={index} className={Styles.taskList}>
                                                                        <button className={Styles.taskItem} onClick={() => func_toogleOpenCloseModalView(task.id)} >
                                                                            {task.status ? (
                                                                                <div className={Styles.activeClass}></div> ): (
                                                                                <div className={Styles.notActiveClass}></div> 
                                                                            )}
                                                                            <div className={Styles.taskItemDetails}>
                                                                                <span className={Styles.customerName}>{customer.name}<p className={Styles.branch_name}>({categoryList[Number(task.category_id)-1].name})</p></span>
                                                                                <span className={Styles.slash}></span>
                                                                                <span className={Styles.vehicleName}>{task.vehicleName.toUpperCase()}</span>
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
                            isOpen={modalView}
                            task={modalTask}
                            comments={modalComments}
                            customersList={customers}
                            onRequestClose={func_toogleOpenCloseModalView}
                            onRequestFinishUnfinish={func_updateTaskStatus}
                            onRequestAddComent={func_handleAddComment}
                            onRequestDeleteComment={func_handleDeleteComment}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
