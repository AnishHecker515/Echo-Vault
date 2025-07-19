import { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`relative transition-all duration-300 ${
      isFocused ? 'w-80' : 'w-64'
    }`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300/50" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/50 backdrop-blur-xl rounded-xl border border-white/10 p-4 z-50">
          <div className="text-xs text-purple-300/70 mb-2">Search tips:</div>
          <div className="space-y-1 text-xs text-purple-200/60">
            <div>• Search by content or emotions</div>
            <div>• Use tags like "work" or "personal"</div>
            <div>• Try "last week" or specific dates</div>
          </div>
        </div>
      )}
    </div>
  )
}