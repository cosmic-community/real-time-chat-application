import { createBucketClient } from '@cosmicjs/sdk'
import { ChatMessage, User, ChatRoom, SendMessageFormData, CreateUserFormData } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all messages for a chat room
export async function getMessages(room: string = 'general'): Promise<ChatMessage[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'messages',
        'metadata.room': room
      })
      .props(['id', 'title', 'metadata', 'created_at'])
      .depth(1);
    
    // Manual sorting by creation date (oldest first for chat)
    return (response.objects as ChatMessage[]).sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateA - dateB; // Ascending order for chat
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch messages');
  }
}

// Send a new message
export async function sendMessage(messageData: SendMessageFormData): Promise<ChatMessage> {
  // Validate required fields
  if (!messageData.content.trim() || !messageData.author.trim()) {
    throw new Error('Content and author are required');
  }

  try {
    const response = await cosmic.objects.insertOne({
      type: 'messages',
      title: `Message from ${messageData.author}`,
      metadata: {
        content: messageData.content.trim(),
        author: messageData.author.trim(),
        room: messageData.room || 'general',
        status: 'sent'
      }
    });
    
    return response.object as ChatMessage;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
}

// Get all users
export async function getUsers(): Promise<User[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'users' })
      .props(['id', 'title', 'metadata'])
      .depth(1);
    
    return response.objects as User[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch users');
  }
}

// Create a new user
export async function createUser(userData: CreateUserFormData): Promise<User> {
  // Validate required fields
  if (!userData.name.trim()) {
    throw new Error('Name is required');
  }

  try {
    const response = await cosmic.objects.insertOne({
      type: 'users',
      title: userData.name,
      metadata: {
        name: userData.name.trim(),
        email: userData.email || '',
        avatar_url: userData.avatar_url || '',
        status: 'online'
      }
    });
    
    return response.object as User;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

// Get all chat rooms
export async function getChatRooms(): Promise<ChatRoom[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'rooms' })
      .props(['id', 'title', 'metadata'])
      .depth(1);
    
    return response.objects as ChatRoom[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch chat rooms');
  }
}

// Update message status (for read receipts)
export async function updateMessageStatus(messageId: string, status: 'sent' | 'delivered' | 'read'): Promise<ChatMessage> {
  try {
    const response = await cosmic.objects.updateOne(messageId, {
      metadata: {
        status: status
      }
    });
    
    return response.object as ChatMessage;
  } catch (error) {
    console.error('Error updating message status:', error);
    throw new Error('Failed to update message status');
  }
}