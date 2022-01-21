import { FC, useState } from 'react'
import Link from 'next/link'
import { FingerPrintOutline, PersonOutline } from 'react-ionicons'
import Head from 'next/head'
import { useRouter } from 'next/dist/client/router'
import Image from 'next/image'

const SignIn: FC = () => {
  // const router = useRouter()

  const handleLogin = () => {
    setNotif('');
  }

  const [notif, setNotif] = useState<string>('hidden');

  return (
    <div className="w-screen h-screen bg-hallowen-qiqi bg-cover bg-right relative">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="w-[400px] rounded-md border border-gray-200 bg-white pb-8 pt-8 px-12 transform -translate-y-1/2 absolute left-32 top-1/2 opacity-90">
        <div className="w-full h-full">
          <h1 className="text-xl text-center">Sign in</h1>
          <div className="mt-12 mb-10">
            <div className="input flex items-center primary w-full relative">
              <PersonOutline
                width="1.15rem"
                cssClasses="left-3 top-1/2 transform -translate-y-1/2 absolute"
              />
              <input
                className="flex-grow h-full outline-none py-3 pr-3 pl-10"
                type="text"
                placeholder="Username"
                autoComplete="username"
              />
            </div>
            <div className="input flex items-center primary w-full relative mt-6">
              <FingerPrintOutline
                width="1.15rem"
                cssClasses="left-3 top-1/2 transform -translate-y-1/2 absolute"
              />
              <input
                className="flex-grow h-full outline-none py-3 pr-3 pl-10"
                type="password"
                placeholder="Password"
                autoComplete="password"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-base">
            <button
                className="btn-base w-32 bg-qiqi-500 text-white rounded py-2"
                onClick={handleLogin}
              >
                OK
            </button>
            <Link href="/reset-password"><span className="text-qiqi-500 cursor-pointer hover:underline">Forgot password?</span></Link>
          </div>
          <div className="flex justify-center mt-10 text-sm">
            New to QiQi?
            <Link href="/register">
              <span className="text-qiqi-500 ml-2 font-sm cursor-pointer hover:underline">
                Register
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className={`fixed bg-green-50 w-80 rounded-[50%] h-40 p-10 left-96 top-20 border border-gray-300 opacity-95 grid grid-cols-3 ${notif}`}>
          <img src='images/qiqi-notif.jpeg' className="w-20" ></img>
          <div className="col-span-2 pt-4 pl-3">
            <p className="text-sm">こわくない</p>
            <p className="text-2xl font-bold">こわくない! ! !</p>
          </div>
          <div className="fixed circle1 right-4 top-32"></div>
          <div className="circle2 right-3 top-40"></div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
