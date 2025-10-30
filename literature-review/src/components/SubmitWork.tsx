'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface SubmitWorkProps {
  contract: ethers.Contract | null;
  showNotification: (message: string, type?: string) => void;
}

interface Submission {
  title: string;
  author: string;
  genre: string;
  reviewed: boolean;
  submissionTime: bigint;
}

export default function SubmitWork({ contract, showNotification }: SubmitWorkProps) {
  const [submissionActive, setSubmissionActive] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contract) {
      checkSubmissionPeriod();
      loadSubmissions();
    }
  }, [contract]);

  async function checkSubmissionPeriod() {
    if (!contract) return;
    try {
      const isActive = await contract.isSubmissionPeriodActive();
      setSubmissionActive(isActive);
    } catch (error) {
      console.error('Failed to check submission period:', error);
    }
  }

  async function loadSubmissions() {
    if (!contract) return;
    try {
      const currentPeriod = await contract.currentSubmissionPeriod();
      const stats = await contract.getPeriodStats(currentPeriod);
      const loadedSubmissions: Submission[] = [];

      for (let i = 1; i <= stats.totalSubmissions; i++) {
        try {
          const workInfo = await contract.getSubmissionInfo(currentPeriod, i);
          loadedSubmissions.push({
            title: workInfo.title,
            author: workInfo.author,
            genre: workInfo.genre,
            reviewed: workInfo.reviewed,
            submissionTime: workInfo.submissionTime,
          });
        } catch (error) {
          console.error(`Failed to load submission ${i}:`, error);
        }
      }

      setSubmissions(loadedSubmissions);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contract) {
      showNotification('Contract not initialized', 'error');
      return;
    }

    setLoading(true);
    try {
      showNotification('Submitting work...');
      const tx = await contract.submitWork(title, author, genre, ipfsHash);
      await tx.wait();

      showNotification('Work submitted successfully!');
      setTitle('');
      setAuthor('');
      setGenre('');
      setIpfsHash('');
      loadSubmissions();
    } catch (error: any) {
      console.error('Submission failed:', error);
      showNotification('Submission failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="bg-gray-100 border-l-4 border-blue-600 p-5 rounded-lg mb-5">
        <h3 className="text-blue-600 mb-2.5 font-semibold text-lg">📝 Work Submission</h3>
        <p className="text-gray-700">
          {submissionActive ? '✅ Submission period open' : '❌ Submission period closed'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-800" htmlFor="title">
            Work Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-600"
            placeholder="Enter work title"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-800" htmlFor="author">
            Author Name
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-600"
            placeholder="Enter author name"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-800" htmlFor="genre">
            Work Category
          </label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-600"
            required
          >
            <option value="">Select work category</option>
            <option value="Fiction">Fiction</option>
            <option value="Poetry">Poetry</option>
            <option value="Drama">Drama</option>
            <option value="Non-Fiction">Non-Fiction</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-800" htmlFor="ipfs">
            Work Content (IPFS Hash)
          </label>
          <textarea
            id="ipfs"
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-base h-32 resize-y focus:outline-none focus:border-blue-600"
            placeholder="Enter IPFS hash of your work for secure private storage"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!submissionActive || loading}
          className="bg-blue-600 text-white py-4 px-8 border-none rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-blue-800 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Submitting...' : 'Submit Work'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
        {submissions.map((submission, index) => (
          <div
            key={index}
            className="bg-gray-100 p-5 rounded-xl border border-gray-300"
          >
            <h4 className="text-blue-600 mb-2.5 font-semibold">{submission.title}</h4>
            <p className="mb-2 text-gray-700">
              <strong>Author:</strong> {submission.author}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Genre:</strong> {submission.genre}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Status:</strong> {submission.reviewed ? 'Reviewed' : 'Pending Review'}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Submitted:</strong>{' '}
              {new Date(Number(submission.submissionTime) * 1000).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
