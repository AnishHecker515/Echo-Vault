import { useState } from 'react'
import { Plus, Sparkles, Heart, Lightbulb, Users, Briefcase } from 'lucide-react'

const EMOTION_COLORS = {
  joy: 'from-yellow-400 to-orange-500',
  calm: 'from-blue-400 to-cyan-500',
  excited: 'from-pink-400 to-purple-500',
  reflective: 'from-indigo-400 to-purple-500',
  grateful: 'from-emerald-400 to-green-500',
  curious: 'from-purple-400 to-pink-500',
  neutral: 'from-gray-400 to-gray-500'
}

const QUICK_TAGS = [
  { icon: Heart, label: 'Personal', color: 'text-pink-400' },
  { icon: Lightbulb, label: 'Insight', color: 'text-yellow-400' },
  { icon: Users, label: 'People', color: 'text-green-400' },
  { icon: Briefcase, label: 'Work', color: 'text-blue-400' }
]

export default function MemoryInput({ onAddMemory }) {
  const [content, setContent] = useState('')
  const [selectedEmotion, setSelectedEmotion] = useState('neutral')
  const [selectedTags, setSelectedTags] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return

    // Simple AI emotion detection (in real app, this would use OpenAI)
    const detectedEmotion = detectEmotion(content)
    
    const memory = {
      content: content.trim(),
      emotion: selectedEmotion !== 'neutral' ? selectedEmotion : detectedEmotion,
      tags: selectedTags,
      aiSummary: generateAISummary(content.trim())
    }
    
    onAddMemory(memory)
    setContent('')
    setSelectedEmotion('neutral')
    setSelectedTags([])
    setIsExpanded(false)
  }

  const detectEmotion = (text) => {
    const lowerText = text.toLowerCase()
    if (lowerText.includes('excited') || lowerText.includes('amazing') || lowerText.includes('awesome')) return 'excited'
    if (lowerText.includes('grateful') || lowerText.includes('thankful') || lowerText.includes('blessed')) return 'grateful'
    if (lowerText.includes('calm') || lowerText.includes('peaceful') || lowerText.includes('serene')) return 'calm'
    if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('wonderful')) return 'joy'
    if (lowerText.includes('thinking') || lowerText.includes('realize') || lowerText.includes('reflect')) return 'reflective'
    if (lowerText.includes('curious') || lowerText.includes('wonder') || lowerText.includes('interesting')) return 'curious'
    return 'neutral'
  }

  const generateAISummary = (text) => {
    // Simple keyword extraction (in real app, this would use OpenAI)
    const words = text.split(' ')
    if (words.length > 20) {
      return text.substring(0, 100) + '...'
    }
    return text
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-r ${EMOTION_COLORS[selectedEmotion]} flex-shrink-0`}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What is on your mind? Share a moment, insight, or memory..."
              className="w-full bg-transparent text-white placeholder-purple-300/50 resize-none focus:outline-none text-lg leading-relaxed"
              rows={isExpanded ? 4 : 2}
            />
            
            {isExpanded && (
              <div className="mt-4 space-y-4 animate-in fade-in duration-300">
                {/* Emotion Selection */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    How are you feeling?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(EMOTION_COLORS).map(([emotion, gradient]) => (
                      <button
                        key={emotion}
                        type="button"
                        onClick={() => setSelectedEmotion(emotion)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          selectedEmotion === emotion
                            ? `bg-gradient-to-r ${gradient} text-white shadow-lg scale-105`
                            : 'bg-white/10 text-purple-200 hover:bg-white/20'
                        }`}
                      >
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Quick Tags */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Quick tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_TAGS.map(({ icon: Icon, label, color }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleTag(label)}
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-all ${
                          selectedTags.includes(label)
                            ? 'bg-purple-500 text-white shadow-lg'
                            : 'bg-white/10 text-purple-200 hover:bg-white/20'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${selectedTags.includes(label) ? 'text-white' : color}`} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-xs text-purple-300/50">
            {content.length}/500 characters
          </div>
          
          <div className="flex space-x-3">
            {isExpanded && (
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false)
                  setSelectedEmotion('neutral')
                  setSelectedTags([])
                }}
                className="px-4 py-2 text-sm text-purple-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!content.trim()}
              className={`flex items-center space-x-2 px-6 py-2 rounded-xl font-medium transition-all ${
                content.trim()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-white/10 text-purple-300/50 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Save Memory</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}