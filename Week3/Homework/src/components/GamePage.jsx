import { useState, useRef, useEffect } from 'react';
import { useRanking } from '../hooks/useRanking';
import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import Modal from './Modal';

const LEVELS = {
  1: { size: 2, time: 15, showDuration: 1200, interval: 900 },
  2: { size: 3, time: 20, showDuration: 1000, interval: 750 },
  3: { size: 4, time: 30, showDuration: 800, interval: 600 },
};

function GamePage() {
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  const [holes, setHoles] = useState([]);
  const [score, setScore] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [message, setMessage] = useState('');
  const intervalRef = useRef(null);
  const timeoutRefs = useRef([]);

  const { addRanking } = useRanking();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 600);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (!isPlaying || timeLeft > 0) return;
    clearInterval(intervalRef.current);
    for (let i = 0; i < timeoutRefs.current.length; i++) clearTimeout(timeoutRefs.current[i]);
    timeoutRefs.current = [];
    setHoles([]);
    setIsPlaying(false);
    setShowModal(true);
    addRanking({ level, score, timestamp: Date.now() });
  }, [timeLeft, isPlaying, level, score, addRanking]);


  const handleStart = () => {
    const config = LEVELS[level];

    clearInterval(timerRef.current);
    clearInterval(intervalRef.current);
    for (let i = 0; i < timeoutRefs.current.length; i++) clearTimeout(timeoutRefs.current[i]);
    timeoutRefs.current = [];

    const initHoles = [];
    for (let i = 0; i < config.size * config.size; i++) {
      initHoles.push({ id: i, type: null });
    }

    setShowModal(false);
    setIsPlaying(true);
    setHoles(initHoles);
    setScore(0);
    setSuccessCount(0);
    setFailCount(0);
    setMessage('');
    setTimeLeft(config.time);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = Math.round((prev - 0.1) * 10) / 10;
        if (next <= 0) {
          clearInterval(timerRef.current);
          return 0;
        }
        return next;
      });
    }, 100);

    intervalRef.current = setInterval(() => {
      setHoles(prev => {
        const emptyIndexes = [];
        for (let i = 0; i < prev.length; i++) {
          if (prev[i].type === null) emptyIndexes.push(i);
        }

        if (emptyIndexes.length === 0) return prev;

        const idx = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        const type = Math.random() < 0.3 ? 'bomb' : 'mole';

        timeoutRefs.current[idx] = setTimeout(() => {
          setHoles(current =>
            current.map((h, i) =>
              i === idx && h.type === type ? { ...h, type: null } : h
            )
          );
          delete timeoutRefs.current[idx];
        }, config.showDuration);

        const next = [];
        for (let i = 0; i < prev.length; i++) {
          next.push(i === idx ? { ...prev[i], type } : prev[i]);
        }
        return next;
      });
    }, config.interval);
  };

  const handleStop = () => {
    clearInterval(timerRef.current);
    clearInterval(intervalRef.current);
    for (let i = 0; i < timeoutRefs.current.length; i++) clearTimeout(timeoutRefs.current[i]);
    timeoutRefs.current = [];
    setHoles([]);
    setIsPlaying(false);
    setTimeLeft(0);
  };

  const clickHole = (index) => {
    setHoles(prev => {
      const hole = prev[index];
      if (!hole || hole.type === null || hole.type === 'hit') return prev;

      if (hole.type === 'bomb') {
        setScore(s => s - 1);
        setFailCount(c => c + 1);
        setMessage('폭탄!');
        clearTimeout(timeoutRefs.current[index]);
        timeoutRefs.current[index] = null;
        return prev.map((h, i) => (i === index ? { ...h, type: null } : h));
      }

      if (hole.type === 'mole') {
        setScore(s => s + 1);
        setSuccessCount(c => c + 1);
        setMessage('잡았다!');
        clearTimeout(timeoutRefs.current[index]);

        timeoutRefs.current[index] = setTimeout(() => {
          setHoles(current =>
            current.map((h, i) => (i === index ? { ...h, type: null } : h))
          );
          timeoutRefs.current[index] = null;
        }, 700);

        return prev.map((h, i) => (i === index ? { ...h, type: 'hit' } : h));
      }

      return prev;
    });
  };

  return (
    <div className="flex w-full h-full justify-between gap-4">
      <GameStatus
        displayTime={isPlaying ? timeLeft : LEVELS[level].time}
        score={score}
        successCount={successCount}
        failCount={failCount}
        message={message}
      />

      <div className="flex flex-col w-full h-full">
        <div className="flex items-center justify-between">
          <select
            value={level}
            onChange={e => setLevel(Number(e.target.value))}
            disabled={isPlaying}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
          </select>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleStart}
              disabled={isPlaying}
              className="px-5 py-2 bg-gray-800 rounded-full text-sm text-white font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              시작
            </button>
            <button
              type="button"
              onClick={handleStop}
              disabled={!isPlaying}
              className="px-5 py-2 bg-gray-400 rounded-full text-sm text-white font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              중단
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 justify-center mb-5">
          <GameBoard
            holes={holes}
            size={LEVELS[level].size}
            onClickHole={isPlaying ? clickHole : () => {}}
          />
        </div>
      </div>

      {showModal && (
        <Modal score={score} level={level} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default GamePage;
