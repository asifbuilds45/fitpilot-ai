import Link from "next/link"
import { ArrowRight, Activity, Brain, TrendingUp, MessageSquare, Zap, Award } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            FitPilot AI
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-slate-600 hover:text-slate-900 transition">
              Sign In
            </Link>
            <Link href="/signup" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Your AI-Powered <span className="text-emerald-600">Fitness Coach</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Get personalized workout plans, AI nutrition coaching, and real-time guidance. Your personal trainer and nutritionist in one app.
        </p>
        <div className="flex gap-4 justify-center mb-16">
          <Link href="/signup" className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center gap-2">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="px-8 py-4 border border-slate-300 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition">
            Watch Demo
          </button>
        </div>

        {/* Hero Card */}
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-slate-50 h-96 flex items-center justify-center border border-slate-100 shadow-sm">
          <div className="text-center">
            <Activity className="w-16 h-16 text-emerald-600 mx-auto mb-4 opacity-30" />
            <p className="text-slate-400 text-lg">Dashboard Preview</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-slate-600">Advanced AI features designed for your success</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border border-slate-200 hover:border-emerald-200 hover:shadow-md transition">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">Loved by Fitness Enthusiasts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border border-slate-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-emerald-500">★</span>)}
                </div>
                <p className="text-slate-700 mb-4 italic">"{t.text}"</p>
                <p className="font-semibold text-slate-900">{t.author}</p>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-emerald-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Fitness?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands achieving their goals with AI coaching</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-slate-50 transition">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p>© 2024 FitPilot AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

const features = [
  { icon: TrendingUp, title: "Personalized Workouts", description: "AI-generated plans tailored to your goals" },
  { icon: MessageSquare, title: "AI Nutrition Coach", description: "Meal plans customized to your preferences" },
  { icon: Brain, title: "Form Correction", description: "Upload videos for AI-powered analysis" },
  { icon: Activity, title: "Progress Tracking", description: "Track weight, workouts and nutrition" },
  { icon: Zap, title: "Real-Time Coaching", description: "Chat with your AI coach anytime" },
  { icon: Award, title: "Weekly Reports", description: "AI-generated progress summaries" },
]

const testimonials = [
  { text: "FitPilot AI transformed my fitness journey. The personalized plans actually work!", author: "Sarah", role: "Fitness Enthusiast" },
  { text: "Best investment for my health. The AI coach understands my goals perfectly.", author: "Mike", role: "Busy Professional" },
  { text: "Lost 10kg in 3 months with structured guidance. Highly recommend!", author: "Emma", role: "Fitness Coach" },
]