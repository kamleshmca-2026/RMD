'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, GitBranch } from 'lucide-react'
import { Button } from './Button'

interface HeaderProps {
  platform: 'github' | 'gitlab'
  setPlatform: (platform: 'github' | 'gitlab') => void
  view: 'active' | 'historical' | 'planned'
  setView: (view: 'active' | 'historical' | 'planned') => void
}

export default function Header({ platform, setPlatform, view, setView }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const views = [
    { id: 'active', label: 'Active', description: 'Current releases' },
    { id: 'historical', label: 'Historical', description: 'Past releases' },
    { id: 'planned', label: 'Planned', description: 'Future roadmap' },
  ] as const

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-slate-50 border-b border-slate-200 h-10 flex items-center px-6 text-xs text-slate-600">
        <div className="flex items-center gap-6 ml-auto">
          <a href="#" className="hover:text-slate-900">Documentation</a>
          <a href="#" className="hover:text-slate-900">Support</a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-full px-6 py-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-light tracking-tight">
            <GitBranch className="w-6 h-6 text-primary-500" />
            <span className="text-xl">RMD</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  view === v.id
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {v.label}
              </button>
            ))}
          </nav>

          {/* Platform Selector & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Platform Selector */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 rounded-sm p-1">
              {(['github', 'gitlab'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors duration-200 ${
                    platform === p
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p === 'github' ? 'GitHub' : 'GitLab'}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <nav className="flex flex-col p-4 gap-2">
              {views.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setView(v.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`text-left px-4 py-2 rounded-sm transition-colors duration-200 ${
                    view === v.id
                      ? 'bg-primary-50 text-primary-900'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-medium">{v.label}</div>
                  <div className="text-xs text-slate-500">{v.description}</div>
                </button>
              ))}

              {/* Mobile Platform Selector */}
              <div className="border-t border-slate-200 mt-4 pt-4 flex gap-2">
                {(['github', 'gitlab'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPlatform(p)
                      setMobileMenuOpen(false)
                    }}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-sm transition-colors duration-200 ${
                      platform === p
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {p === 'github' ? 'GitHub' : 'GitLab'}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
