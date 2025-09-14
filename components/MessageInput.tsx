'use client'

import { useState } from 'react'
import { ChatMessage } from '@/types'
import { sendMessage } from '@/lib/cosmic'

interface MessageInputProps {
  currentRoom: string
  onMessageSent: (message: ChatMessage) => void
}

export default function MessageInput({ currentRoom, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [author, setAuthor] = useState('Anonymous User')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || isLoading) return

    const messageContent = message.trim()
    setMessage('')
    setIsLoading(true)

    try {
      const newMessage = await sendMessage({
        content: messageContent,
        author: author,
        room: currentRoom
      })

      onMessageSent(newMessage)
    } catch (error) {
      console.error('Error sending message:', error)
      // Restore message on error
      setMessage(messageContent)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Author input */}
      <div className="flex items-center gap-2">
        <label htmlFor="author" className="text-sm font-medium text-foreground">
          Name:
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="px-3 py-1 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Your name"
        />
      </div>

      {/* Message input */}
      <div className="flex gap-3">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            className="chat-input resize-none min-h-[44px] max-h-32"
            style={{ 
              height: 'auto',
              minHeight: '44px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = Math.min(target.scrollHeight, 128) + 'px'
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              Sending...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send
            </div>
          )}
        </button>
      </div>
    </form>
  )
}