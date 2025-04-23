'use server';

import { Redis } from '@upstash/redis';

import { StoryContext } from "@/types";

// Initialize Redis client
const redis = Redis.fromEnv();

// Prefix for all keys in the Redis store
const KEY_PREFIX = 'story:';

// TTL for session data (in seconds) - 7 days
const TTL_SECONDS = 60 * 60 * 24 * 7;

// Save session data to Redis
export async function setStoryContext(id: string, context: StoryContext): Promise<boolean> {
  try {
    // Store with expiration
    await redis.set(`${KEY_PREFIX}${id}`, context, { ex: TTL_SECONDS });
    console.log(`Saved context for ${id}`);
    return true;
  } catch (error) {
    console.error(`Error saving story context for ${id}:`, error);
    return false;
  }
}

// Get session data from Redis
export async function getStoryContext(id: string): Promise<StoryContext | undefined> {
  try {
    const data = await redis.get(`${KEY_PREFIX}${id}`);
    if (!data) {
      console.log(`No session found for ${id}`);
      return undefined;
    }
    return data as StoryContext;
  } catch (error) {
    console.error(`Error reading story context for ${id}:`, error);
    return undefined;
  }
}

// Update existing session data
export async function updateStoryContext(id: string, context: Partial<StoryContext>): Promise<boolean> {
  try {
    const currentContext = await getStoryContext(id);
    if (!currentContext) {
      console.error(`Cannot update context for ${id} - not found`);
      return false;
    }
    
    const updatedContext = { ...currentContext, ...context };
    return setStoryContext(id, updatedContext);
  } catch (error) {
    console.error(`Error updating story context for ${id}:`, error);
    return false;
  }
}

// Debug function to log current session data
export async function debugStoryContext(id: string): Promise<StoryContext | undefined> {
  const context = await getStoryContext(id);
  console.log('Current context for', id, ':', context);
  return context;
}

// List all active sessions (using Redis SCAN)
export async function listAllSessions(): Promise<string[]> {
  try {
    const keys: string[] = [];
    let cursor = '0'; // Redis SCAN cursor is a string in Upstash client
    
    do {
      // Scan in batches of 100
      const response: [string, string[]] = await redis.scan(cursor, {
        match: `${KEY_PREFIX}*`,
        count: 100
      });
      
      // Update cursor for next iteration
      cursor = response[0];
      
      // Add found keys to our array
      keys.push(...response[1]);
      
      // Break if we've scanned all keys (cursor returns to '0')
      if (cursor === '0') break;
    } while (true);
    
    // Remove the prefix to get just the IDs
    return keys.map(key => key.replace(KEY_PREFIX, ''));
  } catch (error) {
    console.error('Error listing sessions:', error);
    return [];
  }
}

// Delete a session
export async function deleteStoryContext(id: string): Promise<boolean> {
  try {
    await redis.del(`${KEY_PREFIX}${id}`);
    console.log(`Deleted session ${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting session ${id}:`, error);
    return false;
  }
}