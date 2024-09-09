import Head from 'next/head'
import { useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import { useRouter } from 'next/router'
import SignInCard from '../components/SignIn/SignInCard'
import { PROCESSING_MSG } from '../utils/constants'

const Signin = () => {

  const { state } = useContext(DataContext)
  const { auth } = state
  const router = useRouter()

  // useEffect(() => {
  //   if (Object.keys(auth).length !== 0) router.push("/")
  // }, [auth])

  return (
    <div className="container-fluid">
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_APP_TITLE} - Sign in`}</title>
      </Head>
      <SignInCard loadingMsg = {PROCESSING_MSG} executeSignInCallback={() =>{router.push('/')}}/>
    </div>
  )
}

export default Signin