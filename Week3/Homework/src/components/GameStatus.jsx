import { formatScore } from '../utils/format';

function StatCard({ label, children }) {
  return (
    <div className="p-5 bg-white rounded-2xl ">
      <p className="text-sm text-gray-400 mb-2 text-center">{label}</p>
      {children}
    </div>
  );
}

function GameStatus({ displayTime, score, successCount, failCount, message }) {
  return (
    <div className="flex flex-col gap-3 w-1/5">
      <StatCard label="남은 시간">
        <p className="text-3xl font-bold text-gray-800 text-center">
          {displayTime.toFixed(1)}
        </p>
      </StatCard>

      <StatCard label="총 점수">
        <p className={`text-3xl font-bold text-center ${score < 0 ? 'text-red-500' : 'text-gray-800'}`}>
          {formatScore(score)}
        </p>
      </StatCard>

      <div className="flex gap-3">
        <div className="flex-1 p-5 bg-white rounded-2xl text-center">
          <p className="text-sm text-green-500 mb-2">성공</p>
          <p className="text-3xl font-bold text-gray-800">{successCount}</p>
        </div>
        <div className="flex-1 p-5 bg-white rounded-2xl text-center">
          <p className="text-sm text-red-400 mb-2">실패</p>
          <p className="text-3xl font-bold text-gray-800">{failCount}</p>
        </div>
      </div>

      <StatCard label="안내 메시지">
        <p className="min-h-5 text-sm text-center text-gray-500">
          {message}
        </p>
      </StatCard>
    </div>
  );
}

export default GameStatus;
