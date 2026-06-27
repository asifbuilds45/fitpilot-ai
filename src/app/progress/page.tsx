"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { TrendingUp, ArrowLeft, Plus, Loader2, Scale } from "lucide-react"
import { toast } from "sonner"

export default function ProgressPage() {
  const [weightLogs, setWeightLogs] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newWeight, setNewWeight] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }

    const { data: profileData } = await supabase
      .from("profiles").select("*").eq("id", user.id).single()
    setProfile(profileData)

    const { data: logs } = await supabase
      .from("weight_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
    setWeightLogs(logs || [])
    setIsLoading(false)
  }

  const logWeight = async () => {
    if (!newWeight) {
      toast.error("Please enter your weight!")
      return
    }
    setIsAdding(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const today = new Date().toISOString().split("T")[0]

      const { error } = await supabase.from("weight_logs").insert([{
        user_id: user!.id,
        weight: parseFloat(newWeight),
        date: today,
      }])

      if (error) throw error

      // Update current weight in profile
      await supabase
        .from("profiles")
        .update({ weight: parseFloat(newWeight) })
        .eq("id", user!.id)

      toast.success("Weight logged! 💪")
      setNewWeight("")
      getData()
    } catch (error) {
      toast.error("Failed to log weight")
    } finally {
      setIsAdding(false)
    }
  }

  const currentWeight = weightLogs[0]?.weight || profile?.weight || 0
  const startWeight = weightLogs[weightLogs.length - 1]?.weight || profile?.weight || 0
  const weightChange = currentWeight - startWeight
  const goalWeight = profile?.goal_weight || 0
  const progressPercent = goalWeight && startWeight
    ? Math.min(100, Math.abs((startWeight - currentWeight) / (startWeight - goalWeight) * 100))
    : 0

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">Progress</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{currentWeight} kg</p>
            <p className="text-sm text-slate-500">Current Weight</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className={`text-2xl font-bold ${weightChange < 0 ? "text-emerald-600" : "text-red-500"}`}>
              {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)} kg
            </p>
            <p className="text-sm text-slate-500">Total Change</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{goalWeight} kg</p>
            <p className="text-sm text-slate-500">Goal Weight</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-slate-900">Goal Progress</h2>
            <span className="text-sm text-emerald-600 font-medium">{progressPercent.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>Start: {startWeight} kg</span>
            <span>Goal: {goalWeight} kg</span>
          </div>
        </div>

        {/* Log Weight */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">Log Today's Weight</h2>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                placeholder="Enter weight in kg"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={logWeight}
              disabled={isAdding}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Log
            </button>
          </div>
        </div>

        {/* Weight History */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Weight History</h2>
          {weightLogs.length === 0 ? (
            <div className="text-center py-8">
              <Scale className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No weight logs yet!</p>
              <p className="text-sm text-slate-400">Start tracking your weight above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {weightLogs.map((log, idx) => (
                <div key={log.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-emerald-600" : "bg-slate-300"}`} />
                    <span className="text-sm text-slate-600">
                      {new Date(log.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">{log.weight} kg</span>
                    {idx < weightLogs.length - 1 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        log.weight < weightLogs[idx + 1].weight
                          ? "text-emerald-600 bg-emerald-100"
                          : "text-red-500 bg-red-100"
                      }`}>
                        {log.weight < weightLogs[idx + 1].weight ? "▼" : "▲"}
                        {Math.abs(log.weight - weightLogs[idx + 1].weight).toFixed(1)} kg
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}