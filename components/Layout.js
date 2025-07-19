import Head from 'next/head'

export default function Layout({ children, title = 'EchoVault - Your Private AI Memory' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Your private AI-powered memory vault for life's moments, insights, and connections." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="font-inter">
        {children}
      </main>
    </>
  )
}