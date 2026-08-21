import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProgress, ACHIEVEMENTS } from '../contexts/ProgressContext'
import { TrendingUp, Award, Target, Zap, Calendar, Flame, BookOpen, Star, BarChart3, Sparkles } from 'lucide-react'
import EmptyState from '../components/EmptyState'

const MODULE_LABELS = {
  flashcards: { label: 'Flashcards', color: '#2997FF', emoji: '📚' },
  games: { label: 'Jogos', color: '#FF7A18', emoji: '🎮' },
  listening: { label: 'Listening', color: '#0066FF', emoji: '🎧' },
  builder: { label: 'Montar Frase', color: '#5DA9FF', emoji: '🧱' },
  speaking: { label: 'Speaking', color: '#FF9D42', emoji: '🎙️' },
}

function todayISO() { return new Date().toISOString().slice(0, 10) }
function getDateArray(days) { const dates=[]; for(let i=days-1;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);dates.push(d.toISOString().slice(0,10))} return dates }

export default function Dashboard() {
  const { xp, level, totalCorrect, totalAttempts, streak, bestStreak, perModule, dailyLog, dailyGoal, achievements, xpInLevel, xpToNext } = useProgress()
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
  const todayXp = dailyLog[todayISO()]?.xp || 0
  const goalPercent = Math.min((todayXp / dailyGoal) * 100, 100)
  const heatmapDates = useMemo(() => getDateArray(91), [])
  const maxXpInPeriod = useMemo(() => Math.max(1, ...heatmapDates.map(d => dailyLog[d]?.xp || 0)), [dailyLog, heatmapDates])
  const last7Days = useMemo(() => getDateArray(7), [])
  const maxXp7 = Math.max(1, ...last7Days.map(d => dailyLog[d]?.xp || 0))
  const activeDays = Object.keys(dailyLog).length
  const totalXpEver = Object.values(dailyLog).reduce((sum,d)=>sum+(d.xp||0),0)
  const recentAchievements = achievements.slice(-3).map(id=>ACHIEVEMENTS.find(a=>a.id===id)).filter(Boolean).reverse()

  if (totalXpEver === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center">
            <BarChart3 size={22} className="text-blue-300" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm">Seu progresso em detalhes</p>
          </div>
        </div>
        <EmptyState
          icon={<Sparkles size={22} />}
          title="Seu dashboard tá zerado — bora mudar isso"
          desc="Faça sua primeira atividade em qualquer módulo pra começar a acumular XP, streak e ver os gráficos ganharem vida."
          action={
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/flashcards" className="btn-primary">Começar por Flashcards</Link>
              <Link to="/" className="btn-secondary">Ver todos os módulos</Link>
            </div>
          }
        />
      </div>
    )
  }

  return <div className="max-w-6xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-6">
    <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center"><BarChart3 size={22} className="text-blue-300" /></div><div><h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1><p className="text-gray-400 text-sm">Seu progresso em detalhes</p></div></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <BigStatCard icon={Star} label="Nível" value={level} sub={`${xp} XP totais`} color="blue" />
      <BigStatCard icon={Flame} label="Sequência" value={`${streak}`} sub={`Melhor: ${bestStreak || streak}`} color="orange" />
      <BigStatCard icon={Target} label="Precisão" value={`${accuracy}%`} sub={`${totalCorrect}/${totalAttempts}`} color="green" />
      <BigStatCard icon={Calendar} label="Dias ativos" value={activeDays} sub={`de ${Math.max(1, activeDays)} totais`} color="sky" />
    </div>
    <div className="card-elevated p-6"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center"><Target size={20} className="text-blue-300" /></div><div><h3 className="text-lg font-bold text-white">Meta de hoje</h3><p className="text-xs text-gray-400">Continue estudando para atingir sua meta diária</p></div></div><div className="text-right"><p className="text-2xl font-bold text-white">{todayXp}<span className="text-gray-500 text-sm">/{dailyGoal}</span></p><p className="text-xs text-gray-400">XP hoje</p></div></div><div className="progress-bar h-3"><div className="progress-fill transition-all duration-500" style={{width:`${goalPercent}%`}} /></div>{goalPercent>=100?<p className="text-sm text-emerald-400 mt-3">🎉 Meta atingida! Continue para ganhar mais XP.</p>:<p className="text-sm text-gray-400 mt-3">Faltam <span className="text-blue-300 font-semibold">{dailyGoal-todayXp} XP</span> para atingir sua meta hoje.</p>}</div>
    <div className="card-elevated p-6"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-400/25 flex items-center justify-center"><Zap size={20} className="text-orange-300" /></div><div><h3 className="text-lg font-bold text-white">Nível {level} → {level+1}</h3><p className="text-xs text-gray-400">Ganhe XP para subir de nível</p></div></div><div className="text-right"><p className="text-lg font-bold text-white font-mono">{xpInLevel}/{xpToNext}</p><p className="text-xs text-gray-400">XP</p></div></div><div className="progress-bar h-3"><div className="progress-fill transition-all duration-500" style={{width:`${(xpInLevel/Math.max(xpToNext,1))*100}%`}} /></div></div>
    <div className="card-elevated p-6"><div className="flex items-center gap-3 mb-6"><TrendingUp size={20} className="text-blue-400" /><h3 className="text-lg font-bold text-white">Últimos 7 dias</h3></div><div className="flex items-end justify-between gap-2 h-40 pt-4">{last7Days.map(date=>{const dayXp=dailyLog[date]?.xp||0;const height=maxXp7>0?(dayXp/maxXp7)*100:0;const d=new Date(date+'T00:00:00');const dayName=['D','S','T','Q','Q','S','S'][d.getDay()];const isToday=date===todayISO();return <div key={date} className="flex-1 flex flex-col items-center gap-2 group"><div className="flex-1 w-full flex items-end relative">{dayXp>0&&<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{dayXp} XP</div>}<div className={`w-full rounded-t-lg transition-all duration-500 ${isToday?'bg-gradient-to-t from-orange-600 to-orange-400 shadow-glow-sm':dayXp>0?'bg-gradient-to-t from-blue-800 to-blue-500':'bg-bg-elevated'}`} style={{height:`${Math.max(height,dayXp>0?8:4)}%`}} /></div><span className={`text-xs font-medium ${isToday?'text-orange-300':'text-gray-500'}`}>{dayName}</span></div>})}</div></div>
    <div className="card-elevated p-6"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><Calendar size={20} className="text-blue-400" /><h3 className="text-lg font-bold text-white">Atividade (últimos 90 dias)</h3></div><div className="flex items-center gap-2 text-xs text-gray-500"><span>Menos</span><div className="flex gap-1">{[0,.25,.5,.75,1].map(i=><div key={i} className="w-3 h-3 rounded" style={{background:heatColor(i)}} />)}</div><span>Mais</span></div></div><div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1">{heatmapDates.map(date=>{const xpDay=dailyLog[date]?.xp||0;const intensity=xpDay/maxXpInPeriod;return <div key={date} className="aspect-square rounded transition-transform hover:scale-125 cursor-help" style={{background:xpDay>0?heatColor(intensity):'#122033'}} title={`${date}: ${xpDay} XP`} />})}</div></div>
    <div className="card-elevated p-6"><div className="flex items-center gap-3 mb-4"><BookOpen size={20} className="text-blue-400" /><h3 className="text-lg font-bold text-white">Progresso por módulo</h3></div><div className="space-y-4">{Object.entries(perModule).map(([key,data])=>{const info=MODULE_LABELS[key]||{label:key,color:'#2997FF',emoji:'📖'};const acc=data.attempts>0?Math.round((data.correct/data.attempts)*100):0;const barWidth=data.attempts>0?Math.min(100,(data.correct/100)*100):0;return <div key={key}><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><span className="text-lg">{info.emoji}</span><span className="text-sm font-semibold text-white">{info.label}</span></div><div className="flex items-center gap-3 text-xs"><span className="text-gray-400">{data.correct} acertos</span><span className="text-blue-300 font-semibold">{acc}%</span></div></div><div className="h-2 bg-bg-elevated rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{width:`${Math.max(barWidth,data.correct>0?3:0)}%`,background:`linear-gradient(90deg, ${info.color}, ${info.color}dd)`}} /></div></div>})}</div></div>
    {recentAchievements.length>0&&<div className="card-elevated p-6"><div className="flex items-center gap-3 mb-4"><Award size={20} className="text-orange-300" /><h3 className="text-lg font-bold text-white">Conquistas recentes</h3></div><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{recentAchievements.map(a=><div key={a.id} className="bg-bg-elevated rounded-xl p-4 border border-blue-800/30"><div className="text-3xl mb-2">{a.emoji}</div><p className="text-sm font-semibold text-white">{a.label}</p><p className="text-xs text-gray-400 mt-1">{a.desc}</p></div>)}</div></div>}
    <div className="card-elevated p-6 text-center"><p className="text-gray-400 text-sm">XP acumulado total</p><p className="text-4xl font-bold text-gradient mt-2">{totalXpEver.toLocaleString()}</p><p className="text-xs text-gray-500 mt-1">em {activeDays} dia{activeDays!==1?'s':''} de estudo</p></div>
  </div>
}

function BigStatCard({icon:Icon,label,value,sub,color}) {
  const styles={blue:'bg-blue-600/15 border-blue-500/25 text-blue-200',orange:'bg-orange-500/15 border-orange-400/25 text-orange-200',green:'bg-emerald-500/15 border-emerald-400/25 text-emerald-200',sky:'bg-sky-500/15 border-sky-400/25 text-sky-200'}
  return <div className={`card-elevated p-4 border ${styles[color]}`}><Icon size={22}/><p className="text-xs text-white/70 mt-2">{label}</p><p className="text-2xl lg:text-3xl font-bold text-white mt-1">{value}</p><p className="text-xs text-white/60 mt-1">{sub}</p></div>
}
function heatColor(intensity){if(intensity===0)return'#122033';if(intensity<.25)return'#0B4EA2';if(intensity<.5)return'#0066FF';if(intensity<.75)return'#2997FF';return'#66B3FF'}
