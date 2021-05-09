import { Note } from '@prisma/client'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import prisma from '../lib/prisma'
import { FC } from 'react'
import SideBar from '../components/SideBar/SideBar'
import EditorContainer from '../components/Editor/EditorContainer'
import Menu from '../components/SideBar/Menu'
import Resizeable from '../components/SideBar/Resizeable'

export interface Props {
  notes: Note[]
}

export const Home: FC<Props> = ({ notes }) => (
  <div className="container">
    <Head>
      <title>Isling: Markdown Notebook</title>
      <link rel="icon" href="/favicon.png" />
    </Head>

    <main spellCheck={false}>
      <div className="layout h-screen w-screen overflow-hidden bg-gray-50">
        <div className="bg-gray-700 h-screen">
          <Resizeable defaultWidth={56}>
            <Menu />
          </Resizeable>
        </div>
        <div className="border-r border-gray-200 h-screen">
          <Resizeable defaultWidth={320}>
            <SideBar notes={notes} />
          </Resizeable>
        </div>
        <div className="h-screen">
          <EditorContainer />
        </div>
      </div>
    </main>
  </div>
)

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      content: true,
      title: true,
      id: true,
    },
  })

  return {
    props: {
      notes,
    },
  }
}

export default Home
