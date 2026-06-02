import { useRanking } from '../hooks/useRanking';
import { formatDate, formatScore } from '../utils/format';

function RankingBoard() {
  const { clearRankings, getSortedRankings } = useRanking();
  const sorted = getSortedRankings();

  return (
    <div className="w-full overflow-hidden bg-white rounded-xl ">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-800">랭킹</h2>
        <button
          type="button"
          onClick={clearRankings}
          className="px-3 py-1.5 border border-red-200 rounded-lg text-sm text-red-500 cursor-pointer"
        >
          초기화
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm">
          아직 기록이 없어요
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-400">
              <th className="py-2 px-4 font-medium text-center">순위</th>
              <th className="py-2 px-4 font-medium text-center">레벨</th>
              <th className="py-2 px-4 font-medium text-center">점수</th>
              <th className="py-2 px-4 font-medium text-center">날짜</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry, index) => (
              <tr
                key={index}
                className="border-t border-gray-50"
              >
                <td className="py-3 px-4 text-center text-sm text-gray-400">{index + 1}</td>
                <td className="py-3 px-4 text-center text-sm font-medium text-gray-700">
                  Lv.{entry.level}
                </td>
                <td className={`py-3 px-4 text-center text-sm font-bold
                  ${entry.score >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {formatScore(entry.score)}
                </td>
                <td className="py-3 px-4 text-center text-xs text-gray-400">
                  {formatDate(entry.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RankingBoard;
