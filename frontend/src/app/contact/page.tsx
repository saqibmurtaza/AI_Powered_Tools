import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Mail, MessageSquare, Briefcase } from 'lucide-react';

const contactOptions = [
  {
    title: 'Automation Review',
    description: 'Share your current workflow, CRM, and lead sources so we can identify quick wins.',
    action: 'Start with your CRM and form stack',
  },
  {
    title: 'Lead Capture Setup',
    description: 'Connect forms, ads, WhatsApp, or booking tools directly into your CRM pipeline.',
    action: 'Map your lead journey',
  },
  {
    title: 'Custom Build',
    description: 'Need a tailored automation flow for operations, onboarding, or sales follow-up?',
    action: 'Describe the process you want automated',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f3ff,_#f9fafb_45%,_#ffffff_100%)] font-poppins">
      <Header />

      <main className="px-6 pb-16 pt-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Link
              href="/tools/crm-automation"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to CRM Automation Demo
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[2rem] border border-violet-100 bg-white/90 p-8 shadow-[0_30px_80px_rgba(76,29,149,0.08)] backdrop-blur sm:p-10">
              <div className="inline-flex rounded-full bg-gradient-to-r from-[#4D0682] to-[#7C3AED] px-4 py-2 text-sm font-medium text-white">
                Free automation review
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                Let&apos;s turn your manual lead handling into a clean automated workflow.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                If you liked the CRM walkthrough, the next step is simple: send over your current form,
                CRM, or lead source setup and we can scope the fastest path to automation.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {contactOptions.map((option) => (
                  <div key={option.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <h2 className="text-lg font-semibold text-gray-900">{option.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{option.description}</p>
                    <p className="mt-4 text-sm font-medium text-violet-700">{option.action}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-[1.75rem] border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/60">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Best next step</p>
                    <h2 className="text-2xl font-bold text-gray-900">Email your workflow details</h2>
                  </div>
                </div>

                <p className="mt-4 text-gray-600">
                  Email a short summary of your current process, your CRM, and what you want automated.
                  I&apos;ll review it and come back with the best next move.
                </p>

                <a
                  href="mailto:hello@digitalsmstudio.com?subject=Free%20Automation%20Review&body=Hi,%0D%0A%0D%0AI%20want%20help%20automating%20my%20lead%20capture%20workflow.%0D%0A%0D%0ACurrent%20tools:%0D%0AWhat%20I%20want%20to%20automate:%0D%0A%0D%0AThanks"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#4D0682] to-[#7C3AED] px-6 py-4 text-center font-bold text-white transition hover:opacity-90"
                >
                  Email for free review
                </a>
              </div>

              <div className="rounded-[1.75rem] border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/60">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">What to include</p>
                    <h2 className="text-2xl font-bold text-gray-900">A useful first message</h2>
                  </div>
                </div>

                <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-600">
                  <li>Which forms or channels create your leads today</li>
                  <li>Which CRM you use, or whether you need one set up</li>
                  <li>What should happen after a submission</li>
                  <li>Any manual steps you want to remove</li>
                </ul>
              </div>

              <div className="rounded-[1.75rem] border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/60">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Prefer to explore first</p>
                    <h2 className="text-2xl font-bold text-gray-900">See more tools</h2>
                  </div>
                </div>

                <p className="mt-4 text-gray-600">
                  You can also browse the other tools and come back when you&apos;re ready to scope your automation.
                </p>

                <Link
                  href="/tools"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-gray-300 px-6 py-4 text-center font-bold text-gray-900 transition hover:bg-gray-50"
                >
                  Browse tools
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
