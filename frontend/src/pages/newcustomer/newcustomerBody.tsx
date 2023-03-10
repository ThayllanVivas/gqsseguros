// -- START OF IMPORTS -- //
import STYLES from './customer.module.scss'
import { api } from '../../services/api'
import { toast } from "react-toastify";
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useState } from 'react';
import { FiRefreshCcw } from 'react-icons/fi';
import { CustomerType, NewCustomerProps } from '../../contexts/TypesAndInterfaces';

// -- START OF THE COMPONENT -- //
export function Body({customersFSSP}: NewCustomerProps) {
    const [customers, set_Customers] = useState<CustomerType[]>(customersFSSP)
    const [customerCPF, setCustomerCPF] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState('')
    const [loading, setLoading] = useState<boolean>(false)
    
    function handleCleanForm(event){
        event.preventDefault()

        setCustomerCPF('')
        setCustomerName('')
        setCustomerPhoneNumber('')

        toast.success('Campos foram limpos')
    }

    async function func_updateCustomers(){
        const response = await api.get('/customers')
        set_Customers(response.data)
    }

    async function func_updateButton(){
        await func_updateCustomers()
        toast.success('Clientes atualizados')
    }

    async function handleCreateCustomer(event){
        event.preventDefault()
        setLoading(true)

        // verify if the inputs are all fulfilled
        if(customerName == '' || customerPhoneNumber ==  '' || customerCPF == ''){
            toast.error("Preencha todos os campos")
            return;
        }

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
        setLoading(false)

        toast.success("Usuário criado com sucesso")

        setCustomerCPF('')
        setCustomerName('')
        setCustomerPhoneNumber('')
        func_updateButton()
    }

    // --- RETURN --- //
    return (
        <>
            <div id={STYLES.newUserContainer}>
                <div id={STYLES.signUpContainer}>

                    <h1>Criando novo cliente</h1>

                    <form>
                    <Input 
                        placeholder="Insira um nome"
                        type="text"
                        value={customerName}
                        onChange={ (e) => setCustomerName(e.target.value) }
                    />

                    <Input 
                        placeholder="Insira um CPF"
                        type="number"
                        value={customerCPF}
                        onChange={ (e) => setCustomerCPF(e.target.value) }
                    />
                    <Input 
                        placeholder="Insira um número de contato"
                        type="number"
                        value={customerPhoneNumber}
                        onChange={ (e) => setCustomerPhoneNumber(e.target.value) }
                    />

                    <div>
                        <Button
                            id={customerName.length > 0 && customerCPF.length > 0 && customerPhoneNumber.length > 0 ? STYLES.buttonAdd : STYLES.buttonAddDISABLED} 
                            type="submit"
                            loading={loading}
                            onClick={handleCreateCustomer}
                        >
                            Cadastrar
                        </Button>
                        <Button id={customerName.length > 0 || customerCPF.length > 0 || customerPhoneNumber.length > 0 ? STYLES.buttonClean : STYLES.buttonCleanDISABLED} type="submit" onClick={ () => handleCleanForm(event)}>
                            Limpar campos
                        </Button>
                    </div>
                    </form>
                </div>

                <span id={STYLES.divisory}></span>

                <div id={STYLES.userContainer}>

                    <div id={STYLES.userContainerHeader}>
                        <h1>Clientes cadastrados</h1>

                        <button id={STYLES.refreshButton} onClick={() => func_updateButton()}>
                            <FiRefreshCcw />
                        </button>
                    </div>

                
                    <ul className={STYLES.userList}>

                        {customers.map((customer) => {
                        return(
                            <>
                                <li key={customer.id}> 
                                    <span className={STYLES.userInfo}>
                                        {customer.name.toUpperCase()}
                                    </span> 
                                    | 
                                    <span className={STYLES.userInfo}>
                                        +55 {customer.phoneNumber.toLowerCase()}
                                    </span>
                                </li>
                            </>
                        )
                        })}

                    </ul>

                </div>

            </div>
        </>
    )
}