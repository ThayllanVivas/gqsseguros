// -- IMPORTs AREA -- //
import Styles from './dashboard.module.scss'
import DashboardTaskBody from './dashboardTaskBody'

import { toast } from 'react-toastify'
import { FiRefreshCcw } from "react-icons/fi"
import { setupAPIClient } from '../../services/api'
import { ModalComponent } from '../../components/modal'
import { useEffect, useState } from 'react'
import { CommentTaskType, TaskType } from '../../contexts/AuthContext'
import { CustomerTypes, CategoryTypes, TaskDateType } from './index'

// -- INTERFACE and TYPEs AREA -- //
interface DASHBOARDPROPS {
    taskList: TaskType[],
    customerList: CustomerTypes[],
    categoryList: CategoryTypes[],
    taskDates: TaskDateType[]
}

// -- COMPONENT AREA -- //
export function Body({taskList, customerList, categoryList, taskDates}: DASHBOARDPROPS){
    // -- USESTATE AREA -- //
    const [tasks, set_tasks] = useState(taskList) //KEEP IT ON THIS COMPONENT
    const [tasksStatusTrueQuantity, set_tasksStatusTrueQuantity] = useState<number>() //KEEP IT ON THIS COMPONENT
    const [tasksStatusFalseQuantity, set_tasksStatusFalseQuantity] = useState<number>() //KEEP IT ON THIS COMPONENT
    const [customers, set_customers] = useState(customerList) //KEEP IT ON THIS COMPONENT

    const [modalTask, setModalTask] = useState<TaskType>()
    const [modalTaskID, setModalTaskID] = useState('')
    const [modalComments, setModalComments] = useState([])
    const [modalViewStatus, setModalViewStatus] = useState<boolean>(false)

    const api = setupAPIClient()

    // effect to change status of the tasks
    useEffect(() => {
        async function toUpdateTasksStatus(){
            const response  = await api.get("/task")

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
            
            set_tasksStatusTrueQuantity(statusTRUE)
            set_tasksStatusFalseQuantity(statusFALSE)
        }

        toUpdateTasksStatus()
    }, [tasks])


    // -> function to INSERT data inside of the modal variable
    async function func_toUpdateTasks(){
        const response  = await api.get("/task")
        set_tasks(response.data)
    }

    // -> function to INSERT data inside of the customer variable
    async function func_toUpdateCustomers(){
        const response = await api.get("/customer")
        set_customers(response.data)
    }

    // -> function to INSERT data inside of the modal variable
    async function func_toUpdateCommments(){
        const response = await api.get("/comment")
        return response.data
    }

    // -> function to GET all data updated 
    async function func_updateButton(){
        toast.success('Dashboard atualizado')
        await func_toUpdateTasks()
        await func_toUpdateCustomers()
        await func_toUpdateCommments()
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

    // -> function to UPDATE data for modal
    async function func_updateModalData(TASK_ID: string){

        const commentsUpdatedResponse: CommentTaskType[] = await func_toUpdateCommments() // to update the user comments
        const taskFilteredForModal = tasks.find((task: any) => task.id === TASK_ID)
        let commentsFilteredForModal = [] //to aux

        // commentsUpdatedResponse.map((comment: CommentTaskType) => {
        //     if(comment.task_id === TASK_ID) {
        //         commentsFilteredForModal.push(comment)
        //     }
        // })
        commentsUpdatedResponse.find((comment: CommentTaskType) => {
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
        <>            
            <div>
                <main id={Styles.container}>

                        <article id={Styles.taskSection}>
                                <section id={Styles.tasksStatusSection}>
                                    <div id={Styles.statusTOTAL}>
                                        <p> Tarefas no total: {tasksStatusTrueQuantity + tasksStatusFalseQuantity} </p>
                                    </div>
                                    <div id={Styles.statusTRUE}>
                                        <p> Tarefas concluídas: {tasksStatusTrueQuantity} </p>
                                    </div>
                                    <div id={Styles.statusFALSE}>
                                        <p> Tarefas aguardando conclusão: {tasksStatusFalseQuantity} </p>
                                    </div>
                                    <div id={Styles.refreshButton}>
                                        <button onClick={() => func_updateButton()}>
                                            <FiRefreshCcw />
                                        </button>
                                    </div>
                                </section>

                                {taskDates.map((date: any, index) => {
                                    return (
                                        <>
                                            <div className={Styles.taskContainer}>                  
                                                <div className={Styles.dateText}>
                                                    <p>
                                                        {date}
                                                    </p>
                                                </div>
                                                <div className={Styles.taskInfoContainer}>
                                                    <DashboardTaskBody  
                                                        key={index}
                                                        date={date} 
                                                        tasks={tasks} 
                                                        customers={customers} 
                                                        handleOpenModalView={func_toogleOpenCloseModalView} 
                                                        categoryList={categoryList}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )
                                    
                                })}

                        </article>
                </main>

                <div>
                    {modalViewStatus && (
                        <ModalComponent 
                            isOpen={modalViewStatus}
                            task={modalTask}
                            comments={modalComments}
                            customersList={customers}
                            onRequestClose={func_toogleOpenCloseModalView}
                            onRequestFinishUnfinish={func_toogleFinishUnfinishTask}
                            onRequestAddComent={func_handleAddComment}
                            onRequestDeleteComment={func_handleDeleteComment}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
