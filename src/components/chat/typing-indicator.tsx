export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="glass-soft flex items-center gap-1.5 rounded-[22px] rounded-bl-md px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot h-1.5 w-1.5 rounded-full bg-mist"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
