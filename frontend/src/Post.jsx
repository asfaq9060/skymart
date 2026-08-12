import { useEffect, useState } from 'react'

const POSTS_API = 'https://jsonplaceholder.typicode.com/posts?_limit=12'

function Post() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function getPosts() {
      try {
        setIsLoading(true)
        setError('')

        const response = await fetch(POSTS_API, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to load posts. Please try again.')
        }

        const data = await response.json()
        setPosts(data)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    getPosts()

    return () => controller.abort()
  }, [])

  if (isLoading) {
    return <p>Loading posts...</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  return (
    <main>
      <h1>Posts</h1>

      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </main>
  )
}

export default Post
