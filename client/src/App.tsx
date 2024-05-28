import { Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Chat from "./Pages/Chat"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/chats" Component={Chat} />
      </Routes>
    </>
  )
}

export default App
