// -- START OF IMPORTS -- //
import Head from 'next/head'
import { Body } from './dashboardBody'
import { Header } from "../../components/header"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { AuthContext } from '../../contexts/AuthContext'
import { setupAPIClient } from "../../services/api"
import { DashboardProps, TaskType } from '../../contexts/TypesAndInterfaces'
import { useContext, useEffect, useState } from 'react'

// -- START OF THE COMPONENT -- //
export default function Dashboard({tasksFSSP, customersFSSP, categoriesFSSP}: DashboardProps){
    const {searchInfo} = useContext(AuthContext)
    const {setTasksFiltered} = useContext(AuthContext)

    useEffect(() => {
        let customerID: string
        customersFSSP.map((customer) => {
            if(customer.name === searchInfo){
                console.log('achou')
                customerID = customer.id
            }
        })
        console.log('customerID', customerID)
        let tasks = new Array
        tasksFSSP.map((task) => {
            if(task.customer_id === customerID){
                tasks.push(task)
            }
        })
        setTasksFiltered(tasks)
        console.log('tasks', tasks[0])
    }, [searchInfo])

    // --- RETURN --- //
    return (
        <>
            <Head>
                <title>GQS Seguros</title>
            </Head>

            <Header activePage='dashboardPage' />
            
            <Body 
                tasksFSSP={tasksFSSP} 
                customersFSSP={customersFSSP}
                categoriesFSSP={categoriesFSSP}
            />
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const api = setupAPIClient(ctx)
    const tasksFSSP = await api.get("/tasks")
    const customersFSSP = await api.get("/customers")
    const categoriesFSSP = await api.get("/categories")

    return {
      props: {
            tasksFSSP: tasksFSSP.data,
            customersFSSP: customersFSSP.data,
            categoriesFSSP: categoriesFSSP.data
      }
    }
})