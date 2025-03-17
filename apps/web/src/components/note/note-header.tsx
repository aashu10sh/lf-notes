import { useState } from "react"

type NoteHeaderProps = {
  title: string
  setTitle: (title: string) => void
  categories: string[]
  lastUpdated: string
  created: string
}

export default function NoteHeader({ title, setTitle, categories, lastUpdated, created }: NoteHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  return (
    <div className="border-b border-zinc-800">
      {/* Title */}
      <div className="p-8 pb-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
            className="text-4xl font-bold bg-transparent border-none outline-none w-full"
            autoFocus
          />
        ) : (
          <h1 className="text-4xl font-bold cursor-pointer" onClick={() => setIsEditingTitle(true)}>
            {title}
          </h1>
        )}
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 border-t border-zinc-800">
        {/* Categories */}
        <div className="p-4 border-r border-zinc-800">
          <div className="text-sm font-medium mb-2">Categories</div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <span key={index} className="px-3 py-1 bg-red-900 rounded-full text-sm">
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="p-4">
          <div className="text-sm font-medium mb-2">Last Updated</div>
          <div>{lastUpdated}</div>
        </div>
      </div>

      {/* Created */}
      <div className="grid grid-cols-2 border-t border-zinc-800">
        <div className="p-4 border-r border-zinc-800">
          <div className="text-sm font-medium mb-2">Created</div>
          <div>{created}</div>
        </div>

        {/* Extra */}
        <div className="p-4">
          <div className="text-sm font-medium mb-2">Extra</div>
          <div className="text-sm text-zinc-400">This section will store JSON Data to add more columns like above</div>
        </div>
      </div>
    </div>
  )
}

