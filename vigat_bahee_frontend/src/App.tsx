import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from '../src/config/routeConfig.tsx'
function App() {
  console.log("start")

  return (
    <>
        <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App