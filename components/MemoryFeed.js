import { useState } from 'react'
import { Heart, MessageCircle, Trash2, Clock, Tag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const EMOTION_COLORS = {
  joy: 'from-yellow-400/20 to-orange-500/20 border-yellow-500/30',
  calm: 'from-blue-400/20 to-cyan-500/20 border-blue-500/30',
  excited: 'from-pink-400/20 to-purple-500/20 border-pink-500/30',
  reflective: 'from-indigo-400/20 to-purple-500/20 border-indigo-500/30',
  grateful: 'from-emerald-400/20 to-green-500/20 border-emerald-500/30',
  curious: 'from-purple-400/20 to-pink-500/20 border-purple-500/30',
  neutral: 'from-gray-400/20 to-gray-500/20 border-gray-500/30'
}

export default function MemoryFeed({ memories, onDeleteMemory, searchQuery }) {
  const [expandedMemory, setExpandedMemory] = useState(null)

  const highlightText = (text, query) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-purple-500/30 text-purple-200 px-1 rounded">{part}</mark> : 
        part
    )
  }

  if (memories.length === 0) {
    return (
      <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No memories yet</h3>
        <p className="text-purple-200/70 max-w-md mx-auto">
          Start capturing your thoughts, insights, and moments. Your AI memory vault is ready to remember everything for you.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {searchQuery ? `Search Results (${memories.length})` : `Recent Memories (${memories.length})`}
        </h2>
      </div>
      
      <div className="space-y-4">
        {memories.map((memory) => (
          <div
            key={memory.id}
            className={`bg-gradient-to-r ${EMOTION_COLORS[memory.emotion] || EMOTION_COLORS.neutral} rounded-2xl p-6 border backdrop-blur-sm transition-all hover:scale-[1.02] cursor-pointer`}
            onClick={() => setExpandedMemory(expandedMemory === memory.id ? null : memory.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-white/90 leading-relaxed text-lg">
                  {highlightText(memory.content, searchQuery)}
                </p>
                
                {memory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {memory.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center space-x-1 px-2 py-1 bg-white/10 rounded-full text-xs text-purple-200"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center space-x-4 mt-4 text-sm text-purple-200/60">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDistanceToNow(new Date(memory.timestamp), { addSuffix: true })}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                      memory.emotion === 'joy' ? 'from-yellow-400 to-orange-500' :
                      memory.emotion === 'calm' ? 'from-blue-400 to-cyan-500' :
                      memory.emotion === 'excited' ? 'from-pink-400 to-purple-500' :
                      memory.emotion === 'reflective' ? 'from-indigo-400 to-purple-500' :
                      memory.emotion === 'grateful' ? 'from-emerald-400 to-green-500' :
                      memory.emotion === 'curious' ? 'from-purple-400 to-pink-500' :
                      'from-gray-400 to-gray-500'
                    }`} />
                    <span className="capitalize">{memory.emotion}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteMemory(memory.id)
                }}
                className="p-2 text-purple-300/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            {expandedMemory === memory.id && memory.aiSummary && (
              <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in duration-300">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-200">AI Insight</span>
                  </div>
                  <p className="text-sm text-purple-200/80">{memory.aiSummary}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}