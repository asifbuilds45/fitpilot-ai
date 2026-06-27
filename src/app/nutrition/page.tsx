"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Flame, ArrowLeft, Plus, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function NutritionPage() {
  const [meals, setMeals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState({
    meal_name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    getMeals()
  }, [])

  const getMeals = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }

    const today = new Date().toISOString().split("T")[0]
    const { data } = await supabase
      .from("meal_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("meal_date", today)
      .order("created_at", { ascending: false })

    setMeals(data || [])
    setIsLoading(false)
  }

  const addMeal = async () => {
    if (!form.meal_name || !form.calories) {
      toast.error("Please fill meal name and calories!")
      return
    }
    setIsAdding(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const today = new Date().toISOString().split("T")[0]

      const { error } = await supabase.from("meal_logs").insert([{
        user_id: user!.id,
        meal_name: form.meal_name,
        calories: parseFloat(form.calories) || 0,
        protein: parseFloat(form.protein) || 0,
        carbs: parseFloat(form.carbs) || 0,
        fats: parseFloat(form.fats) || 0,
        meal_date: today,
      }])

      if (error) throw error

      toast.success("Meal logged! 🍽️")
      setForm({ meal_name: "", calories: "", protein: "", carbs: "", fats: "" })
      setShowForm(false)
      getMeals()
    } catch (error) {
      toast.error("Failed to log meal")
    } finally {
      setIsAdding(false)
    }
  }

  const deleteMeal = async (id: string) => {
    await supabase.from("meal_logs").delete().eq("id", id)
    setMeals((prev) => prev.filter((m) => m.id !== id))
    toast.success("Meal deleted!")
  }

  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0)
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein || 0), 0)
  const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0)
  const totalFats = meals.reduce((sum, m) => sum + (m.fats || 0), 0)

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h1 className="text-xl font-bold text-slate-900">Nutrition</h1>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
          >
            <Plus className="w-4 h-4" />
            Log Meal
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Today's Macros */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{totalCalories}</p>
            <p className="text-sm text-slate-500">Calories</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{totalProtein}g</p>
            <p className="text-sm text-slate-500">Protein</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">{totalCarbs}g</p>
            <p className="text-sm text-slate-500">Carbs</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{totalFats}g</p>
            <p className="text-sm text-slate-500">Fats</p>
          </div>
        </div>

        {/* Add Meal Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h2 className="font-semibold text-slate-900 mb-4">Log New Meal</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Meal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chicken Rice Bowl"
                  value={form.meal_name}
                  onChange={(e) => setForm({ ...form, meal_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Calories</label>
                <input
                  type="number"
                  placeholder="450"
                  value={form.calories}
                  onChange={(e) => setForm({ ...form, calories: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Protein (g)</label>
                <input
                  type="number"
                  placeholder="35"
                  value={form.protein}
                  onChange={(e) => setForm({ ...form, protein: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  placeholder="50"
                  value={form.carbs}
                  onChange={(e) => setForm({ ...form, carbs: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fats (g)</label>
                <input
                  type="number"
                  placeholder="15"
                  value={form.fats}
                  onChange={(e) => setForm({ ...form, fats: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={addMeal}
                disabled={isAdding}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isAdding ? "Saving..." : "Save Meal"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Meal List */}
        {meals.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Flame className="w-12 h-12 text-orange-500 opacity-20 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No meals logged today!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
            >
              Log Your First Meal
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="font-semibold text-slate-900">Today's Meals</h2>
            {meals.map((meal) => (
              <div key={meal.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">{meal.meal_name}</h3>
                    <div className="flex gap-3 mt-1 text-xs text-slate-500">
                      <span>🔥 {meal.calories} kcal</span>
                      <span>💪 {meal.protein}g protein</span>
                      <span>🌾 {meal.carbs}g carbs</span>
                      <span>🧈 {meal.fats}g fats</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}