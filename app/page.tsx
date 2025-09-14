import { getMessages, getChatRooms } from '@/lib/cosmic'
import ChatContainer from '@/components/ChatContainer'
import ChatSidebar from '@/components/ChatSidebar'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  try {
    // Fetch initial data
    const [messages, chatRooms] = await Promise.all([
      getMessages('general'),
      getChatRooms()
    ])

    return (
      <div className="flex h-screen">
        <ChatSidebar chatRooms={chatRooms} />
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-border p-4">
            <h1 className="text-xl font-semibold text-foreground">
              General Chat
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time messaging powered by Cosmic CMS
            </p>
          </header>
          <ChatContainer initialMessages={messages} currentRoom="general" />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading chat data:', error)
    
    return (
      <div className="flex h-screen">
        <ChatSidebar chatRooms={[]} />
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-border p-4">
            <h1 className="text-xl font-semibold text-foreground">
              General Chat
            </h1>
            <p className="text-sm text-red-500">
              Unable to load chat data. Please check your connection.
            </p>
          </header>
          <ChatContainer initialMessages={[]} currentRoom="general" />
        </div>
      </div>
    )
  }
}