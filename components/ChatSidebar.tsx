import { ChatRoom } from '@/types'

interface ChatSidebarProps {
  chatRooms: ChatRoom[]
}

export default function ChatSidebar({ chatRooms }: ChatSidebarProps) {
  return (
    <div className="w-64 bg-secondary border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Chat Rooms
        </h2>
        <p className="text-sm text-muted-foreground">
          Select a room to join
        </p>
      </div>

      {/* Rooms list */}
      <div className="flex-1 overflow-y-auto">
        {chatRooms && chatRooms.length > 0 ? (
          <div className="p-2 space-y-1">
            {chatRooms.map((room) => (
              <button
                key={room.id}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:bg-accent focus:text-accent-foreground transition-colors"
              >
                <div className="font-medium text-sm text-foreground">
                  # {room.metadata?.name || room.title}
                </div>
                {room.metadata?.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {room.metadata.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <div className="text-center text-muted-foreground">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h2V6a2 2 0 012-2h2a2 2 0 012 2v2z" />
              </svg>
              <p className="text-sm">No chat rooms available</p>
            </div>
          </div>
        )}

        {/* Default General Room */}
        <div className="p-2 border-t border-border">
          <div className="px-3 py-2 bg-primary/10 rounded-md border border-primary/20">
            <div className="font-medium text-sm text-foreground">
              # General
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Main chat room (Active)
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-medium">
              U
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">
              User
            </div>
            <div className="text-xs text-muted-foreground">
              Online
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}