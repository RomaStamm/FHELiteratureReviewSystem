'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface StatusViewProps {
  contract: ethers.Contract | null;
}

export default function StatusView({ contract }: StatusViewProps) {
  const [submissionPeriod, setSubmissionPeriod] = useState('0');
  const [reviewPeriod, setReviewPeriod] = useState('0');
  const [submissionActive, setSubmissionActive] = useState(false);
  const [reviewActive, setReviewActive] = useState(false);
  const [totalSubmissions, setTotalSubmissions] = useState('0');

  useEffect(() => {
    if (contract) {
      loadStatusData();
    }
  }, [contract]);

  async function loadStatusData() {
    if (!contract) return;
    try {
      const subPeriod = await contract.currentSubmissionPeriod();
      const revPeriod = await contract.currentReviewPeriod();
      const subActive = await contract.isSubmissionPeriodActive();
      const revActive = await contract.isReviewPeriodActive();

      setSubmissionPeriod(subPeriod.toString());
      setReviewPeriod(revPeriod.toString());
      setSubmissionActive(subActive);
      setReviewActive(revActive);

      const stats = await contract.getPeriodStats(subPeriod);
      setTotalSubmissions(stats.totalSubmissions.toString());
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  }

  return (
    <div>
      <div className="bg-gray-100 border-l-4 border-blue-600 p-5 rounded-lg mb-5">
        <h3 className="text-blue-600 mb-2.5 font-semibold text-lg">📊 Current Selection Status</h3>
        <div className="space-y-2">
          <p className="text-gray-700">
            <strong>Submission Period:</strong> {submissionPeriod}
          </p>
          <p className="text-gray-700">
            <strong>Review Period:</strong> {reviewPeriod}
          </p>
          <p className="text-gray-700">
            <strong>Submission Status:</strong> {submissionActive ? 'Active' : 'Inactive'}
          </p>
          <p className="text-gray-700">
            <strong>Review Status:</strong> {reviewActive ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>

      <div className="bg-gray-100 border-l-4 border-blue-600 p-5 rounded-lg">
        <h3 className="text-blue-600 mb-2.5 font-semibold text-lg">📈 Statistics</h3>
        <div className="space-y-2">
          <p className="text-gray-700">
            <strong>Total Submissions:</strong> {totalSubmissions}
          </p>
          <p className="text-gray-700">
            <strong>Registered Reviewers:</strong> -
          </p>
          <p className="text-gray-700">
            <strong>Completed Reviews:</strong> -
          </p>
        </div>
      </div>
    </div>
  );
}
