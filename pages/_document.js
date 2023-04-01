import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className="bg-gradient-to-r from-pink-300 via-purpe-300 to-indigo-400">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
