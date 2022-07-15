// -- IMPORTs AREA -- //
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { ModalTask } from '../../components/modalTask'
import { FiRefreshCcw } from "react-icons/fi"
import { setupAPIClient } from '../../services/api'
import { CustomerTypes, TaskTypes, CategoryTypes, TaskDateType } from './index'
import Styles from './dashboard.module.scss'
import DashboardTaskBody from './dashboardTaskBody'

// -- INTERFACE and TYPEs AREA -- //
interface DASHBOARDPROPS {
    taskList: TaskTypes[],
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

    const [modal_view, set_moda_view] = useState(false) //KEEP IT ON THIS COMPONENT
    const [modal_task, set_modal_task] = useState<any>() //KEEP IT ON THIS COMPONENT
    const [modal_task_ID, set_modal_task_ID] = useState<string>('') // KEEP IT ON THIS COMPONENT
    const [modal_comments, set_modal_comments] = useState([]) //KEEP IT ON THIS COMPONENT

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
    async function func_toUpdateUserCommments(){
        const response = await api.get("/comment")
        return response.data
    }

    // -> function to GET all data updated 
    async function func_updateButton(){
        toast.success('Dashboard atualizado')
        await func_toUpdateTasks()
        await func_toUpdateCustomers()
        await func_toUpdateUserCommments()
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

    // -> function to UPDATE data for modal
    async function func_updateModalData(TASK_ID: string){
        const response = await func_toUpdateUserCommments() // to update the user comments
    
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
    async function func_toogleOpenCloseModalView(TASK_ID?: string){
        // await func_updateButton()
        await func_updateModalData(TASK_ID)
        set_moda_view(!modal_view)
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
          task_id: modal_task_ID
        })
    
        toast.success("Comentário adicionado com sucesso") //show a sucess message to user

        await func_updateModalData(modal_task_ID) //call function to update modal data
        
    }

    // -> function to DELETE a coment on database
    async function func_handleDeleteComment(comment_id: string){    
        await api.delete("/comment", {
            data: {
                id: comment_id
            }
        })

        toast.success("Comentário removido com sucesso")

        await func_updateModalData(modal_task_ID) //call function to update modal data
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
                    {modal_view && (
                        <ModalTask 
                            isOpen={modal_view}
                            task={modal_task}
                            comments={modal_comments}
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
