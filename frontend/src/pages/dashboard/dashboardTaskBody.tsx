import { CategoryTypes, CustomerTypes } from "./index"
import Styles from './dashboard.module.scss'
import { ModalTaskType } from "../../contexts/AuthContext"

interface TaskProps {
    date: string,
    tasks: ModalTaskType[],
    customers: CustomerTypes[],
    handleOpenModalView: (task_id: string) => void,
    categoryList: CategoryTypes[]
}

export default function DashboardTaskBody({date, tasks, customers, handleOpenModalView, categoryList}: TaskProps) {
    
    return(
        <>            
            {tasks.map((task: any, index) => {
                let customer = customers.find(customer => customer.id == task.customer_id)
        
                let timeSlamp = new Date(task.created_at)
                let localeDateString = timeSlamp.toLocaleDateString()
                let dateTimeCustomer = localeDateString
        
                if(dateTimeCustomer === date){
                    return (
                        <>
                            <section key={index} className={Styles.taskList}>
                                <button className={Styles.taskItem} onClick={() => handleOpenModalView(task.id)} >
                                    {task.status ? (
                                        <div className={Styles.activeClass}></div> ): (
                                        <div className={Styles.notActiveClass}></div> 
                                    )}
                                    <div className={Styles.taskItemDetails}>
                                        <span className={Styles.customerName}>{customer.name}<p className={Styles.branch_name}>({categoryList[task.category_id-1].name})</p></span>
                                        <span className={Styles.slash}></span>
                                        <span className={Styles.vehicleName}>{task.vehicleName.toUpperCase()}</span>
                                    </div>
                                </button>
                            </section>
                        </>
                    )
                }
            })}
        </>
    )
}