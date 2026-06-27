"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Activity, Flame, Droplets, Dumbbell, TrendingUp, Brain, LogOut, User } from "lucide-react"

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      setProfile(data)
      setIsLoading(false)
    }
    getProfile()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 text-emerald-600 animate-pulse mx-auto mb-2" />
          <p className="text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const bmi = profile?.height && profile?.weight
    ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1)
    : "N/A"

  const goalLabel: any = {
    weight_loss: "Weight Loss",
    muscle_gain: "Muscle Gain",
    maintenance: "Maintenance",
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            <span className="text-xl font-bold text-slate-900">FitPilot AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 text-sm">
              👋 Hey, {profile?.name || "there"}!
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Good morning, {profile?.name?.split(" ")[0] || "there"}! 💪
          </h1>
          <p className="text-slate-500 mt-1">
            Here's your fitness overview for today
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm text-slate-500">Current Weight</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{profile?.weight || "--"} <span className="text-sm font-normal text-slate-500">kg</span></p>
            <p className="text-xs text-slate-400 mt-1">Goal: {profile?.goal_weight || "--"} kg</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-sm text-slate-500">Calories Today</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">0 <span className="text-sm font-normal text-slate-500">kcal</span></p>
            <p className="text-xs text-slate-400 mt-1">Log your meals</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Droplets className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-sm text-slate-500">Water Intake</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">0 <span className="text-sm font-normal text-slate-500">L</span></p>
            <p className="text-xs text-slate-400 mt-1">Target: 2.5L</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-sm text-slate-500">Workout Streak</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">0 <span className="text-sm font-normal text-slate-500">days</span></p>
            <p className="text-xs text-slate-400 mt-1">Keep it up!</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-emerald-600" />
              <h2 className="font-semibold text-slate-900">Your Profile</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Goal", value: goalLabel[profile?.fitness_goal] || "--" },
                { label: "BMI", value: bmi },
                { label: "Height", value: profile?.height ? `${profile.height} cm` : "--" },
                { label: "Diet", value: profile?.diet_type?.replace("_", " ") || "--" },
                { label: "Experience", value: profile?.workout_experience || "--" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="text-sm font-medium text-slate-900 capitalize">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Coach Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5" />
              <h2 className="font-semibold">AI Coach</h2>
            </div>
            <p className="text-emerald-100 text-sm mb-6">
              Chat with your personal AI fitness coach for workout tips, nutrition advice, and motivation!
            </p>
            <button
              onClick={() => router.push("/ai-coach")}
              className="w-full bg-white text-emerald-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-50 transition"
            >
              Chat with AI Coach →
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { label: "Log Workout", icon: Dumbbell, color: "text-purple-500 bg-purple-100", path: "/workouts" },
                { label: "Log Meal", icon: Flame, color: "text-orange-500 bg-orange-100", path: "/nutrition" },
                { label: "Track Progress", icon: TrendingUp, color: "text-emerald-600 bg-emerald-100", path: "/progress" },
                { label: "AI Coach Chat", icon: Brain, color: "text-blue-500 bg-blue-100", path: "/ai-coach" },
              ].map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => router.push(action.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition text-left"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color}`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Plan */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Today's Plan</h2>
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-emerald-600 opacity-20 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">No plan generated yet</p>
            <button
              onClick={() => router.push("/ai-coach")}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
            >
              Generate AI Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}