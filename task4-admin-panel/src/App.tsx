import { Toaster } from "@/components/atoms/sonner"
import { DashboardContainer } from "@/pages/Dashboard/DashboardContainer"
import React from "react"

function App() {
  return (
    <React.Fragment>
      <DashboardContainer />
      <Toaster />
    </React.Fragment>
  )
}

export default App
