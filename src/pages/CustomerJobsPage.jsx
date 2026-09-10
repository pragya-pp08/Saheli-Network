import React from 'react';
import CustomerJobs from '../components/CustomerJobs';

export default function CustomerJobsPage() {
  return (
    <div className="flex-1 overflow-y-auto px-10 py-6 bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        <div>
          <h1 className="text-[18px] font-bold text-gray-900">Kaam Post Karein</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">Job details add karein aur applicants mein se Saheli select karein</p>
        </div>
        <CustomerJobs expanded />
      </div>
    </div>
  );
}
