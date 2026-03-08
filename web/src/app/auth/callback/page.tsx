import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const AuthCallbackPage = async (props: Props) => {
  const auth = await onAuthenticateUser()   
  console.log('Auth result:', JSON.stringify(auth))
  if (auth.status === 200 || auth.status  === 201) {
      return redirect(`/dashboard/${auth.user?.workspace[0].id}`)
    }

  if (auth.status === 403 || auth.status === 400 || auth.status === 500) {
    return redirect('/auth/sign-in')
  }
  return (
    <div>Auth Callback</div>
  )
}

export default AuthCallbackPage