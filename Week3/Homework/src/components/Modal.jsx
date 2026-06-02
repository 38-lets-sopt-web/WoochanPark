import { createPortal } from 'react-dom';
import { formatScore } from '../utils/format';

function Modal({ score, level, onClose }) {
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-72 p-8 text-center bg-white rounded-2xl ">
        <h2 className="text-xl font-bold text-gray-800 mb-1">게임 종료!</h2>
        <p className="text-sm text-gray-400 mb-6">Level {level}</p>
        <p className="text-5xl font-bold mb-1">
          <span className={score >= 0 ? 'text-green-500' : 'text-red-500'}>
            {formatScore(score)}
          </span>
        </p>
        <p className="text-sm text-gray-400 mb-8">점</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-gray-800 rounded-xl text-white font-medium cursor-pointer"
        >
          확인
        </button>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

export default Modal;
