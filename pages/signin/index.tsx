import { FC } from 'react'
import Link from 'next/link'
import { FingerPrintOutline, PersonOutline } from 'react-ionicons'
import Head from 'next/head'
import { useRouter } from 'next/dist/client/router'

const SignIn: FC = () => {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/')
  }

  return (
    <div className="grid place-items-center w-screen h-screen bg-gray-50">
      <Head>
        <title>Sign in</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="w-96 rounded-md border border-gray-200 bg-white pb-12 pt-8 px-12 -translate-y-1/4 transform">
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
          <div className="flex items-center justify-between text-sm">
            <Link href="/signup">Create account</Link>
            <button
              className="btn-base w-32 bg-blue-500 text-white rounded py-2"
              onClick={handleLogin}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
