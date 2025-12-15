"use client";

import { useState, useEffect } from "react";
import { FiSave, FiRefreshCw, FiGrid, FiTarget, FiSettings, FiSliders } from "react-icons/fi";


function TicTacToeGame({ n, userConfig }) {
  const styles = {
    cellColor: userConfig?.bgColor || "#ffffff",
    borderColor: userConfig?.borderColor || "#333",
    xColor: userConfig?.xColor || "#2563eb",
    oColor: userConfig?.oColor || "#dc2626",
    cellSize: userConfig?.cellSize ? `${userConfig.cellSize}px` : "40px",
    fontSize: userConfig?.fontSize ? `${userConfig.fontSize}px` : "24px",
  };

  const winLength = userConfig?.winLength || 5;

  const [board, setBoard] = useState(
    Array(n).fill(null).map(() => Array(n).fill(null))
  );
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [stats, setStats] = useState({ movesX: 0, movesO: 0, empty: n * n });

  useEffect(() => {
    const savedState = localStorage.getItem("tictactoe_save_state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.board.length === n) {
          setBoard(parsed.board);
          setIsXNext(parsed.isXNext);
          setWinner(parsed.winner);
          setStats(parsed.stats);
        }
      } catch (e) { console.error(e); }
    }
  }, [n]);

  const checkWin = (boardState, r, c, player) => {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (let [dr, dc] of directions) {
      let count = 1;
      for (let i = 1; i < winLength; i++) {
        const nr = r + dr * i, nc = c + dc * i;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && boardState[nr][nc] === player) count++; else break;
      }
      for (let i = 1; i < winLength; i++) {
        const nr = r - dr * i, nc = c - dc * i;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && boardState[nr][nc] === player) count++; else break;
      }
      if (count >= winLength) return true;
    }
    return false;
  };

  const handleMove = (r, c) => {
    if (board[r][c] || winner) return;

    const player = isXNext ? "X" : "O";
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = player;
    setBoard(newBoard);

    const newStats = {
      movesX: player === "X" ? stats.movesX + 1 : stats.movesX,
      movesO: player === "O" ? stats.movesO + 1 : stats.movesO,
      empty: stats.empty - 1,
    };
    setStats(newStats);

    if (checkWin(newBoard, r, c, player)) setWinner(player);
    else if (newStats.empty === 0) setWinner("Remis");
    else setIsXNext(!isXNext);
  };

  const saveGame = () => {
    const gameState = { board, isXNext, winner, stats, date: new Date().toISOString() };
    localStorage.setItem("tictactoe_save_state", JSON.stringify(gameState));
    alert("Stan gry został zapisany!");
  };

  const resetGame = () => {
    setBoard(Array(n).fill(null).map(() => Array(n).fill(null)));
    setWinner(null);
    setIsXNext(true);
    setStats({ movesX: 0, movesO: 0, empty: n * n });
    localStorage.removeItem("tictactoe_save_state");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full mb-6 text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow border border-zinc-200 dark:border-zinc-700">
        <div className="flex justify-between items-center mb-2 border-b border-zinc-100 dark:border-zinc-700 pb-2">
          <h2 className="text-lg font-bold flex items-center gap-2"><FiGrid /> {n}x{n}</h2>
          <div className="text-sm font-medium flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <FiTarget /> Cel: {winLength} w rzędzie
          </div>
        </div>
        {winner ? (
            <div className={`text-center py-2 rounded font-bold text-lg ${winner === "Remis" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
             {winner === "Remis" ? "REMIS!" : `WYGRAŁ GRACZ: ${winner}!`}
           </div>
        ) : (
            <div className="flex justify-around text-sm font-medium pt-2">
                <span style={{ color: styles.xColor }}>Ruchy X: {stats.movesX}</span>
                <span className="text-zinc-300">|</span>
                <span style={{ color: styles.oColor }}>Ruchy O: {stats.movesO}</span>
            </div>
        )}
      </div>

      <div className="transition-all duration-300" style={{
          display: "grid",
          gridTemplateColumns: `repeat(${n}, ${styles.cellSize})`,
          gap: "2px",
          backgroundColor: styles.borderColor,
          border: `4px solid ${styles.borderColor}`,
          opacity: winner ? 0.6 : 1,
          pointerEvents: winner ? "none" : "auto",
        }}>
        {board.map((row, r) => row.map((cell, c) => (
            <div key={`${r}-${c}`} onClick={() => handleMove(r, c)} style={{
                width: styles.cellSize, height: styles.cellSize, backgroundColor: styles.cellColor,
                color: cell === "X" ? styles.xColor : styles.oColor, fontSize: styles.fontSize,
              }} className="flex items-center justify-center font-bold cursor-pointer hover:brightness-95 transition-colors select-none">
              {cell}
            </div>
        )))}
      </div>

      <div className="flex gap-4 mt-6 w-full">
        <button onClick={saveGame} disabled={!!winner} className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:opacity-90 disabled:opacity-50">
          <FiSave /> Zapisz
        </button>
        <button onClick={resetGame} className="flex items-center justify-center gap-2 py-2 px-4 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800">
          <FiRefreshCw /> Reset
        </button>
      </div>
    </div>
  );
}

function GameConfigPanel({ size, config, onSizeChange, onWinLengthChange, onConfigChange }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 space-y-6">
      <div>
        <h3 className="font-bold flex items-center gap-2 mb-3 text-zinc-800 dark:text-zinc-200 border-b pb-2 dark:border-zinc-700">
          <FiSettings /> Zasady Gry
        </h3>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold mb-1 text-zinc-500 uppercase">Rozmiar (N)</label>
                <input type="number" value={size} onChange={onSizeChange} min="3" max="20" className="w-full p-2 border rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"/>
            </div>
            <div>
                <label className="block text-xs font-bold mb-1 text-zinc-500 uppercase">Do wygranej</label>
                <input type="number" value={config.winLength} onChange={onWinLengthChange} min="3" max={size} className="w-full p-2 border rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"/>
            </div>
        </div>
        <p className="text-xs text-zinc-400 mt-2">Wygrana po ułożeniu <strong>{config.winLength}</strong> symboli.</p>
      </div>

      <div>
        <h3 className="font-bold flex items-center gap-2 mb-3 text-zinc-800 dark:text-zinc-200 border-b pb-2 dark:border-zinc-700">
          <FiSliders /> Wygląd
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm"><span className="block mb-1 text-zinc-500">Tło pola</span><input type="color" name="bgColor" value={config.bgColor} onChange={onConfigChange} className="w-full h-8 cursor-pointer rounded border"/></label>
            <label className="text-sm"><span className="block mb-1 text-zinc-500">Siatka</span><input type="color" name="borderColor" value={config.borderColor} onChange={onConfigChange} className="w-full h-8 cursor-pointer rounded border"/></label>
            <label className="text-sm"><span className="block mb-1 text-zinc-500">Gracz X</span><input type="color" name="xColor" value={config.xColor} onChange={onConfigChange} className="w-full h-8 cursor-pointer rounded border"/></label>
            <label className="text-sm"><span className="block mb-1 text-zinc-500">Gracz O</span><input type="color" name="oColor" value={config.oColor} onChange={onConfigChange} className="w-full h-8 cursor-pointer rounded border"/></label>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="block text-xs font-medium mb-1 text-zinc-500">Rozmiar (px)</label><input type="number" name="cellSize" value={config.cellSize} onChange={onConfigChange} className="w-full p-2 text-sm border rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"/></div>
            <div><label className="block text-xs font-medium mb-1 text-zinc-500">Font (px)</label><input type="number" name="fontSize" value={config.fontSize} onChange={onConfigChange} className="w-full p-2 text-sm border rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"/></div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function TicTacToeManager({ user }) {
  const [size, setSize] = useState(10);
  const [config, setConfig] = useState({
    winLength: 5, bgColor: "#ffffff", borderColor: "#333333",
    xColor: "#2563eb", oColor: "#dc2626", cellSize: 40, fontSize: 24
  });

  useEffect(() => {
    if (config.winLength > size) setConfig(prev => ({ ...prev, winLength: size }));
  }, [size, config.winLength]);

  const handleConfigChange = (e) => setConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleSizeChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      let newSize = Math.max(3, Math.min(20, val));
      setSize(newSize);
      if (newSize < config.winLength) setConfig(prev => ({ ...prev, winLength: newSize }));
    }
  };

  const handleWinLengthChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 3 && val <= size) setConfig(prev => ({ ...prev, winLength: val }));
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Kółko i Krzyżyk ({size}x{size})</h1>
        <p className="mt-2 text-zinc-500">Gracz: {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <GameConfigPanel 
            size={size} config={config}
            onSizeChange={handleSizeChange} onWinLengthChange={handleWinLengthChange} onConfigChange={handleConfigChange}
        />
        <div className="lg:col-span-2 flex justify-center bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 overflow-auto min-h-[500px] items-start pt-10">
          <TicTacToeGame key={`${size}-${config.winLength}`} n={size} userConfig={config} />
        </div>
      </div>
    </div>
  );
}