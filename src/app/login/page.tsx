import  LoginForm  from "./login-form"
import { authOptions } from '../../lib/authOptions';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth'

 export default async function page() {
    const session = await getServerSession(authOptions);
    console.log("Session", session)
  if(session){
      redirect("/")
  }
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  )
}
