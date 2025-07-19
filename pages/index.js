import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import MemoryInput from '../components/MemoryInput'
import MemoryFeed from '../components/MemoryFeed'
import SearchBar from '../components/SearchBar'
import InsightPanel from '../components/InsightPanel'
import { Brain, Sparkles, Baseline as Timeline, Search } from 'lucide-react'

export default function Home() {
  const [memories, setMemories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredMemories, setFilteredMemories] = useState([])
  const [activeView, setActiveView] = useState('recent')

  useEffect(() => {
    // Load memories from localStorage on mount
    const savedMemories = localStorage.getItem('echovault-memories')
    if (savedMemories) {
      const parsed = JSON.parse(savedMemories)
      setMemories(parsed)
      setFilteredMemories(parsed)
    }
  }, [])

  useEffect(() => {
    // Save memories to localStorage whenever memories change
    localStorage.setItem('echovault-memories', JSON.stringify(memories))
  }, [memories])

  useEffect(() => {
    // Filter memories based on search query
    if (searchQuery.trim() === '') {
      setFilteredMemories(memories)
    } else {
      const filtered = memories.filter(memory =>
        memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredMemories(filtered)
    }
  }, [searchQuery, memories])

  const addMemory = (memory) => {
    const newMemory = {
      id: Date.now(),
      ...memory,
      timestamp: new Date().toISOString(),
      searchableText: memory.content.toLowerCase()
    }
    setMemories(prev => [newMemory, ...prev])
  }

  const deleteMemory = (id) => {
    setMemories(prev => prev.filter(memory => memory.id !== id))
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    EchoVault
                  </h1>
                  <p className="text-sm text-purple-200/70">Your Private AI Memory</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <SearchBar 
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search your memories..."
                />
                
                <div className="flex bg-white/5 rounded-xl p-1">
                  {[
                    { id: 'recent', icon: Sparkles, label: 'Recent' },
                    { id: 'timeline', icon: Timeline, label: 'Timeline' },
                    { id: 'insights', icon: Brain, label: 'Insights' }
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setActiveView(id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        activeView === id
                          ? 'bg-purple-500 text-white shadow-lg'
                          : 'text-purple-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Memory Input */}
            <div className="lg:col-span-2 space-y-6">
              <MemoryInput onAddMemory={addMemory} />
              
              {activeView === 'recent' && (
                <MemoryFeed 
                  memories={filteredMemories}
                  onDeleteMemory={deleteMemory}
                  searchQuery={searchQuery}
                />
              )}
              
              {activeView === 'timeline' && (
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Timeline className="w-5 h-5 mr-2 text-purple-400" />
                    Memory Timeline
                  </h3>
                  <div className="space-y-4">
                    {filteredMemories.map((memory, index) => (
                      <div key={memory.id} className="flex items-start space-x-4">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-white/90 text-sm leading-relaxed">{memory.content}</p>
                          <p className="text-purple-300/60 text-xs mt-1">
                            {new Date(memory.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeView === 'insights' && (
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    AI Insights
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                      <h4 className="font-semibold text-white mb-2">Memory Patterns</h4>
                      <p className="text-purple-200/80 text-sm">
                        You have logged {memories.length} memories. Your most active days are typically when you are learning something new or meeting people.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
                      <h4 className="font-semibold text-white mb-2">Emotional Trends</h4>
                      <p className="text-blue-200/80 text-sm">
                        Your recent memories show a balanced emotional state with peaks of excitement around new discoveries and connections.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                      <h4 className="font-semibold text-white mb-2">Growth Areas</h4>
                      <p className="text-green-200/80 text-sm">
                        Consider exploring the connections between your work insights and personal reflections - there might be interesting patterns there.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Insights Panel */}
            <div className="space-y-6">
              <InsightPanel memories={memories} />
              
              {/* Quick Stats */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Your Memory Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200/70 text-sm">Total Memories</span>
                    <span className="text-white font-semibold">{memories.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200/70 text-sm">This Week</span>
                    <span className="text-white font-semibold">
                      {memories.filter(m => {
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return new Date(m.timestamp) > weekAgo
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200/70 text-sm">Average per Day</span>
                    <span className="text-white font-semibold">
                      {memories.length > 0 ? (memories.length / Math.max(1, Math.ceil((Date.now() - new Date(memories[memories.length - 1]?.timestamp || Date.now()).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(1) : '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}