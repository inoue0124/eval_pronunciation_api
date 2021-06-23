import Link from 'next/link'

// post：getStaticPropsから取得したデータ
export default ({ post }: any) => {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <Link href="/">
        <a>Back</a>
      </Link>
    </div>
  )
}

export const getStaticPaths = async () => {
  // 外部APIエンドポイントを呼び出しデータ取得
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const posts = await res.json()

  // 事前ビルドしたいパスを指定
  const paths = posts.map((post: any) => ({
    params: {
      // ファイル名と合わせる ※文字列指定
      id: post.id.toString(),
    },
  }))
  // paths：事前ビルドするパス対象を指定するパラメータ
  // fallback：事前ビルドしたパス以外にアクセスしたときのパラメータ true:カスタム404Pageを表示 false:404pageを表示
  return { paths, fallback: false }
}

// paramsには上記pathsで指定した値が入る（1postずつ）
export const getStaticProps = async ({ params }: any) => {
  // 外部APIエンドポイントを呼び出しデータ取得
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`)
  const post = await res.json()

  // ページコンポーネントにpropsとしてに渡す
  return {
    props: {
      post
    },
  }
}