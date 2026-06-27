export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">FitPilot AI</h1>
          <p className="text-slate-500">Your AI-Powered Fitness Coach</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {children}
        </div>

        {/* Back home */}
        <p className="text-center text-slate-500 text-sm mt-6">
          <a href="/" className="hover:text-emerald-600 transition">← Back to home</a>
        </p>
      </div>
    </div>
  )
}