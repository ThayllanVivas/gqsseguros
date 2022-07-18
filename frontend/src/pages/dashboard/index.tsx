// -- START OF IMPORTS -- //
import Head from 'next/head'
import React, { useEffect, useState }  from 'react'
import { Body } from './dashboardBody'
import { Header } from "../../components/header"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { setupAPIClient } from "../../services/api"
import { DashboardProps } from '../../contexts/TypesAndInterfaces'

// -- START OF THE COMPONENT -- //
export default function Dashboard({taskList, customerList, categoryList}: DashboardProps){

    const [tasksDates, setTaskDates] = useState<string[]>([])

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
                <title>GQS Seguros</title>
            </Head>

            <Header activePage='dashboardPage' />
            
            <Body 
                taskList={taskList} 
                customerList={customerList}
                categoryList={categoryList}
                tasksDates={tasksDates}
            />

            {/* <Footer /> */}
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const api = setupAPIClient(ctx)
    const taskList = await api.get("/tasks")
    const customerList = await api.get("/customers")
    const categoryList = await api.get("/categories")

    return {
      props: {
            taskList: taskList.data,
            customerList: customerList.data,
            categoryList: categoryList.data
      }
    }
})