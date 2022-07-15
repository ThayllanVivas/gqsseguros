// -- START OF IMPORTS -- //
import Head from "next/head";
import Styles from './customer.module.scss'

import { toast } from "react-toastify";
import { Header } from "../../components/header";
import { useState } from 'react'
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { Footer } from "../../components/footer";

// -- START OF THE COMPONENT -- //
export default function customer() {
    const [customerCPF, setCustomerCPF] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState('')

    function handleCleanForm(event){
        event.preventDefault()

        setCustomerCPF('')
        setCustomerName('')
        setCustomerPhoneNumber('')
    }

    // function to CREATE the user and INSERT on database
    async function handleCreateCustomer(event){
        event.preventDefault()

        // verify if the inputs are all fulfilled
        if(customerName == '' || customerPhoneNumber ==  '' || customerCPF == ''){
            toast.error("Preencha todos os campos")
            return;
        }

        const api = setupAPIClient()

        const response = await api.post("/customer", {
            cpf: customerCPF,
            name: customerName,
            phoneNumber: customerPhoneNumber
        }).then(resp => resp.data).catch(err => {
            return `${err.response.data.error}`
        })

        if(response == "Cliente já existente no banco de dados"){
            toast.error(response)
            return;
        }

        toast.success("Usuário criado com sucesso")

        setCustomerCPF('')
        setCustomerName('')
        setCustomerPhoneNumber('')
    }

    // --- RETURN --- //
    return (
        <>
            <Head>
                <title>Nova categoria - Sujeito Pizza</title>
            </Head>
            <Header activePage='customerPage'/>

            <main className={Styles.container}>
                <h1>Novo cliente</h1>

                <form className={Styles.form}>

                    <input 
                        type="text"
                        placeholder="Digite o nome do cliente"
                        className={Styles.input}
                        value={customerName}
                        onChange={(e) => {
                            setCustomerName(e.target.value) 
                        }}
                    />

                    <input 
                        type="text"
                        placeholder="Digite o CPF do cliente"
                        className={Styles.input}
                        value={customerCPF}
                        onChange={(e) => {
                            setCustomerCPF(e.target.value) 
                        }}
                    />

                    <input 
                        type="text"
                        placeholder="Digite o número do telefone do cliente"
                        className={Styles.input}
                        value={customerPhoneNumber}
                        onChange={(e) => {
                            setCustomerPhoneNumber(e.target.value) 
                        }}
                    />

                    <div id={Styles.buttonContainer}>
                        <button className={Styles.buttonAdd} type="submit" onClick={ () => handleCreateCustomer(event) }>
                            Cadastrar novo cliente
                        </button>
                        <button className={Styles.buttonClean} type="submit" onClick={ () => handleCleanForm(event)}>
                            Limpar campos
                        </button>
                    </div>

                </form>
            </main>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async(ctx) => {
    return {
        props: {}
    }
})