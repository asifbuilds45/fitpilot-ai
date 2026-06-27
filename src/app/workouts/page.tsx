"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Dumbbell, ArrowLeft, Plus, Loader2, CheckCircle, Clock, Zap } from "lucide-react"
import { toast } from "sonner"

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      const { data: profileData } = await supabase
        .from("profiles").select("*").eq("id", user.id).single()
      setProfile(profileData)

      const { data: workoutData } = await supabase
        .from("workouts").select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false })
      setWorkouts(workoutData || [])
      setIsLoading(false)
    }
    getData()
  }, [])

  const generateWorkoutPlan = async () => {
    if (!profile?.fitness_goal) {
      toast.error("Please complete onboarding first!")
      return
    }
    setIsGenerating(true)
    try {
      const prompt = `Create 5 workout sessions for someone with:
        - Goal: ${profile.fitness_goal}
        - Experience: ${profile.workout_experience}
        - Activity Level: ${profile.activity_level}
        
        Return ONLY a JSON array, no extra text:
        [
          {
            "title": "Upper Body Strength",
            "description": "Chest, shoulders, triceps focus with compound movements",
            "duration": 45,
            "difficulty": "medium"
          }
        ]`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      )

      const data = await response.json()
      console.log("Gemini response:", data)

      if (!data.candidates || !data.candidates[0]) {
        throw new Error("No response from Gemini")
      }

      const text = data.candidates[0].content.parts[0].text
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error("Invalid JSON response")

      const plans = JSON.parse(jsonMatch[0])
      const { data: { user } } = await supabase.auth.getUser()

      for (const plan of plans) {
        await supabase.from("workouts").insert([{
          user_id: user!.id,
          title: plan.title,
          description: plan.description,
          duration: plan.duration,
          difficulty: plan.difficulty,
          status: "pending",
        }])
      }

      const { data: newWorkouts } = await supabase
        .from("workouts").select("*").eq("user_id", user!.id)
        .order("created_at", { ascending: false })
      setWorkouts(newWorkouts || [])
      toast.success("Workout plan generated! 💪")
    } catch (error) {
      console.error("Workout generation error:", error)
      toast.error("Failed to generate workout plan")
    } finally {
      setIsGenerating(false)
    }
  }

  const markComplete = async (id: string) => {
    await supabase.from("workouts").update({ status: "completed" }).eq("id", id)
    setWorkouts((prev) => prev.map((w) => w.id === id ? { ...w, status: "completed" } : w))
    toast.success("Workout completed! 🎉")
  }

  const difficultyColor: any = {
    easy: "text-green-600 bg-green-100",
    medium: "text-orange-600 bg-orange-100",
    hard: "text-red-600 bg-red-100",
  }

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-emerald-600" />
              <h1 className="text-xl font-bold text-slate-900">Workouts</h1>
            </div>
          </div>
          <button
            onClick={generateWorkoutPlan}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isGenerating ? "Generating..." : "AI Generate Plan"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{workouts.length}</p>
            <p className="text-sm text-slate-500">Total Workouts</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {workouts.filter((w) => w.status === "completed").length}
            </p>
            <p className="text-sm text-slate-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">
              {workouts.filter((w) => w.status === "pending").length}
            </p>
            <p className="text-sm text-slate-500">Pending</p>
          </div>
        </div>

        {workouts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Dumbbell className="w-12 h-12 text-emerald-600 opacity-20 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No workouts yet!</p>
            <button
              onClick={generateWorkoutPlan}
              disabled={isGenerating}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
            >
              Generate AI Workout Plan
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div key={workout.id} className={`bg-white rounded-xl border p-6 transition ${
                workout.status === "completed" ? "border-emerald-200 opacity-75" : "border-slate-200"
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{workout.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${difficultyColor[workout.difficulty] || "text-slate-600 bg-slate-100"}`}>
                        {workout.difficulty}
                      </span>
                      {workout.status === "completed" && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium text-emerald-600 bg-emerald-100">
                          ✓ Done
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{workout.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {workout.duration} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" /> {workout.difficulty}
                      </span>
                    </div>
                  </div>
                  {workout.status !== "completed" && (
                    <button
                      onClick={() => markComplete(workout.id)}
                      className="ml-4 flex items-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}