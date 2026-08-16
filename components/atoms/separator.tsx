export default function Separator() {
  return (
    <div className="flex justify-center items-center">
      
      <div className="relative w-full">
        
        {/* Line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-white/10 via-yellow-500 to-white/10 blur-[0.5px]" />

        {/* Marker */}

        {/* Circle */}
        <div className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-yellow-500 rounded-full left-[30%]" />

        <div className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-yellow-500 rounded-full left-[35%]" />

        <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-500 rounded-full left-[40%]" />

        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full left-[45%]" />

        {/* Diamond */}
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-500 rotate-45 left-[50%]" />

        {/* Circle */}
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full left-[55%]" />

        <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-500 rounded-full left-[60%]" />

        <div className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-yellow-500 rounded-full left-[65%]" />

        <div className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-yellow-500 rounded-full left-[70%]" />

      </div>
    </div>
  )
}