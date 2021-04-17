import Head from 'next/head'
import MarkdownPreview from '../components/Editor/MarkdownPreview'

export const Home = (): JSX.Element => (
  <div className="container">
    <Head>
      <title>Note</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main spellCheck={false}>
      <div className="layout h-screen w-screen bg-gray-50">
        <div className="bg-gray-700 h-screen w-14"></div>
        <div className="border-r border-gray-200 h-screen w-80"></div>
        <div className="h-screen">
          <div className="pt-6 h-full overflow-auto">
            <div className="h-full px-16 markdown">
              <MarkdownPreview />
              <div className="h-32"></div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <style jsx>{`
      .note-content {
        color: rgba(1, 1, 1, 0.85);
      }
    `}</style>

    <style jsx global>{`
      html,
      body {
        padding: 0;
        margin: 0;
        color: rgba(1, 1, 1, 0.85);
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }

      * {
        box-sizing: border-box;
      }
    `}</style>
  </div>
)

export default Home
