import styles from './NewsLetter.module.css'
import { useState } from 'react'

function NewsLetter() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setMessage(`Thanks — offers will be sent to ${email}.`)
    setEmail('')
  }

  return (
    <section className={styles.newsletter}>
      <p className={styles.eyebrow}>STAY IN THE LOOP</p>
      <h1>Good things, straight to your inbox.</h1>
      <p>New arrivals, thoughtful edits and a little something extra.</p>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" aria-label="Email address" placeholder='Email address' required />
        <button type="submit">Subscribe</button>
      </form>
      <p className={styles.message} aria-live="polite">{message}</p>
    </section>
  )
}

export default NewsLetter
