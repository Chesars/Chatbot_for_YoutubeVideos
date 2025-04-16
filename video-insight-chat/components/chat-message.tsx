import { cn } from "@/lib/utils"
import { User, Bot, Youtube } from "lucide-react"
import { format } from "date-fns"

type MessageProps = {
  message: {
    content: string
    role: "user" | "assistant"
    timestamp: Date
  }
}

// Add this function to detect YouTube links
const isYoutubeLink = (text: string) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
  return youtubeRegex.test(text)
}

// Add this function to format YouTube links
const formatMessageContent = (content: string) => {
  if (isYoutubeLink(content)) {
    return (
      <div className="flex items-center">
        <Youtube className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="break-all">{content}</span>
      </div>
    )
  }
  return <p className="whitespace-pre-wrap">{content}</p>
}

export default function ChatMessage({ message }: MessageProps) {
  const isUser = message.role === "user"
  const formattedTime = format(new Date(message.timestamp), "h:mm a")

  return (
    <div className={cn("flex items-start gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-gradient-to-r from-purple-600 to-pink-600",
        )}
      >
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </div>

      <div className="flex flex-col max-w-[75%]">
        <div
          className={cn(
            "rounded-2xl p-4",
            isUser
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-md"
              : "bg-white border border-gray-200 shadow-md text-gray-800 rounded-tl-none",
          )}
        >
          {formatMessageContent(message.content)}
        </div>
        <span className={cn("text-xs text-gray-500 mt-1", isUser ? "text-right mr-2" : "ml-2")}>{formattedTime}</span>
      </div>
    </div>
  )
}
