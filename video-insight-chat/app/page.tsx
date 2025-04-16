"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Youtube } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import LoadingIndicator from "@/components/loading-indicator"
import { motion, AnimatePresence } from "framer-motion"
import ApiStatus from "@/components/api-status"

type MessageType = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [apiConnected, setApiConnected] = useState(false)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Update the API endpoint URL
  // Replace the API connection check in useEffect
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/chat/", {
          method: "HEAD",
        })
        setApiConnected(response.ok)
      } catch (err) {
        console.error("API connection check failed:", err)
        setApiConnected(false)
      }
    }

    checkApiConnection()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Update the handleSubmit function to use the full API URL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message to chat
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://127.0.0.1:8000/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()

      // Add assistant message to chat
      const assistantMessage: MessageType = {
        id: Date.now().toString(),
        content: data.reply.content,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error(err)
      setError("Failed to get a response. Please try again.")
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const isValidYoutubeLink = (text: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
    return youtubeRegex.test(text)
  }

  const isYoutubeLink = (text: string) => {
    return isValidYoutubeLink(text)
  }

  return (
    <main className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-md backdrop-blur-sm bg-white/90 sticky top-0 z-10 relative">
        <div className="max-w-3xl mx-auto flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <Youtube className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Video Insight
            </h1>
          </div>
        </div>
{/* <ApiStatus isConnected={apiConnected} /> */}      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-3xl mx-auto w-full">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center my-12">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md mx-auto">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Youtube className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Video Insight</h2>
                  <p className="text-gray-600 mb-4">Get AI-powered analysis of YouTube videos in two simple steps:</p>
                  <ol className="text-left text-gray-600 space-y-2 pl-5 list-decimal">
                    <li>Paste a YouTube link to extract the video transcript</li>
                    <li>Ask questions about the video content</li>
                  </ol>
                </div>
              </motion.div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatMessage message={message} />
                </motion.div>
              ))
            )}

            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <LoadingIndicator />
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 text-red-700 rounded-lg text-center border border-red-100 shadow-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4 md:p-6 max-w-3xl mx-auto w-full shadow-lg">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a YouTube link or ask a question..."
              className="w-full p-4 pl-5 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
              disabled={isLoading}
            />
            {input && isYoutubeLink(input) && (
              <div className="absolute -bottom-6 left-4 text-xs text-green-600 flex items-center">
                <Youtube className="h-3 w-3 mr-1" /> Valid YouTube link detected
              </div>
            )}
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !input.trim()}
          >
            <Send size={18} />
          </motion.button>
        </form>
      </div>
    </main>
  )
}
