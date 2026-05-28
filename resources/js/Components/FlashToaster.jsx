import React, { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react'

export default function FlashToaster() {
  const { flash } = usePage().props
  const [queue, setQueue] = useState([])

  // tiap flash baru, dorong ke antrean
  useEffect(() => {
    const msgs = []
    if (flash?.success) msgs.push({ type: 'success', text: flash.success })
    if (flash?.error)   msgs.push({ type: 'error',   text: flash.error })
    if (flash?.info)    msgs.push({ type: 'info',    text: flash.info })
    if (msgs.length) setQueue(q => [...q, ...msgs])
  }, [flash?.success, flash?.error, flash?.info])

  useEffect(() => {
    if (!queue.length) return
    const timer = setTimeout(() => setQueue(q => q.slice(1)), 2800) // auto-hide
    return () => clearTimeout(timer)
  }, [queue])

  if (!queue.length) return null
  const { type, text } = queue[0]

  const color = type === 'success'
    ? 'bg-emerald-600'
    : type === 'error'
      ? 'bg-rose-600'
      : 'bg-gray-900'

  return (
    <div className="fixed inset-x-0 top-3 z-[60] flex justify-center px-3">
      <div className={`text-white ${color} shadow-lg rounded-xl px-4 py-2 text-sm`}>
        {text}
      </div>
    </div>
  )
}
