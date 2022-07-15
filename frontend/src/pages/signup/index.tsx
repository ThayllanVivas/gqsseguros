import Head from 'next/head';
import Image from 'next/image';
import logoImg from '../../../public/logo.png';
import styles from './signup.module.scss';
import { Input } from '../../components/ui/input/index';
import { Button } from '../../components/ui/button';
import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';

export default function SignUp() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [password, setPassword] = useState('')

  const {signUp} = useContext(AuthContext)

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

    await signUp(data)

    setLoading(false)

  }

  return (
    <>
      <Head>
        <title>GQS Seguros - Novo Usuário</title>
      </Head>

      <Header activePage='signUpPage'/>

      <div className={styles.TheFather}>
        <div className={styles.containerCenter}>
          <Image src={logoImg} alt="Logo Sujeito Pizzaria" />

          <div className={styles.signin}>
              <h1>Criando nova conta</h1>

              <form onSubmit={handleSignUp}>
                <Input 
                    placeholder="Digite seu nome"
                    type="text"
                    value={name}
                    onChange={ (e) => setName(e.target.value) }
                />

                <Input 
                    placeholder="Digite seu email"
                    type="text"
                    value={email}
                    onChange={ (e) => setEmail(e.target.value) }
                />
                <Input 
                    placeholder="Digite sua senha"
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
      </div>
    </>
  )
}
