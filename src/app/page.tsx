"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
  const Router = useRouter()
  useEffect(() => {
    Router.push('/dashboard')
  }, [])
  return (
    null
  )
}
