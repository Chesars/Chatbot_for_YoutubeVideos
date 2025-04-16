import { CheckCircle, XCircle } from "lucide-react"

type ApiStatusProps = {
  isConnected: boolean
}

export default function ApiStatus({ isConnected }: ApiStatusProps) {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium">
      {isConnected ? (
        <>
          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
          <span className="text-green-600">API Connected (127.0.0.1:8000)</span>
        </>
      ) : (
        <>
          <XCircle className="h-3.5 w-3.5 text-red-500" />
          <span className="text-red-600">API Disconnected (127.0.0.1:8000)</span>
        </>
      )}
    </div>
  )
}
