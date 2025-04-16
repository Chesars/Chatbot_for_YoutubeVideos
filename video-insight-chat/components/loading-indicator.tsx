export default function LoadingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600">
        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          />
          <path
            fill="currentColor"
            d="M12 6c-3.31 0-6 2.69-6 6h2c0-2.21 1.79-4 4-4s4 1.79 4 4h2c0-3.31-2.69-6-6-6z"
            className="opacity-75 animate-spin origin-center"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        </svg>
      </div>

      <div className="flex flex-col max-w-[75%]">
        <div className="bg-white border border-gray-200 shadow-md rounded-2xl rounded-tl-none p-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: "300ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: "600ms" }}></div>
          </div>
        </div>
        <span className="text-xs text-gray-500 mt-1 ml-2">Processing your request...</span>
      </div>
    </div>
  )
}
