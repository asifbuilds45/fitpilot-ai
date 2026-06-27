"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { User, ArrowLeft, Loader2, Save } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    goal_weight: "",
    fitness_goal: "",
    activity_level: "",
    workout_experience: "",
    diet_type: "",
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      const { data } = await supabase
        .from("profiles").select("*").eq("id", user.id).single()

      if (data) {
        setProfile(data)
        setForm({
          name: data.name || "",
          age: data.age || "",
          height: data.height || "",
          weight: data.weight || "",
          goal_weight: data.goal_weight || "",
          fitness_goal: data.fitness_goal || "",
          activity_level: data.activity_level || "",
          workout_experience: data.workout_experience || "",
          diet_type: data.diet_type || "",
        })
      }
      setIsLoading(false)
    }
    getData()
  }, [])

  const saveProfile = async () => {
    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from("profiles")
        .update({
          name: form.name,
          age: parseInt(form.age),
          height: parseFloat(form.height),
          weight: parseFloat(form.weight),
          goal_weight: parseFloat(form.goal_weight),
          fitness_goal: form.fitness_goal,
          activity_level: form.activity_level,
          workout_experience: form.workout_experience,
          diet_type: form.diet_type,
        })
        .eq("id", user!.id)

      if (error) throw error
      toast.success("Profile updated! ✅")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              <h1 className="text-xl font-bold text-slate-900">Profile</h1>
            </div>
          </div>
          <button
            onClick={saveProfile}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Avatar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{profile?.name}</h2>
          <p className="text-slate-500">{profile?.email}</p>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Weight (kg)</label>
                <input
                  type="number"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Goal Weight (kg)</label>
                <input
                  type="number"
                  value={form.goal_weight}
                  onChange={(e) => setForm({ ...form, goal_weight: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fitness Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Fitness Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fitness Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "weight_loss", label: "Weight Loss" },
                  { value: "muscle_gain", label: "Muscle Gain" },
                  { value: "maintenance", label: "Maintenance" },
                ].map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => setForm({ ...form, fitness_goal: goal.value })}
                    className={`py-2 rounded-lg border text-sm font-medium transition ${
                      form.fitness_goal === goal.value
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-slate-300 text-slate-700 hover:border-emerald-400"
                    }`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Activity Level</label>
              <select
                value={form.activity_level}
                onChange={(e) => setForm({ ...form, activity_level: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="sedentary">Sedentary</option>
                <option value="lightly_active">Lightly Active</option>
                <option value="moderately_active">Moderately Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Experience</label>
              <select
                value={form.workout_experience}
                onChange={(e) => setForm({ ...form, workout_experience: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Diet Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "non_vegetarian", label: "Non-Veg" },
                  { value: "vegetarian", label: "Vegetarian" },
                  { value: "vegan", label: "Vegan" },
                ].map((diet) => (
                  <button
                    key={diet.value}
                    onClick={() => setForm({ ...form, diet_type: diet.value })}
                    className={`py-2 rounded-lg border text-sm font-medium transition ${
                      form.diet_type === diet.value
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-slate-300 text-slate-700 hover:border-emerald-400"
                    }`}
                  >
                    {diet.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push("/")
          }}
          className="w-full py-3 border border-red-300 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}