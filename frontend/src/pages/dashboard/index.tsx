// -- START OF IMPORTS -- //
import Head from 'next/head'
import React, { useEffect, useState }  from 'react'
import { Body } from './dashboardBody'
import { Header } from "../../components/header"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { setupAPIClient } from "../../services/api"
import { Footer } from '../../components/footer'

// -- START OF INTERFACES AND TYPES -- //
interface DashboardProps {
    taskList: TaskTypes[],
    customerList: CustomerTypes[],
    categoryList: CategoryTypes[]
}

export type CustomerTypes = {
    id: string,
    cpf: string,
    name: string,
    phoneNumber: string
}

export type CommentTypes = {
    id: string,
    text: string,
    task_id: string,
    created_at: string
}

export type CategoryTypes = {
    id: string,
    name: string
}

export type TaskTypes = {
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

export type TaskDateType = {
    created_at: string
}

// -- START OF THE COMPONENT -- //
export default function Dashboard({taskList, customerList, categoryList}: DashboardProps){

    const [tasksDates, setTaskDates] = useState<TaskDateType[]>([])

    useEffect(() => {
        function toGetDateOfTime(){
            let dates = []

            taskList.map((task: any) => {
                let timeSlamp = new Date(task.created_at) //transformando a data em object
                dates.push(timeSlamp) //inserindo a data-string dentro da variável dates para colocar após dentro da state taskDates
            })

            dates.sort((a,b) => {
                if (a > b) return 1
                if (b > a) return -1
                return 0
            })

            let datesToString = []
            dates.map((date) => {
                datesToString.push(date.toLocaleDateString())
            })

            const filteredArray = datesToString.filter((ele, pos) => {
                return datesToString.indexOf(ele) == pos
            })
            

            setTaskDates(filteredArray)
        }

        toGetDateOfTime()
    }, [taskList])

    // -- RETURN -- //
    return (
        <>
            <Head>
                <title>Projeto Pizza - Dashboard</title>
            </Head>

            <Header activePage='dashboardPage' />
            
            <Body 
                taskList={taskList} 
                customerList={customerList}
                categoryList={categoryList}
                taskDates={tasksDates}
            />

            {/* <Footer /> */}
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const api = setupAPIClient(ctx)
    const taskList = await api.get("/task")
    const customerList = await api.get("/customer")
    const categoryList = await api.get("/category")

    return {
      props: {
            taskList: taskList.data,
            customerList: customerList.data,
            categoryList: categoryList.data
      }
    }
})