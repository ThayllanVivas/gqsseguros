import STYLES from './signup.module.scss';
import { api } from '../../services/api'
import { Input } from '../../components/ui/input/index';
import { toast } from 'react-toastify';
import { Button } from '../../components/ui/button';
import { FiRefreshCcw } from 'react-icons/fi';
import { FormEvent, useState } from 'react';
import { ChangeUserStatusType, SignUpProps } from '../../contexts/TypesAndInterfaces';

export function Body({notAdminUsersFSSP}: SignUpProps) {

    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [notAdminUsers, set_notAdminUsers] = useState(notAdminUsersFSSP)
    const [loading, setLoading] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')

    // to update users
    async function func_updateButton(): Promise<void>{
      await func_toGetUsersUpdated()
        toast.success('Usuários atualizados')
    }

    async function func_toGetUsersUpdated(){
        const response = await api.get('/users')
        const usersFiltered = response.data.filter((user) => user.admin_mode !== true)
        set_notAdminUsers(usersFiltered)
    }

    // to create a new user
    async function handleSignUp(event: FormEvent){  
        event.preventDefault();

        if(name === '' || email === '' || password === '') {
            toast.warning("Preencha os campos")
            return;
        }

        setLoading(true)

        try {
            await api.post('/signup', {
                name, email, password
            })

            setName('')
            setEmail('')
            setLoading(false)
            setPassword('')

            // Exibir mensagem de sucesso
            toast.success("Conta criada com sucesso")

        } catch (err) {
            toast.error(err.response.data)
            console.log(err.response.data)
        }  

        setLoading(false)

        func_toGetUsersUpdated() // to upate users variable
    }

    async function hanleChangeUserStatus(user: ChangeUserStatusType) {
        await api.put('/user/status', {
        id: user.id,
        status: user.status
        })

        await func_toGetUsersUpdated() //to update USERS
    }
  
    function handleCleanForm(event){
            event.preventDefault()

            setName('')
            setEmail('')
            setPassword('')

            toast.success('Campos foram limpos')
        }

  return (
    <>
      <div id={STYLES.newUserContainer}>

        <div id={STYLES.signUpContainer}>
            {/* <Image src={logoImg} alt="Logo Sujeito Pizzaria" /> */}

            <h1>CRIANDO NOVA CONTA</h1>

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
                  onChange={ (e) => setEmail(e.target.value.toLowerCase()) }
              />
              <Input 
                  placeholder="*********"
                  type="password"
                  value={password}
                  onChange={ (e) => setPassword(e.target.value) }
              />

             <div>
                <Button
                    id={name.length > 0 && email.length > 0 || password.length > 0 ? STYLES.buttonAdd : STYLES.buttonAddDISABLED} 
                    type="submit"
                    loading={loading}
                >
                    Cadastrar
                </Button>
                <Button id={name.length > 0 || email.length > 0 || password.length > 0 ? STYLES.buttonClean : STYLES.buttonCleanDISABLED} type="submit" onClick={ () => handleCleanForm(event)}>
                    Limpar campos
                </Button>
             </div>
            </form>
        </div>

        <span id={STYLES.divisory}></span>

        <div id={STYLES.userContainer}>

          <div id={STYLES.userContainerHeader}>
            <h1>USUÁRIOS CADASTRADOS</h1>

            <button id={STYLES.refreshButton} onClick={() => func_updateButton()}>
                <FiRefreshCcw />
            </button>
          </div>

          
          <ul className={STYLES.userList}>

            {notAdminUsers.map((user, index) => {
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

      </div>
    </>
  )
}