'use client'

import { useState, useEffect, useRef } from 'react'
import { ChatMessage } from '@/types'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import { getMessages } from '@/lib/cosmic'

interface ChatContainerProps {
  initialMessages: ChatMessage[]
  currentRoom: string
}

export default function ChatContainer({ initialMessages, currentRoom }: ChatContainerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Refresh messages periodically for real-time effect
  useEffect(() => {
    const refreshMessages = async () => {
      if (isLoading) return
      
      try {
        setIsLoading(true)
        const latestMessages = await getMessages(currentRoom)
        
        // Only update if there are new messages
        if (latestMessages.length !== messages.length) {
          setMessages(latestMessages)
        }
      } catch (error) {
        console.error('Error refreshing messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Refresh every 3 seconds for real-time effect
    const interval = setInterval(refreshMessages, 3000)
    
    return () => clearInterval(interval)
  }, [currentRoom, messages.length, isLoading])

  // Handle new message sent
  const handleMessageSent = (newMessage: ChatMessage) => {
    setMessages(prev => [...prev, newMessage])
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-muted-foreground mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No messages yet
            </h3>
            <p className="text-muted-foreground">
              Start the conversation by sending the first message!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center py-2">
                <div className="text-muted-foreground text-sm">
                  Loading new messages...
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t border-border bg-white p-4">
        <MessageInput 
          currentRoom={currentRoom}
          onMessageSent={handleMessageSent}
        />
      </div>
    </div>
  )
}