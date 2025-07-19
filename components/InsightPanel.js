import { Brain, TrendingUp, Calendar, Zap } from 'lucide-react'

export default function InsightPanel({ memories }) {
  const getTopEmotions = () => {
    const emotionCounts = memories.reduce((acc, memory) => {
      acc[memory.emotion] = (acc[memory.emotion] || 0) + 1
      return acc
    }, {})
    
    return Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
  }

  const getRecentTrends = () => {
    const recent = memories.slice(0, 10)
    const tags = recent.flatMap(m => m.tags)
    const tagCounts = tags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {})
    
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
  }

  const getInsights = () => {
    if (memories.length === 0) return []
    
    const insights = []
    const emotions = getTopEmotions()
    const trends = getRecentTrends()
    
    if (emotions.length > 0) {
      insights.push({
        icon: Brain,
        title: 'Emotional Pattern',
        content: `You are feeling ${emotions[0][0]} most often recently`,
        color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
      })
    }
    
    if (trends.length > 0) {
      insights.push({
        icon: TrendingUp,
        title: 'Focus Area',
        content: `${trends[0][0]} has been on your mind lately`,
        color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
      })
    }
    
    const thisWeek = memories.filter(m => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(m.timestamp) > weekAgo
    }).length
    
    if (thisWeek > 0) {
      insights.push({
        icon: Calendar,
        title: 'This Week',
        content: `${thisWeek} memories captured - you are being mindful!`,
        color: 'from-green-500/20 to-emerald-500/20 border-green-500/30'
      })
    }
    
    return insights
  }

  const insights = getInsights()

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center space-x-2 mb-6">
        <Zap className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">AI Insights</h3>
      </div>
      
      {insights.length === 0 ? (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-purple-400/50 mx-auto mb-3" />
          <p className="text-purple-200/70 text-sm">
            Add some memories to see personalized insights about your patterns and trends.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${insight.color} rounded-xl p-4 border backdrop-blur-sm`}
            >
              <div className="flex items-start space-x-3">
                <insight.icon className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white text-sm mb-1">{insight.title}</h4>
                  <p className="text-white/80 text-xs leading-relaxed">{insight.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-purple-300/60 text-center">
              Insights update as you add more memories
            </p>
          </div>
        </div>
      )}
    </div>
  )
}