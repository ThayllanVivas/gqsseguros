import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/home.module.scss';
import logoImg from '../../public/logo.png';
import { Input } from '../components/ui/input/index';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import { AuthContext } from '../contexts/AuthContext';
import { canSSRGuest } from '../utils/canSSRGuest';
import { useContext, FormEvent, useState } from 'react';


export default function Home() {

  const {signIn} = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [loading, setLoading] = useState(false)

  async function handleSignIn(event: FormEvent){
    event.preventDefault()
    
    if(email === '' || password === ''){
      toast.warning("Preencha os campos")
      return;
    }

    setLoading(true)

    let data = {
      email, password
    }

    await signIn(data)

    setLoading(false)
  }

  return (
    <>
      <Head>
          <title>GQS Seguros - Faça seu login</title>
      </Head>
      
      <div className={styles.TheFather}>
        <div className={styles.containerCenter}>
          <div id={styles.LogoTranstion}></div>
        </div>


        <div className={styles.containerCenter}>
            <Image src={logoImg} alt="Logo GQS Seguros" />

            <div className={styles.login}>
              <form onSubmit={handleSignIn}>
                <Input 
                  placeholder="Digite seu email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                  placeholder="Digite sua senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  type="submit"
                  loading={loading}
                >
                  Acessar
                </Button>
              </form>
              {/* <Link href="/signup">
                <a className={styles.text}>Nao possui uma conta? Cadastre-se</a>
              </Link> */}
            </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})