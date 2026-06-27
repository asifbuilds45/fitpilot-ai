"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react"

const steps = ["Basic Info", "Body Stats", "Fitness Goals", "Diet & Experience"]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal_weight: "",
    fitness_goal: "",
    activity_level: "",
    workout_experience: "",
    diet_type: "",
  })

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          age: parseInt(formData.age),
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          goal_weight: parseFloat(formData.goal_weight),
          fitness_goal: formData.fitness_goal,
          activity_level: formData.activity_level,
          workout_experience: formData.workout_experience,
          diet_type: formData.diet_type,
        })
        .eq("id", user.id)

      if (error) {
        toast.error("Failed to save profile")
        return
      }

      toast.success("Profile saved! Welcome to FitPilot AI!")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">FitPilot AI</h1>
          <p className="text-slate-500">Let's set up your fitness profile</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex-1">
              <div className={`h-2 rounded-full transition-all ${idx <= currentStep ? "bg-emerald-600" : "bg-slate-200"}`} />
              <p className={`text-xs mt-1 text-center ${idx === currentStep ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => update("age", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {["male", "female", "other"].map((g) => (
                    <button
                      key={g}
                      onClick={() => update("gender", g)}
                      className={`py-2 rounded-lg border text-sm font-medium capitalize transition ${
                        formData.gender === g
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "border-slate-300 text-slate-700 hover:border-emerald-400"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Body Stats */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Body Statistics</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  placeholder="175"
                  value={formData.height}
                  onChange={(e) => update("height", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Weight (kg)</label>
                <input
                  type="number"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => update("weight", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Goal Weight (kg)</label>
                <input
                  type="number"
                  placeholder="65"
                  value={formData.goal_weight}
                  onChange={(e) => update("goal_weight", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Fitness Goals */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Fitness Goals</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Primary Goal</label>
                <div className="space-y-2">
                  {[
                    { value: "weight_loss", label: "Weight Loss", desc: "Burn fat and get leaner" },
                    { value: "muscle_gain", label: "Muscle Gain", desc: "Build strength and muscle" },
                    { value: "maintenance", label: "Maintenance", desc: "Stay fit and healthy" },
                  ].map((goal) => (
                    <button
                      key={goal.value}
                      onClick={() => update("fitness_goal", goal.value)}
                      className={`w-full p-4 rounded-lg border text-left transition ${
                        formData.fitness_goal === goal.value
                          ? "bg-emerald-50 border-emerald-600"
                          : "border-slate-300 hover:border-emerald-400"
                      }`}
                    >
                      <p className="font-medium text-slate-900">{goal.label}</p>
                      <p className="text-sm text-slate-500">{goal.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Activity Level</label>
                <div className="space-y-2">
                  {[
                    { value: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
                    { value: "lightly_active", label: "Lightly Active", desc: "1-3 days/week" },
                    { value: "moderately_active", label: "Moderately Active", desc: "3-5 days/week" },
                    { value: "very_active", label: "Very Active", desc: "6-7 days/week" },
                  ].map((level) => (
                    <button
                      key={level.value}
                      onClick={() => update("activity_level", level.value)}
                      className={`w-full p-3 rounded-lg border text-left transition ${
                        formData.activity_level === level.value
                          ? "bg-emerald-50 border-emerald-600"
                          : "border-slate-300 hover:border-emerald-400"
                      }`}
                    >
                      <p className="font-medium text-slate-900 text-sm">{level.label}</p>
                      <p className="text-xs text-slate-500">{level.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Diet & Experience */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Diet & Experience</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Diet Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "non_vegetarian", label: "Non-Veg" },
                    { value: "vegetarian", label: "Vegetarian" },
                    { value: "vegan", label: "Vegan" },
                  ].map((diet) => (
                    <button
                      key={diet.value}
                      onClick={() => update("diet_type", diet.value)}
                      className={`py-2 rounded-lg border text-sm font-medium transition ${
                        formData.diet_type === diet.value
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "border-slate-300 text-slate-700 hover:border-emerald-400"
                      }`}
                    >
                      {diet.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Workout Experience</label>
                <div className="space-y-2">
                  {[
                    { value: "beginner", label: "Beginner", desc: "Less than 1 year" },
                    { value: "intermediate", label: "Intermediate", desc: "1-3 years" },
                    { value: "advanced", label: "Advanced", desc: "3+ years" },
                  ].map((exp) => (
                    <button
                      key={exp.value}
                      onClick={() => update("workout_experience", exp.value)}
                      className={`w-full p-3 rounded-lg border text-left transition ${
                        formData.workout_experience === exp.value
                          ? "bg-emerald-50 border-emerald-600"
                          : "border-slate-300 hover:border-emerald-400"
                      }`}
                    >
                      <p className="font-medium text-slate-900 text-sm">{exp.label}</p>
                      <p className="text-xs text-slate-500">{exp.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Setup 🎉"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}