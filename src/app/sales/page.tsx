/* eslint-disable react/no-unescaped-entities */


'use client'

import { Button } from '@/components/ui/button'
import { SendHorizonal } from 'lucide-react'
import { SparklesText } from './components/text-animated'


export default function Page() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">

      <main id='main-text' className="container mx-auto h-screen flex items-center  flex-col justify-center">
        <div className='flex flex-col items-center justify-center gap-2'>
          <SparklesText as={<span />} className='text-primary text-7xl' text='AIllustra' />
          <p className="text-2xl md:text-2xl text-gray-500 my-8 max-w-4xl mx-auto leading-relaxed text-center">
            Pure AI Book Alchemy: No Skills. No Delays. No Limits.<br />
            Your Concept → AI's Masterpiece → Bestseller Coloring Books
          </p>


        </div>
        <form
          action=""
        >
          <div className="flex w-md bg-background has-[input:focus]:ring-muted relative items-center px-2 rounded-md border shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
            <input
              placeholder="Your mail address"
              className="h-12 w-full bg-transparent pl-2 focus:outline-none"
              type="email"
            />

            <div>
              <Button variant="secondary" className="cursor-pointer bg-gradient-to-r from-primary to-primary/80 text-white hover:bg-primary/40">
                <SendHorizonal
                  className="relative h-4 w-4 text-white"
                />
                Enter to waitlist

              </Button>
            </div>
          </div>
        </form>
      </main>

    </div>
  )
}
