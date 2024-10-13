// BlinkingIndicator.tsx
export function BlinkingIndicator() {
  return (
    <div className="flex items-center space-x-1">
      <div className="dot bg-gray-400 w-2 h-2 rounded-full animate-blink" />
      <div className="dot bg-gray-400 w-2 h-2 rounded-full animate-blink delay-200" />
      <div className="dot bg-gray-400 w-2 h-2 rounded-full animate-blink delay-400" />
    </div>
  );
}
