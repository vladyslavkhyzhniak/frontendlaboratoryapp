"use client";

import { useState, useEffect } from "react"; 
import { useAuth } from "@/lib/AuthContext";
import TicTacToeGame from "@/components/TicTacToe"; 
import { FiLock, FiSettings, FiSliders, FiTarget } from "react-icons/fi";
import Link from "next/link"; 

export default function Temat5Page() {
  const { user, loading } = useAuth();
  

  const [size, setSize] = useState(10);


  const [config, setConfig] = useState({
    winLength: 5,            
    bgColor: "#ffffff",
    borderColor: "#333333",
    xColor: "#2563eb",
    oColor: "#dc2626",
    cellSize: 40,
    fontSize: 24
  });


  useEffect(() => {
    if (config.winLength > size) {
      setConfig(prev => ({ ...prev, winLength: size }));
    }
  }, [size, config.winLength]);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      let newSize = val;
      if (val > 20) newSize = 20;
      else if (val < 3) newSize = 3;
      
      setSize(newSize);
      
      if (newSize < config.winLength) {
        setConfig(prev => ({ ...prev, winLength: newSize }));
      }
    }
  };

  const handleWinLengthChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
        if (val > size) return; 
        if (val < 3) return;    
        setConfig(prev => ({ ...prev, winLength: val }));
    }
  };

  if (loading) return <div className="flex justify-center p-10 text-zinc-500">Sprawdzanie uprawnień...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-600 dark:text-zinc-400">
        <FiLock className="w-10 h-10 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Dostęp zablokowany</h2>
        <Link href="/signin" className="px-6 py-2 bg-zinc-900 text-white rounded-lg">Zaloguj się</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Kółko i Krzyżyk ({size}x{size})
        </h1>
        <p className="mt-2 text-zinc-500">Gracz: {user.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 space-y-6">
          
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-3 text-zinc-800 dark:text-zinc-200 border-b pb-2 dark:border-zinc-700">
              <FiSettings /> Zasady Gry
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold mb-1 text-zinc-500 uppercase">Rozmiar (N)</label>
                    <input 
                        type="number" value={size} onChange={handleSizeChange} min="3" max="20"
                        className="w-full p-2 border rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1 text-zinc-500 uppercase">Do wygranej</label>
                    <input 
                        type="number" value={config.winLength} onChange={handleWinLengthChange} min="3" max={size}
                        className="w-full p-2 border rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                </div>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
                Wygrana następuje po ułożeniu <strong>{config.winLength}</strong> symboli w rzędzie.
            </p>
          </div>

          <div>
            <h3 className="font-bold flex items-center gap-2 mb-3 text-zinc-800 dark:text-zinc-200 border-b pb-2 dark:border-zinc-700">
              <FiSliders /> Wygląd
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm"><span className="block mb-1 text-zinc-500">Tło pola</span><input type="color" name="bgColor" value={config.bgColor} onChange={handleConfigChange} className="w-full h-8 cursor-pointer rounded"/></label>
                <label className="text-sm"><span className="block mb-1 text-zinc-500">Siatka</span><input type="color" name="borderColor" value={config.borderColor} onChange={handleConfigChange} className="w-full h-8 cursor-pointer rounded"/></label>
                <label className="text-sm"><span className="block mb-1 text-zinc-500">Gracz X</span><input type="color" name="xColor" value={config.xColor} onChange={handleConfigChange} className="w-full h-8 cursor-pointer rounded"/></label>
                <label className="text-sm"><span className="block mb-1 text-zinc-500">Gracz O</span><input type="color" name="oColor" value={config.oColor} onChange={handleConfigChange} className="w-full h-8 cursor-pointer rounded"/></label>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div><label className="block text-xs font-medium mb-1 text-zinc-500">Rozmiar pola (px)</label><input type="number" name="cellSize" value={config.cellSize} onChange={handleConfigChange} className="w-full p-2 text-sm border rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"/></div>
                <div><label className="block text-xs font-medium mb-1 text-zinc-500">Font (px)</label><input type="number" name="fontSize" value={config.fontSize} onChange={handleConfigChange} className="w-full p-2 text-sm border rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"/></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex justify-center bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 overflow-auto min-h-[500px] items-start pt-10">
          <TicTacToeGame 
            key={`${size}-${config.winLength}`} 
            n={size} 
            userConfig={config} 
          />
        </div>

      </div>
    </div>
  );
}