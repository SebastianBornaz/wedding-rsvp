'use client'
import React, { useState } from 'react';
import { submitRSVP } from './actions';

export default function Home() {
    const [isAttending, setIsAttending] = useState<string | null>(null);
    const [hasPlusOne, setHasPlusOne] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        const result = await submitRSVP(formData);
        setIsSubmitting(false);
        if (result.success) {
            setSubmitted(true);
        }
    }

    if (submitted) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6 text-center">
        <h1 className="text-4xl font-serif text-stone-800 mb-4">Abia așteptăm!</h1>
        <p className="text-stone-600">Mulțumim pentru confirmare!</p>
      </div>
      );
    }

    return (
      <main className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        <header className="text-center mb-10">
          <span className="text-sm uppercase tracking-widest text-stone-500">August 22, 2026</span>
          <h1 className="text-3xl font-serif mt-2 text-stone-900">Amalia & Sebastian</h1>
          <div className="h-px w-12 bg-stone-300 mx-auto mt-4"></div>
        </header>

        <form action={handleSubmit} className="space-y-6">
          {/* Guest Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Nume Complet</label>
            <input 
              name="name" 
              required 
              className="w-full px-4 py-2 border text-stone-700 placeholder:text-stone-500 border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition"
              placeholder="Numele tau"
            />
          </div>

          {/* Attendance Radio */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-3">Vei participa?</label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer">
                <input 
                  type="radio" name="attending" value="true" className="peer sr-only" 
                  onChange={() => setIsAttending('true')} required 
                />
                <div className="text-center text-stone-800 p-3 border border-stone-300 rounded-lg peer-checked:bg-stone-800 peer-checked:text-white transition">
                  Da
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input 
                  type="radio" name="attending" value="false" className="peer sr-only" 
                  onChange={() => setIsAttending('false')} 
                />
                <div className="text-center text-stone-800 p-3 border border-stone-300 rounded-lg peer-checked:bg-stone-800 peer-checked:text-white transition">
                  Nu
                </div>
              </label>
            </div>
          </div>

          {/* Conditional Content: Only show if attending */}
          {isAttending === 'true' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">

              {/* Plus One Checkbox */}
              <div className="flex items-center gap-3 p-4 border border-stone-200 rounded-lg bg-stone-50/50">
                <input
                  type="checkbox"
                  name="plus_one"
                  id="plus_one"
                  checked={hasPlusOne}
                  onChange={(e) => setHasPlusOne(e.target.checked)}
                  className="w-5 h-5 accent-stone-800 rounded border-stone-300"
                />
                <label htmlFor="plus_one" className="text-sm font-medium text-stone-700 cursor-pointer">Voi aduce un plus unu</label>
              </div>

              {/* Conditional Plus One Name */}
              {hasPlusOne && (
                <div className="animate-in zoom-in-95 duration-300">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Nume plus unu</label>
                  <input 
                    name="plus_one_name"
                    required={hasPlusOne} // Only required if they have a plus one
                    placeholder="Numele plus unu-ului tau"
                    className="w-full px-4 py-2 border text-stone-700 placeholder:text-stone-500 border-stone-300 rounded-lg outline-none"
                />
              </div>
              )}
              
              {/* Dietary Restrictions */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Alte observații</label>
                <textarea 
                  name="dietary_restrictions" 
                  rows={2}
                  className="w-full px-4 py-2 border text-stone-700 placeholder:text-stone-500 border-stone-300 rounded-lg outline-none"
                  placeholder="Allergii, meniu vegetarian, etc."
                />
              </div>

            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-stone-900 text-white py-3 rounded-lg font-medium hover:bg-stone-800 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Se trimite...' : 'Trimite'}
          </button>
        </form>
      </div>
    </main>
  );
}