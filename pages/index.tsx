import Head from 'next/head'
import MarkdownPreview from '../components/Editor/MarkdownPreview'

export const Home = (): JSX.Element => (
  <div className="container">
    <Head>
      <title>Note</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <div className="w-14 fixed top-0 z-40 h-screen bg-gray-700"></div>
      <div className="w-screen pl-14 fixed top-0 z-10 h-screen bg-green-100">
        <div className="relative h-full">
          <div className="w-80 h-full absolute top-0">
            <div className="h-full bg-gray-50 border-r border-gray-200"></div>
          </div>
          <div className="w-full h-full pl-80">
            <div className="h-full">
              <div className="h-full bg-gray-50">
                <div className="pt-6 h-full overflow-auto">
                  <div className="h-full px-12 markdown">
                    <MarkdownPreview />
                    <div className="h-8"></div>
                  </div>
                </div>
              </div>
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
