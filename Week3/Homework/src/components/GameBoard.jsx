const GRID_COLS = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };

const IMAGES = { mole: '/두더지.png', hit: '/hit.png', bomb: '/폭탄.png' };

function Hole({ hole, onClickHole }) {
  const img = IMAGES[hole.type];

  return (
    <button
      type="button"
      onClick={() => onClickHole(hole.id)}
className={`aspect-square rounded-full overflow-hidden ${img ? 'cursor-pointer' : 'bg-[#a8d8e4] cursor-default'}`}
    >
      {img && <img src={img} className="w-full h-full object-cover" />}
    </button>
  );
}

function GameBoard({ holes, size, onClickHole }) {
  let displayHoles = holes;
  if (holes.length === 0) {
    displayHoles = [];
    for (let i = 0; i < size * size; i++) {
      displayHoles.push({ id: i, type: null });
    }
  }

  return (
    <div className={`grid ${GRID_COLS[size]} gap-4 h-full aspect-square rounded-2xl p-6 bg-[#dff0f5]`}>
      {displayHoles.map(hole => (
        <Hole key={hole.id} hole={hole} onClickHole={onClickHole} />
      ))}
    </div>
  );
}

export default GameBoard;
