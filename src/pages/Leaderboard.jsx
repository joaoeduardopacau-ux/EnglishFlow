import { useState, useEffect, useMemo } from 'react'
import { Trophy, Medal, Flame, Zap, Crown, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress, levelFromXP } from '../contexts/ProgressContext'

// Nomes fictícios para o "leaderboard demo" (quando não há Firebase)
const DEMO_PLAYERS = [
  { name: 'Ana Silva', xp: 1250, streak: 12, avatar: '👩' },
  { name: 'Carlos Souza', xp: 980, streak: 5, avatar: '👨' },
  { name: 'Beatriz Lima', xp: 780, streak: 8, avatar: '👩‍🦰' },
  { name: 'Diego Alves', xp: 620, streak: 3, avatar: '👨‍🦱' },
  { name: 'Elena Costa', xp: 540, streak: 15, avatar: '👩‍🦳' },
  { name: 'Felipe Oliveira', xp: 480, streak: 2, avatar: '👨‍🦲' },
  { name: 'Gabriela Mendes', xp: 420, streak: 7, avatar: '🧑' },
  { name: 'Henrique Rocha', xp: 350, streak: 1, avatar: '🧔' },
  { name: 'Isabela Ferreira', xp: 280, streak: 4, avatar: '👩‍🎓' },
  { name: 'João Pedro', xp: 220, streak: 6, avatar: '🧑‍🎓' },
]

export default function Leaderboard() {
  const { user } = useAuth()
  const { xp, streak } = useProgress()
  const [tab, setTab] = useState('global') // global | weekly

  // Cria leaderboard incluindo o usuário
  const players = useMemo(() => {
    const userEntry = {
      name: user?.displayName || 'Você',
      xp: xp,
      streak: streak,
      avatar: '🎓',
      isYou: true,
    }
    return [...DEMO_PLAYERS, userEntry]
      .sort((a, b) => b.xp - a.xp)
      .map((p, i) => ({ ...p, rank: i + 1 }))
  }, [xp, streak, user])

  const yourRank = players.find(p => p.isYou)?.rank || players.length

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-700 flex items-center justify-center shadow-glow-sm">
          <Trophy size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Leaderboard</h1>
          <p className="text-gray-400 text-sm">Compare seu progresso com outros aprendizes</p>
        </div>
      </div>

      {/* Sua posição */}
      <div className="card-elevated overflow-hidden">
        <div className="bg-gradient-to-br from-purple-700 to-fuchsia-900 p-6 text-center">
          <p className="text-white/70 text-sm uppercase tracking-wider font-semibold">Sua posição</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Crown size={32} className="text-yellow-300" />
            <p className="text-5xl font-bold text-white">#{yourRank}</p>
          </div>
          <p className="text-white/80 mt-2">{xp} XP · Nível {levelFromXP(xp)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-elevated rounded-lg p-1 max-w-md mx-auto">
        <button
          onClick={() => setTab('global')}
          className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
            tab === 'global' ? 'bg-purple-600 text-white' : 'text-gray-400'
          }`}
        >
          <TrendingUp size={12} /> Global
        </button>
        <button
          onClick={() => setTab('weekly')}
          className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
            tab === 'weekly' ? 'bg-purple-600 text-white' : 'text-gray-400'
          }`}
        >
          <Zap size={12} /> Semanal
        </button>
      </div>

      {/* Ranking */}
      <div className="card-elevated p-2">
        <div className="space-y-1">
          {players.slice(0, 15).map(player => (
            <PlayerRow key={player.name + player.rank} player={player} />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="card p-5">
        <div className="flex items-start gap-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <p className="text-white font-semibold">Sobre o Leaderboard</p>
            <p className="text-sm text-gray-400 mt-1">
              Este é um leaderboard demo. Quando o Firebase estiver configurado,
              você verá o ranking real de todos os usuários do EnglishFlow!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlayerRow({ player }) {
  const level = levelFromXP(player.xp)

  const rankColor = player.rank === 1
    ? 'from-yellow-400 to-yellow-600 text-yellow-950'
    : player.rank === 2
    ? 'from-slate-300 to-slate-500 text-slate-900'
    : player.rank === 3
    ? 'from-orange-400 to-orange-700 text-orange-950'
    : 'from-bg-elevated to-bg-elevated text-gray-400 border border-border-subtle'

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
      player.isYou
        ? 'bg-purple-950/40 border border-purple-800/40 shadow-glow-sm'
        : 'hover:bg-bg-elevated'
    }`}>
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rankColor} flex items-center justify-center font-bold text-lg shrink-0`}>
        {player.rank <= 3 ? (
          player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'
        ) : (
          <span className="text-sm">{player.rank}</span>
        )}
      </div>

      <div className="text-2xl shrink-0">{player.avatar}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-semibold truncate ${player.isYou ? 'text-purple-200' : 'text-white'}`}>
            {player.name}
            {player.isYou && <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-md">Você</span>}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
          <span>Nv.{level}</span>
          <span className="flex items-center gap-1">
            <Flame size={10} className="text-orange-400" /> {player.streak}
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-lg font-bold text-white font-mono">{player.xp}</p>
        <p className="text-[10px] text-gray-500 uppercase">XP</p>
      </div>
    </div>
  )
}
