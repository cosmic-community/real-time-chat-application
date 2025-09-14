// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Chat message interface
export interface ChatMessage extends CosmicObject {
  type: 'messages';
  metadata: {
    content: string;
    author: string;
    room?: string;
    status?: MessageStatus;
    avatar_url?: string;
    timestamp?: string;
  };
}

// User interface
export interface User extends CosmicObject {
  type: 'users';
  metadata: {
    name: string;
    email?: string;
    avatar?: {
      url: string;
      imgix_url: string;
    };
    status?: UserStatus;
    last_seen?: string;
  };
}

// Chat room interface
export interface ChatRoom extends CosmicObject {
  type: 'rooms';
  metadata: {
    name: string;
    description?: string;
    members?: User[];
    is_private?: boolean;
    created_by?: User;
  };
}

// Type literals for select-dropdown values
export type MessageStatus = 'sent' | 'delivered' | 'read';
export type UserStatus = 'online' | 'offline' | 'away';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Form data types
export interface SendMessageFormData {
  content: string;
  author: string;
  room?: string;
}

export interface CreateUserFormData {
  name: string;
  email?: string;
  avatar_url?: string;
}

// Type guards for runtime validation
export function isChatMessage(obj: CosmicObject): obj is ChatMessage {
  return obj.type === 'messages';
}

export function isUser(obj: CosmicObject): obj is User {
  return obj.type === 'users';
}

export function isChatRoom(obj: CosmicObject): obj is ChatRoom {
  return obj.type === 'rooms';
}

// Utility types
export type OptionalMetadata<T> = Partial<T['metadata']>;
export type CreateMessageData = Omit<ChatMessage, 'id' | 'created_at' | 'modified_at'>;