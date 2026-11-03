import React from 'react';
import Link from 'next/link';
import {
  Cloud,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Database,
  Lock,
  Share2,
  FileText,
  Activity,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">CloudVault</span>
              <span className="text-xs text-blue-600 font-semibold ml-2 px-2 py-0.5 rounded-full bg-blue-50">
                B.Tech Final Year
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/experiments"
              className="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition"
            >
              🧪 Viva Experiments
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <span>Launch Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
          <Shield className="w-3.5 h-3.5" />
          <span>Research Contribution: Sensitivity-Based Access Control (SBAC)</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Secure Cloud Storage <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Engineered with Integrity.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          CloudVault is a practical cloud file storage and sharing platform engineered with
          fine-grained sensitivity classification (Public, Private, Confidential) to prevent
          unauthorized data leakage in academic and collaborative environments.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
          >
            <span>Open Storage Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard/experiments"
            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm font-semibold transition flex items-center gap-2"
          >
            <span>Run Research Experiments (5 Tests)</span>
          </Link>
        </div>

        {/* Academic Project Badges */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600 text-left">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Stack</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">Next.js & Firebase</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Security Model</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">SBAC & Rules</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Storage Quota</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">5 GB Cloud Vault</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Scope</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">B.Tech Final Project</span>
          </div>
        </div>
      </section>

      {/* The 3 Sensitivity Tiers (Research Contribution Core) */}
      <section className="py-12 bg-white border-y border-slate-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sensitivity-Based Access Control (SBAC)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Files are tagged at upload time with one of three clear access tiers, enforcing strict
              boundaries against accidental link leakage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Public Card */}
            <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/30 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">1. Public Tier</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Intended for presentations, syllabus files, and open datasets. Users can generate
                  shareable links accessible by anyone holding the URL token.
                </p>
              </div>
              <ul className="mt-5 space-y-2 text-xs text-emerald-900">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Public share links enabled</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Anonymous link previews</span>
                </li>
              </ul>
            </div>

            {/* Private Card */}
            <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/30 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">2. Private Tier</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Default setting for personal notes, assignments, and offer letters. Accessible
                  strictly by the file owner and explicitly whitelisted emails.
                </p>
              </div>
              <ul className="mt-5 space-y-2 text-xs text-blue-900">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Public link creation blocked</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Direct email authorization only</span>
                </li>
              </ul>
            </div>

            {/* Confidential Card */}
            <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/30 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">3. Confidential Tier</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Highest security classification for degree transcripts, thesis drafts, and
                  sensitive research. Public links are permanently prohibited by system policy.
                </p>
              </div>
              <ul className="mt-5 space-y-2 text-xs text-rose-900">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Strict policy gatekeeper</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Instant access revocation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Research Question & Architecture Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-xs">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Research Foundation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Research Question & Hypotheses
            </h2>
            <blockquote className="mt-4 p-4 rounded-xl bg-slate-50 border-l-4 border-blue-600 text-sm font-medium text-slate-700 italic">
              "How can sensitivity-based access control improve the security of cloud-based file
              sharing while maintaining usability?"
            </blockquote>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Traditional cloud drives often default to unrestricted link sharing, resulting in
              critical private documents inadvertently becoming public. CloudVault demonstrates
              that tying sharing capabilities directly to file sensitivity drastically curtails
              unauthorized exposure without introducing unnecessary complexity.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-4">
            <Link
              href="/dashboard/experiments"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              View Research Experiments & Benchmarks
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
            >
              Explore Live Storage Vault
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-6 text-center text-xs text-slate-500">
        <p>
          <strong>CloudVault</strong> — Secure Cloud-Based File Storage and Sharing System. B.Tech Final Year Academic Project.
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Built with Next.js, Firebase Auth, Firestore, and Cloud Storage. Ready for Vercel deployment.
        </p>
      </footer>
    </div>
  );
}
