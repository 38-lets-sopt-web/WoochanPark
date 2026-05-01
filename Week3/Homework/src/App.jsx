import { useState } from 'react'
import Header from './components/Header'
import GamePage from './components/GamePage'
import RankingBoard from './components/RankingBoard'

function App() {
  const [activeTab, setActiveTab] = useState('game')

  return (
    <div className="flex w-screen h-screen flex-col items-center bg-gray-100 px-16">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex flex-1 min-h-0 w-full justify-center">
        {activeTab === 'game' ? <GamePage /> : <RankingBoard />}
      </main>
    </div>
  )
}

export default App
