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
    const errorData = await res.json()
    throw new Error(errorData.error || 'Failed to submit inquiry')
  }
}