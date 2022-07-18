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