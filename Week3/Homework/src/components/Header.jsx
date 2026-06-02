function Header({ activeTab, onTabChange }) {
  return (
    <header className="flex w-full m-5 bg-white rounded-2xl">
      <div className="flex max-w-5xl items-center gap-4 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">두더지 게임</h1>
        <nav className="flex gap-2">
          <button
            type="button"
            onClick={() => onTabChange('game')}
            className={`px-4 py-1.5 border rounded-full text-sm font-medium cursor-pointer ${activeTab === 'game' ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-500'}`}
          >
            게임
          </button>
          <button
            type="button"
            onClick={() => onTabChange('ranking')}
            className={`px-4 py-1.5 border rounded-full text-sm font-medium cursor-pointer ${activeTab === 'ranking' ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-500'}`}
          >
            랭킹
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
