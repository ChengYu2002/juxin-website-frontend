// src/services/inquiryService.js
// const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function submitInquiry({ name, email, message }) {
  const res = await fetch('/api/inquiry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, message })
  })

  if (!res.ok) {
    let errorMessage = 'Failed to submit inquiry'
    try {
      const errorData = await res.json()
      if (errorData?.error) {
        errorMessage = errorData.error
      }
    } catch {
      // ignore JSON parse errors
    }

    const error = new Error(errorMessage)
    error.status = res.status
    throw error
  }

  return await res.json()
}