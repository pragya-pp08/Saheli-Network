import React, { useState } from "react";
import { ArrowLeft, HeartHandshake, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RecoverySupportPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reason: "",
    description: "",
    skill: "",
  });

  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:8000/recovery-support",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    if (response.ok) {
      setSubmitted(true);
    } else {
      alert("Submission failed");
    }
  } catch (err) {
    console.log(err);
    alert("Server Error");
  }
}
  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAF7F2] p-8">
        <div className="bg-white rounded-3xl shadow-sm p-8 max-w-md text-center">

          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <HeartHandshake className="text-green-600" size={30}/>
          </div>

          <h2 className="text-2xl font-bold mt-5">
            Application Received
          </h2>

          <p className="text-gray-500 mt-3 leading-relaxed">
            Thank you for trusting Saheli Network.
            We will prioritize your profile and try
            to find nearby work as soon as possible.
          </p>

          <button
            onClick={()=>navigate("/")}
            className="mt-6 bg-rose-500 text-white px-6 py-3 rounded-xl hover:bg-rose-600"
          >
            Back to Dashboard
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#FAF7F2] p-6 overflow-y-auto">

      <button
        onClick={()=>navigate(-1)}
        className="flex items-center gap-2 text-gray-600 mb-5"
      >
        <ArrowLeft size={18}/>
        Back
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm p-8">

        <div className="flex items-center gap-3">

          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle
              className="text-red-500"
              size={28}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Recovery Support
            </h1>

            <p className="text-gray-500">
              Need urgent work because of an emergency?
            </p>
          </div>

        </div>

        <div className="mt-6 bg-rose-50 rounded-2xl p-5 text-sm text-gray-700 leading-relaxed">
          If you are facing a sudden crisis, Saheli Network can temporarily
          prioritize your profile and recommend urgent nearby work opportunities.
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="font-medium">
              Reason
            </label>

            <select
              className="w-full mt-2 border rounded-xl p-3"
              value={form.reason}
              onChange={(e)=>
                setForm({...form, reason:e.target.value})
              }
              required
            >
              <option value="">Select</option>

              <option>Medical Emergency</option>

              <option>Death in Family</option>

              <option>House Damage</option>

              <option>Financial Crisis</option>

              <option>Child Education</option>

              <option>Other</option>

            </select>

          </div>

          <div>

            <label className="font-medium">
              Describe your situation
            </label>

            <textarea
              rows="5"
              className="w-full mt-2 border rounded-xl p-3"
              value={form.description}
              onChange={(e)=>
                setForm({...form, description:e.target.value})
              }
            />

          </div>

          <div>

            <label className="font-medium">
              Preferred Skill
            </label>

            <select
              className="w-full mt-2 border rounded-xl p-3"
              value={form.skill}
              onChange={(e)=>
                setForm({...form, skill:e.target.value})
              }
            >
              <option>Mehndi</option>
              <option>Tailoring</option>
              <option>Cooking</option>
              <option>Cleaning</option>
              <option>Babysitting</option>
            </select>

          </div>

          <button
            className="w-full bg-rose-500 text-white rounded-xl py-3 hover:bg-rose-600"
          >
            Submit Application
          </button>

        </form>

      </div>

    </div>
  );
}