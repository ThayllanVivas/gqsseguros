import Head from 'next/head';
import Image from 'next/image';
import STYLES from './signup.module.scss';
import logoImg from '../../../public/logo.png';
import { api } from '../../services/apiClient';
import { Input } from '../../components/ui/input/index';
import { toast } from 'react-toastify';
import { Button } from '../../components/ui/button';
import { Header } from '../../components/header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { AuthContext } from '../../contexts/AuthContext';
import { FiRefreshCcw } from 'react-icons/fi';
import { setupAPIClient } from '../../services/api';
import { FormEvent, useContext, useState } from 'react';
import { ChangeUserStatusType, SignUpProps } from '../../contexts/TypesAndInterfaces';

export default function SignUp({usersList}: SignUpProps) {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState(usersList)
  const {signUp} = useContext(AuthContext)

  // to update users
  async function func_updateButton(){
    await toGetUsers()
    toast.success('Usuários atualizados')
  }

  // to get users updated (only NO admins are insert inside the state)
  async function toGetUsers(){
    const response = await api.get('/users')

    setUsers(response.data)
  }

  // to create a new user
  async function handleSignUp(event: FormEvent){  
    event.preventDefault();

    if(name === '' || email === '' || password === '') {
      toast.warning("Preencha os campos")
      return;
    }

    setLoading(true)

    let data = {
      name, email, password
    }

    await signUp(data) //to insert new user inside database

    setName('')
    setEmail('')
    setLoading(false)
    setPassword('')

    toGetUsers() // to upate users variable
  }

  //to change the user status
  async function hanleChangeUserStatus(user: ChangeUserStatusType) {
    await api.put('/user/status', {
      id: user.id,
      status: user.status
    })

    await toGetUsers() //to update USERS
  }

  return (
    <>
      <Head>
        <title>GQS Seguros - Novo Usuário</title>
      </Head>

      <Header activePage='signUpPage'/>

      <div id={STYLES.newUserContainer}>

        <div id={STYLES.userContainer}>

          <div id={STYLES.userContainerHeader}>
            <h1>Lista de usuários</h1>

            <button id={STYLES.refreshButton} onClick={() => func_updateButton()}>
                <FiRefreshCcw />
            </button>
          </div>

          
          <ul className={STYLES.usersList}>

            {users.map((user, index) => {
              return(
                <>
                  <li key={user.id}> 
                    <span className={STYLES.name}>
                      {user.name.toUpperCase()}
                    </span> 
                    | 
                    <span className={STYLES.email}>
                      {user.email.toLowerCase()}
                    </span>
                    |
                    <button className={user.status ? STYLES.userStatusOn : STYLES.userStatusOff} onClick={(e) => hanleChangeUserStatus(user)}>
                      {user.status ? 'ATIVO' : 'INATIVO'}
                    </button>
                  </li>
                </>
              )
            })}

          </ul>

        </div>

        <span id={STYLES.divisory}></span>

        <div id={STYLES.signUpContainer}>
            <Image src={logoImg} alt="Logo Sujeito Pizzaria" />

            <h1>Criando nova conta</h1>

            <form onSubmit={handleSignUp}>
              <Input 
                  placeholder="Ex: João Alves"
                  type="text"
                  value={name}
                  onChange={ (e) => setName(e.target.value) }
              />

              <Input 
                  placeholder="Ex: joaoalves@example.com"
                  type="text"
                  value={email}
                  onChange={ (e) => setEmail(e.target.value) }
              />
              <Input 
                  placeholder="*********"
                  type="password"
                  value={password}
                  onChange={ (e) => setPassword(e.target.value) }
              />

              <Button
                  type="submit"
                  loading={loading}
                  >
                  Cadastrar
              </Button>
            </form>
        </div>

      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  const api = setupAPIClient(ctx)
  const usersList = await api.get("/users")

  return {
    props: {
      usersList: usersList.data,
    }
  }
})