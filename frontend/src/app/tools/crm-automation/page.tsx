// frontend/src/app/tools/crm-automation/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

type FormStatus = 'idle' | 'submitting' | 'success';
type StepStatus = 'pending' | 'active' | 'complete';

type DemoStep = {
  id: string;
  label: string;
  detail: string;
  status: StepStatus;
  time?: string;
};

type DemoContact = {
  name: string;
  email: string;
  company: string;
  note: string;
  source: string;
  stage: string;
  owner: string;
  submittedAt: string;
};

const INITIAL_STEPS: DemoStep[] = [
  {
    id: 'received',
    label: 'Form submission received',
    detail: 'The website captures the lead and normalizes the payload.',
    status: 'pending',
  },
  {
    id: 'automation',
    label: 'Automation workflow triggered',
    detail: 'n8n validates the fields and routes the lead to the CRM.',
    status: 'pending',
  },
  {
    id: 'crm',
    label: 'CRM contact created',
    detail: 'HubSpot creates or updates the contact and tags the source.',
    status: 'pending',
  },
  {
    id: 'followup',
    label: 'Sales follow-up queued',
    detail: 'The lead is assigned, scored, and prepared for the next action.',
    status: 'pending',
  },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function buildDemoContact(formData: {
  name: string;
  email: string;
  company: string;
  message: string;
}): DemoContact {
  const now = new Date();

  return {
    name: formData.name,
    email: formData.email,
    company: formData.company || 'Not provided',
    note: formData.message || 'Requested a CRM automation walkthrough.',
    source: 'Smart Digital Tools - CRM Demo',
    stage: 'New lead',
    owner: 'Automation queue',
    submittedAt: now.toLocaleString(),
  };
}

export default function CRMAutomationPage() {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [submissionCount, setSubmissionCount] = useState(0);
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>(INITIAL_STEPS);
  const [demoContact, setDemoContact] = useState<DemoContact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  useEffect(() => {
    const count = window.localStorage.getItem('crm-demo-count') || '0';
    setSubmissionCount(Number.parseInt(count, 10));
  }, []);

  const fieldMappings = useMemo(
    () => [
      { label: 'Full Name', mapsTo: 'HubSpot contact name', value: demoContact?.name || 'Waiting for submission' },
      { label: 'Email', mapsTo: 'Primary email', value: demoContact?.email || 'Waiting for submission' },
      { label: 'Company', mapsTo: 'Company property', value: demoContact?.company || 'Waiting for submission' },
      { label: 'Message', mapsTo: 'Activity note', value: demoContact?.note || 'Waiting for submission' },
    ],
    [demoContact],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus('submitting');
    setDemoContact(null);
    setDemoSteps(INITIAL_STEPS);

    const timestamps = [
      new Date(),
      new Date(Date.now() + 1200),
      new Date(Date.now() + 2400),
      new Date(Date.now() + 3400),
    ];

    setDemoSteps((steps) =>
      steps.map((step, index) =>
        index === 0 ? { ...step, status: 'active', time: formatTime(timestamps[index]) } : step,
      ),
    );
    await wait(900);

    setDemoSteps((steps) =>
      steps.map((step, index) => {
        if (index === 0) return { ...step, status: 'complete', time: formatTime(timestamps[index]) };
        if (index === 1) return { ...step, status: 'active', time: formatTime(timestamps[index]) };
        return step;
      }),
    );
    await wait(900);

    setDemoSteps((steps) =>
      steps.map((step, index) => {
        if (index === 1) return { ...step, status: 'complete', time: formatTime(timestamps[index]) };
        if (index === 2) return { ...step, status: 'active', time: formatTime(timestamps[index]) };
        return step;
      }),
    );
    await wait(900);

    const contact = buildDemoContact(formData);
    setDemoContact(contact);
    setDemoSteps((steps) =>
      steps.map((step, index) => {
        if (index === 2) return { ...step, status: 'complete', time: formatTime(timestamps[index]) };
        if (index === 3) return { ...step, status: 'active', time: formatTime(timestamps[index]) };
        return step;
      }),
    );
    await wait(700);

    setDemoSteps((steps) =>
      steps.map((step, index) =>
        index === 3 ? { ...step, status: 'complete', time: formatTime(timestamps[index]) } : step,
      ),
    );

    const newCount = submissionCount + 1;
    setSubmissionCount(newCount);
    window.localStorage.setItem('crm-demo-count', String(newCount));
    setFormStatus('success');
  }

  return (
    <>
      <Head>
        <title>CRM Auto-Sync Demo | Smart Digital Tools</title>
        <meta
          name="description"
          content="Interactive CRM automation walkthrough showing how form submissions become CRM contacts in real time."
        />
      </Head>

      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f3ff,_#f9fafb_48%,_#ffffff_100%)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-black">
              Back to all tools
            </Link>
          </div>

          <div className="mb-10 rounded-[2rem] border border-violet-100 bg-white/90 p-8 shadow-[0_30px_80px_rgba(76,29,149,0.08)] backdrop-blur sm:p-10">
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-gradient-to-r from-[#4D0682] to-[#7C3AED] px-4 py-2 text-sm font-medium text-white">
                Live walkthrough demo
              </span>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm text-violet-800">
                Sandbox output, real workflow logic
              </span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div>
                <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900 md:text-2xl">
                  Watch Your Information Transform Into a Lead
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                  Submit a sample form and watch what happens next. See your data move through each step — from form submission, to organization, to appearing in your CRM. No mystery. No delays. Just a clear demonstration of how your information becomes a usable lead, ready for your team to act on.
                  It takes seconds. It&apos;s transparent. It&apos;s real.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="text-2xl font-bold text-[#4D0682]">{submissionCount}</div>
                    <div className="text-sm text-gray-600">Demo runs completed</div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="text-2xl font-bold text-[#4D0682]">4</div>
                    <div className="text-sm text-gray-600">Workflow steps visualized</div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="text-2xl font-bold text-[#4D0682]">0 sec</div>
                    <div className="text-sm text-gray-600">Manual CRM entry required</div>
                  </div>
                </div>
                  <div>
                    <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900 md:text-2xl gap-2 mt-10">
                      What is CRM?
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                      <strong>CRM</strong> - <em>stands for Customer Relationship Management</em>
                    </p>
                    <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600"> 
                      A CRM system stores customer information like names, contact details, and communication history in one central 
                      location.
                      <br></br>
                      <strong>Popular CRMs</strong> include HubSpot, Salesforce, Zoho, and Pipedrive.
                      <br></br>
                      <strong>Result:</strong>
                      <br></br>
                      A CRM helps you stay organized, remember your customers, and grow your business — without the stress of spreadsheets or sticky notes.
                    </p>
                  </div>
              </div>

              <div className="rounded-[1.75rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Automation console</p>
                    <h2 className="mt-1 text-2xl font-semibold text-gray-900">What your buyer sees</h2>
                  </div>
                  <div className="rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-medium text-violet-700">
                    Safe sandbox mode
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {demoSteps.map((step) => (
                    <div key={step.id} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                      <div
                        className={[
                          'mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold',
                          step.status === 'complete'
                            ? 'bg-green-100 text-green-700'
                            : step.status === 'active'
                              ? 'bg-violet-100 text-violet-700'
                              : 'bg-gray-100 text-gray-400',
                        ].join(' ')}
                      >
                        {step.status === 'complete' ? 'OK' : step.status === 'active' ? '...' : '-'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-gray-900">{step.label}</p>
                          <span className="text-xs text-gray-500">{step.time || 'Waiting'}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-[1.75rem] border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/60">
              <h2 className="text-2xl font-bold text-gray-900">Try the CRM sync walkthrough</h2>
              <p className="mt-2 text-gray-600">
                Submit a sample lead and we will animate how the data is processed, mapped, and inserted into the CRM.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                    placeholder="Sarah Khan"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                    placeholder="sarah@company.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                    placeholder="Acme Retail"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">What are you trying to automate?</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                    placeholder="Lead capture from website forms, WhatsApp, Meta ads, or appointment booking."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full rounded-xl bg-gradient-to-r from-[#4D0682] to-[#7C3AED] px-6 py-4 text-lg font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {formStatus === 'submitting' ? 'Running CRM walkthrough...' : 'Test CRM Sync'}
                </button>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  This is a transparent sandbox demo. It shows realistic workflow behavior and CRM output without sending
                  your sample data into a live client system.
                </div>

                {formStatus === 'success' && demoContact && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                    <p className="font-semibold text-green-900">Walkthrough complete</p>
                    <p className="mt-1 text-sm text-green-700">
                      Your visitor can now see the lead captured, routed, and created as a CRM-ready contact.
                    </p>
                  </div>
                )}
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">CRM output preview</p>
                    <h2 className="mt-1 text-2xl font-bold text-gray-900">New contact record</h2>
                  </div>
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                    {demoContact ? demoContact.stage : 'Awaiting sample lead'}
                  </span>
                </div>

                {demoContact ? (
                  <div className="mt-6 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Contact</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{demoContact.name}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Email</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{demoContact.email}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Company</p>
                        <p className="mt-1 text-gray-800">{demoContact.company}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Lead Owner</p>
                        <p className="mt-1 text-gray-800">{demoContact.owner}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Source</p>
                        <p className="mt-1 text-gray-800">{demoContact.source}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Created At</p>
                        <p className="mt-1 text-gray-800">{demoContact.submittedAt}</p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Activity note</p>
                      <p className="mt-2 text-sm leading-7 text-gray-700">{demoContact.note}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
                    Submit the form to populate this contact card with realistic CRM output.
                  </div>
                )}
              </div>

              <div className="rounded-[1.75rem] border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/60">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Field mapping</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">How data gets transferred</h2>
                <div className="mt-6 space-y-4">
                  {fieldMappings.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-semibold text-gray-900">{item.label}</p>
                        <p className="text-sm text-violet-700">{item.mapsTo}</p>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Current value: {item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] bg-gradient-to-r from-[#4D0682] to-[#7C3AED] p-8 text-white shadow-[0_30px_80px_rgba(76,29,149,0.18)] sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-100">Turn the demo into revenue</p>
                <h2 className="mt-2 text-3xl font-bold">Want this connected to your own forms, CRM, or WhatsApp inbox?</h2>
                <p className="mt-3 text-lg text-violet-100">
                  I can adapt this exact flow for lead capture, appointment booking, intake forms, Meta ads, or internal sales ops.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="rounded-xl bg-white px-6 py-4 text-center font-bold text-[#4D0682] transition hover:bg-gray-100">
                  Book a free automation review
                </Link>
                <Link href="/tools" className="rounded-xl border border-white/40 px-6 py-4 text-center font-bold text-white transition hover:bg-white/10">
                  Explore more tools
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
