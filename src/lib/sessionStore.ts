'use server';

import fs from 'fs/promises';
import path from 'path';

import { StoryContext } from "@/types"

// Define the directory where session data will be stored
const SESSION_DIR = path.join(process.cwd(), 'sessions');

// Ensure the session directory exists
async function ensureSessionDir() {
  try {
    await fs.mkdir(SESSION_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating session directory:', error);
  }
}

// Save session data to a file
export async function setStoryContext(id: string, context: StoryContext): Promise<boolean> {
  try {
    await ensureSessionDir();
    const filePath = path.join(SESSION_DIR, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(context, null, 2));
    console.log(`Saved context for ${id}`);
    return true;
  } catch (error) {
    console.error(`Error saving story context for ${id}:`, error);
    return false;
  }
}

// Get session data from a file
export async function getStoryContext(id: string): Promise<StoryContext | undefined> {
  try {
    const filePath = path.join(SESSION_DIR, `${id}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as StoryContext;
  } catch (error) {
    // If file not found, return undefined (similar to cookie not found)
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log(`No session found for ${id}`);
      return undefined;
    }
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

// List all active sessions
export async function listAllSessions(): Promise<string[]> {
  try {
    await ensureSessionDir();
    const files = await fs.readdir(SESSION_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error listing sessions:', error);
    return [];
  }
}