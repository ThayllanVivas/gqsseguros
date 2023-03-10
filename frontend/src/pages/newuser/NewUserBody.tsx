import STYLES from "./NewUser.module.scss";
import { api } from "../../services/api"
import { Input } from "../../components/ui/input/index";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import { FormEvent, useState } from "react";
import { FiEdit, FiRefreshCcw } from "react-icons/fi";
import { SignUpProps, UserType } from "../../contexts/TypesAndInterfaces";

export function Body({notAdminUsersFSSP, adminUsersFSSP}: SignUpProps) {

  const [adminUsers, set_AdminUsers] = useState<UserType[]>(adminUsersFSSP)
  const [notAdminUsers, set_notAdminUsers] = useState<UserType[]>(notAdminUsersFSSP)
  const [loading, setLoading] = useState<boolean>(false)

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [typeUser, setTypeUser] = useState<string>('false')

  const [userToEditStatus, setUserToEditStatus] = useState<boolean>(false)
  const [newName, setNewName] = useState<string>("")
  const [newEmail, setNewEmail] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [newTypeUser, setNewTypeUser] = useState<string>('false')

  const [userEditInfo, setUserEditInfo] = useState<UserType>()
  const [userEditInfoID, setUserEditInfoID] = useState<string>(userEditInfo?.id)

  // to update users account section
  async function func_updateButton(): Promise<void>{
    await func_toGetUsersUpdated()
      toast.success("Usuários atualizados")
  }
  
  async function func_toGetUsersUpdated(){
      const response = await api.get("/users")
      const usersFiltered = response.data.filter((user: UserType) => user.admin_mode === false)
      const adminsFiltered = response.data.filter((user: UserType) => user.admin_mode === true)
      set_notAdminUsers(usersFiltered)
      set_AdminUsers(adminsFiltered)
  }

  // to CREATE a new user
  async function handleSignUp(e: FormEvent){  
      e.preventDefault();
      
      setLoading(true)

      if(name === "" || email === "" || password === "") {
        toast.warning("Preencha os campos")
        setLoading(false)
        return;
      }

      try {
          await api.post("/signup", {
              name, email, password, typeUser
          })

          setName("")
          setEmail("")
          setPassword("")
          setTypeUser("false")

          // Exibir mensagem de sucesso
          toast.success("Usuário cadastrado")

      } catch (err) {
          toast.error(err.response.data)
          console.log(err.response.data)
      }  

      setLoading(false)

      func_toGetUsersUpdated() // to upate users variable
  }

  // to ALTER a user info
  async function handleEditUp(e: FormEvent){
    e.preventDefault();
      
    setLoading(true)

    if(newName === "" || newEmail === "" || newPassword === "") {
      toast.warning("Preencha os campos")
      setLoading(false)
      return;
    }

    try {
        await api.put("/editup", {
          userEditInfoID: userEditInfoID, 
          name: newName, 
          email: newEmail, 
          password: newPassword, 
          admin_mode: newTypeUser
        })

        setNewName("")
        setNewEmail("")
        setNewPassword("")
        setNewTypeUser("false")

        // Exibir mensagem de sucesso
        toast.success("Conta alterada")

    } catch (err) {
        toast.error(err.response.data)
        console.log(err.response.data)
    }  

    setLoading(false)

    func_toGetUsersUpdated() // to upate users variable
  }

  // to CHANGE user status
  async function hanleChangeUserStatus(user: UserType) {
    if(user.email === 'admin@admin.com'){
      toast.error('Não é possível inativar a conta do admin master')
      return;
    }

    await api.put("/user/status", {
    id: user.id,
    status: user.status
    })

    await func_toGetUsersUpdated() //to update USERS
  }

  // to CLEAN form camps
  function handleCleanForm(e: FormEvent){
          e.preventDefault()

          setName("")
          setEmail("")
          setPassword("")
          setNewName("")
          setNewEmail("")
          setNewPassword("")


          toast.success("Campos foram limpos")
  }

  async function handleEditUser(user: UserType){
    const response = await api.get('/user', {
      params: {
        email: user.email
      }
    })
    setUserEditInfo(response.data)
    setUserEditInfoID(response.data.id)
    setUserToEditStatus(true)
    console.log('userEditInfo: ', userEditInfoID)
  }

  return (
    <>
      <div id={STYLES.newUserContainer}>

        {userToEditStatus ? (
          <div id={STYLES.signUpContainer}>
            <h1>EDITANDO CONTA</h1>

            <form onSubmit={handleEditUp}>
              <input 
                className={STYLES.input}
                placeholder={'ANTES: ' + userEditInfo?.name}
                type="text"
                value={newName}
                onChange={ (e) => setNewName(e.target.value) }
              />

              <input 
                className={STYLES.input}
                placeholder={'ANTES: ' + userEditInfo?.email}
                type="text"
                value={newEmail}
                onChange={ (e) => setNewEmail(e.target.value.toLowerCase()) }
              />
              <div>
                <input 
                 className={STYLES.input}
                  placeholder="*********"
                  type="password"
                  id={STYLES.passwordInput}
                  value={newPassword}
                  onChange={ (e) => setNewPassword(e.target.value) }
                />
                <select id={newTypeUser == 'false' ? STYLES.choosedUser : STYLES.choosedAdmin} onChange={(e) => setNewTypeUser(e.target.value)}>
                  <option value="false">USUÁRIO</option>
                  <option value="true">ADMIN</option>
                </select>
              </div>

              <div>
                <Button
                    id={newName.length > 0 && newEmail.length > 0 && newPassword.length > 0 ? STYLES.buttonAdd : STYLES.buttonAddDISABLED} 
                    type="submit"
                    loading={loading}
                >
                  ALTERAR
                </Button>
                <Button id={newName.length > 0 || newEmail.length > 0 || newPassword.length > 0 ? STYLES.buttonClean : STYLES.buttonCleanDISABLED} type="submit" onClick={ (e) => handleCleanForm(e)}>
                    Limpar campos
                </Button>
              </div>

            </form>
          </div>
          ) : (
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
                <div>
                  <Input 
                      placeholder="*********"
                      type="password"
                      id={STYLES.passwordInput}
                      value={password}
                      onChange={ (e) => setPassword(e.target.value) }
                  />
                  <select id={typeUser == 'false' ? STYLES.choosedUser : STYLES.choosedAdmin} onChange={(e) => setTypeUser(e.target.value)}>
                    <option value="false">USUÁRIO</option>
                    <option value="true">ADMIN</option>
                  </select>
                </div>

                <div>
                    <Button
                        id={name.length > 0 && email.length > 0 && password.length > 0 ? STYLES.buttonAdd : STYLES.buttonAddDISABLED} 
                        type="submit"
                        loading={loading}
                    >
                        CADASTRAR
                    </Button>
                    <Button id={name.length > 0 || email.length > 0 || password.length > 0? STYLES.buttonClean : STYLES.buttonCleanDISABLED} type="submit" onClick={ (e) => handleCleanForm(e)}>
                        Limpar campos
                    </Button>
                </div>

              </form>
          </div>
        )}

        <span id={STYLES.divisory}></span>

        <div id={STYLES.registerContainer}>
          {/* USUARIO CADASTRADO list*/}
          <div id={STYLES.userContainer}>
            {/* USUARIO CADASTRADO list*/}
            <div id={STYLES.userContainerHeader}>
              <h1>USUÁRIOS CADASTRADOS</h1>

              <button id={STYLES.refreshButton} onClick={() => func_updateButton()}>
                  <FiRefreshCcw />
              </button>
            </div>


            <ul id={STYLES.userList}>
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
                        {user.status ? "ATIVO" : "INATIVO"}
                      </button>
                      <span className={STYLES.editUserButton} onClick={() => handleEditUser(user)}>
                        <FiEdit />
                      </span>
                    </li>
                  </>
                )
              })}
            </ul>

          </div>

          {/* ADMIN CADASTRADO list*/}
          <div id={STYLES.adminContainer}>

            <div id={STYLES.adminContainerHeader}>
              <h1>ADMIN CADASTRADOS</h1>

              <button id={STYLES.refreshButton} onClick={() => func_updateButton()}>
                  <FiRefreshCcw />
              </button>
            </div>


            <ul id={STYLES.adminList}>
              {adminUsers.map((admin, index) => {
                return(
                  <>
                    <li key={admin.id}> 
                      <span className={STYLES.name}>
                        {admin.name.toUpperCase()}
                      </span> 
                      | 
                      <span className={STYLES.email}>
                        {admin.email.toLowerCase()}
                      </span>
                      |
                      <button className={admin.status ? STYLES.adminStatusOn : STYLES.adminStatusOff} onClick={(e) => hanleChangeUserStatus(admin)}>
                        {admin.status ? "ATIVO" : "INATIVO"}
                      </button>
                      <span className={STYLES.editAdminButton} onClick={() => handleEditUser(admin)}>
                        <FiEdit />
                      </span>
                    </li>
                  </>
                )
              })}
            </ul>

          </div>
        </div>

      </div>
    </>
  )
}