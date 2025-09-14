# Real-Time Chat Application

![Chat App Preview](https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1200&h=300&fit=crop&auto=format)

A modern real-time chat application built with Next.js and Cosmic CMS. Features instant messaging, message history, and user management with a clean, responsive interface.

## ✨ Features

- 💬 Real-time messaging with instant updates
- 📱 Fully responsive design for mobile and desktop
- 👥 User profiles with avatars and names
- 📝 Message history stored in Cosmic CMS
- ⏰ Message timestamps and status indicators
- 🎨 Modern UI with smooth animations
- 🔄 Auto-refresh for real-time experience
- 📊 Message management through Cosmic dashboard

## Clone this Project

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68c7365bfe0840663f64f40f&clone_repository=68c7386cfe0840663f64f416)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a chatbox"

### Code Generation Prompt

> "Chatbox"

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠 Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic CMS** - Headless CMS for content management
- **React** - UI component library
- **Modern CSS** - Advanced styling with custom properties

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket

### Installation

1. Clone this repository
2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📡 Cosmic SDK Examples

### Fetch Messages
```typescript
import { cosmic } from '@/lib/cosmic'

export async function getMessages() {
  try {
    const response = await cosmic.objects
      .find({ type: 'messages' })
      .props(['id', 'title', 'metadata', 'created_at'])
      .depth(1)
    
    return response.objects.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    throw error
  }
}
```

### Send New Message
```typescript
export async function sendMessage(messageData: {
  content: string
  author: string
  room?: string
}) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'messages',
      title: `Message from ${messageData.author}`,
      metadata: {
        content: messageData.content,
        author: messageData.author,
        room: messageData.room || 'general',
        status: 'sent'
      }
    })
    
    return response.object
  } catch (error) {
    throw new Error('Failed to send message')
  }
}
```

## 🎨 Cosmic CMS Integration

This application uses Cosmic CMS to manage:

- **Messages**: Chat messages with content, author, timestamps
- **Users**: User profiles with names and avatars  
- **Rooms**: Different chat rooms or channels
- **Message Status**: Read receipts and delivery status

The chat interface automatically syncs with your Cosmic dashboard, allowing you to moderate messages and manage users directly from the CMS.

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on git push

### Netlify
1. Connect your repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `out` (if using static export)
4. Add environment variables in Netlify dashboard

### Other Platforms
This Next.js application can be deployed on any platform that supports Node.js applications.

---

Built with [Cosmic](https://www.cosmicjs.com/docs) - The headless CMS for modern applications.
<!-- README_END -->