export default function({ setError, message, timeSeconds = 2000 }) {
  setError(new Error(message))
  setTimeout(() => {
    setError(null)
  }, timeSeconds)
}
