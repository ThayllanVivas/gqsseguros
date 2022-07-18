// -- IMPORTs AREA -- //
import Styles from './dashboard.module.scss'
import DashboardTaskBody from './dashboardTaskBody'
import { toast } from 'react-toastify'
import { FiRefreshCcw } from "react-icons/fi"
import { setupAPIClient } from '../../services/api'
import { ModalComponent } from '../../components/modal'
import { useEffect, useState } from 'react'
import { DashboardBodyProps, TaskTypes } from '../../contexts/TypesAndInterfaces'

// -- COMPONENT AREA -- //
export function Body({taskList, customerList, categoryList, tasksDates}: DashboardBodyProps){
    // -- USESTATE AREA -- //
    const [tasks, set_tasks] = useState<TaskTypes[]>(taskList) //KEEP IT ON THIS COMPONENT
    const [tasksStatusTrueQuantity, setTasksStatusTrueQuantity] = useState<number>() //KEEP IT ON THIS COMPONENT
    const [tasksStatusFalseQuantity, setTasksStatusFalseQuantity] = useState<number>() //KEEP IT ON THIS COMPONENT
    const [customers, setCustomers] = useState(customerList) //KEEP IT ON THIS COMPONENT

    const [modalView, setModalView] = useState(false) //KEEP IT ON THIS COMPONENT
    const [modalTask, setModalTask] = useState<TaskTypes>() //KEEP IT ON THIS COMPONENT
    const [modalTaskID, setModalTaskID] = useState<string>('') // KEEP IT ON THIS COMPONENT
    const [modalComments, setModalComments] = useState([]) //KEEP IT ON THIS COMPONENT

    const [tasksTOTAL, setTasksTOTAL] = useState<boolean>(false)

    const api = setupAPIClient()

    // effect to change status of the tasks
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
            
            setTasksStatusTrueQuantity(statusTRUE)
            setTasksStatusFalseQuantity(statusFALSE)
        }

        toUpdateTasksStatus()
    }, [tasks])
    // -> function to INSERT data inside of the modal variable
    async function func_updateTask(){
        const response  = await api.get("/tasks")
        set_tasks(response.data)
    }
    // -> function to INSERT data inside of the customer variable
    async function func_updateCustomer(){
        const response = await api.get("/customers")
        setCustomers(response.data)
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
            setModalView(false)
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

        setModalTask(taskFilteredForModal) //set modal task
        setModalTaskID(TASK_ID) //set ID of modal task
        setModalComments(commentsFilteredForModal) //set modal comments
    }
    // -> function to OPEN / CLOSE modal
    async function func_toogleOpenCloseModalView(TASK_ID?: string){
        // await func_updateButton()
        await func_updateModalData(TASK_ID)
        setModalView(!modalView)
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

    return (
        <>            
            <div>
                <main id={Styles.container}>

                        <article id={Styles.taskSection}>
                                <section id={Styles.tasksStatusSection}>
                                    <button id={Styles.statusTOTAL}>
                                        <p> Tarefas no total: {tasksStatusTrueQuantity + tasksStatusFalseQuantity} </p>
                                    </button>
                                    <button id={Styles.statusTRUE}>
                                        <p> Tarefas concluídas: {tasksStatusTrueQuantity} </p>
                                    </button>
                                    <button id={Styles.statusFALSE}>
                                        <p> Tarefas aguardando conclusão: {tasksStatusFalseQuantity} </p>
                                    </button>
                                    <button id={Styles.refreshButton} onClick={() => func_updateButton()}>
                                        <FiRefreshCcw />
                                    </button>
                                </section>

                                {tasksDates.map((date: any, index) => {
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
