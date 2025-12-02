'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            SQL Agent
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            This is a SQL agent. Your data is saved in a cloud SQLite database. 
            Simply ask questions in natural language, and it will automatically generate 
            SQL queries and fetch data from the cloud database.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-[calc(100vh-250px)] md:h-[calc(100vh-200px)] flex flex-col">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>No messages yet. Start by asking a question about your data.</p>
                <p className="text-sm mt-2">Example: Show me all users from last months</p>
              </div>
            ) : (
              messages.map(message => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                  }`}>
                    <div className="font-medium text-sm mb-1">
                      {message.role === 'user' ? 'You' : 'SQL Agent'}
                    </div>
                    <div className="whitespace-pre-wrap">
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'text':
                            return <div key={`${message.id}-${i}`}>{part.text}</div>;
                          case 'tool-db':
                            return (
                              <div key={`${message.id}-${i}`} className="mt-2">
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Database Result:
                                </div>
                                <pre className="p-2 bg-black/10 dark:bg-white/10 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(part, null, 2)}
                                </pre>
                              </div>
                            );
                          case 'tool-schema':
                            return (
                              <div key={`${message.id}-${i}`} className="mt-2">
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Schema Information:
                                </div>
                                <pre className="p-2 bg-black/10 dark:bg-white/10 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(part, null, 2)}
                                </pre>
                              </div>
                            );
                        }
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <form
              onSubmit={e => {
                e.preventDefault();
                sendMessage({ text: input });
                setInput('');
              }}
            >
              <div className="flex gap-2">
                <input
                  className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={input}
                  placeholder="Ask about your data..."
                  onChange={e => setInput(e.currentTarget.value)}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Ask questions in natural language. The agent will generate SQL queries automatically.
              </p>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}