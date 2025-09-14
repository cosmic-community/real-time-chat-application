import { ChatMessage } from '@/types'

interface MessageBubbleProps {
  message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  if (!message) {
    return null
  }

  const content = message.metadata?.content
  const author = message.metadata?.author
  const avatarUrl = message.metadata?.avatar_url
  const timestamp = new Date(message.created_at).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  // Simple logic to determine if message is from current user
  // In a real app, you'd compare with actual current user
  const isCurrentUser = author === 'You' || author === 'Current User'

  return (
    <div className={`flex items-start gap-3 animate-fade-in ${
      isCurrentUser ? 'flex-row-reverse' : 'flex-row'
    }`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={author || 'User'}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center border border-border">
            <span className="text-secondary-foreground font-medium text-sm">
              {author ? author.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
        )}
      </div>

      {/* Message content */}
      <div className={`flex flex-col max-w-xs lg:max-w-md ${
        isCurrentUser ? 'items-end' : 'items-start'
      }`}>
        {/* Author and timestamp */}
        <div className={`flex items-center gap-2 mb-1 ${
          isCurrentUser ? 'flex-row-reverse' : 'flex-row'
        }`}>
          <span className="text-sm font-medium text-foreground">
            {author || 'Anonymous'}
          </span>
          <span className="text-xs text-muted-foreground">
            {timestamp}
          </span>
        </div>

        {/* Message bubble */}
        <div className={`message-bubble animate-slide-up ${
          isCurrentUser ? 'message-sent' : 'message-received'
        }`}>
          <p className="text-sm leading-relaxed">
            {content || 'No content'}
          </p>
        </div>

        {/* Message status indicator */}
        {isCurrentUser && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-muted-foreground">
              {message.metadata?.status === 'sent' && '✓'}
              {message.metadata?.status === 'delivered' && '✓✓'}
              {message.metadata?.status === 'read' && (
                <span className="text-primary">✓✓</span>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}