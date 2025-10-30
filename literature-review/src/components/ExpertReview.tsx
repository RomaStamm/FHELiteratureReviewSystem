'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface ExpertReviewProps {
  contract: ethers.Contract | null;
  userAccount: string;
  showNotification: (message: string, type?: string) => void;
}

interface Work {
  id: number;
  title: string;
  author: string;
  genre: string;
}

export default function ExpertReview({
  contract,
  userAccount,
  showNotification,
}: ExpertReviewProps) {
  const [reviewActive, setReviewActive] = useState(false);
  const [isReviewer, setIsReviewer] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [expertise, setExpertise] = useState('');
  const [worksToReview, setWorksToReview] = useState<Work[]>([]);
  const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null);
  const [qualityScore, setQualityScore] = useState('');
  const [originalityScore, setOriginalityScore] = useState('');
  const [impactScore, setImpactScore] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contract && userAccount) {
      checkReviewPeriod();
      checkReviewerStatus();
    }
  }, [contract, userAccount]);

  async function checkReviewPeriod() {
    if (!contract) return;
    try {
      const isActive = await contract.isReviewPeriodActive();
      setReviewActive(isActive);
    } catch (error) {
      console.error('Failed to check review period:', error);
    }
  }

  async function checkReviewerStatus() {
    if (!contract || !userAccount) return;
    try {
      const isAuthorized = await contract.authorizedReviewers(userAccount);
      setIsReviewer(isAuthorized);
      if (isAuthorized) {
        loadWorksToReview();
      }
    } catch (error) {
      console.error('Failed to check reviewer status:', error);
    }
  }

  async function loadWorksToReview() {
    if (!contract) return;
    try {
      const currentPeriod = await contract.currentReviewPeriod();
      const workCount = await contract.workCountPerPeriod(currentPeriod);
      const works: Work[] = [];

      for (let i = 1; i <= workCount; i++) {
        const workInfo = await contract.getSubmissionInfo(currentPeriod, i);
        works.push({
          id: i,
          title: workInfo.title,
          author: workInfo.author,
          genre: workInfo.genre,
        });
      }

      setWorksToReview(works);
    } catch (error) {
      console.error('Failed to load works to review:', error);
    }
  }

  async function handleRegisterReviewer(e: React.FormEvent) {
    e.preventDefault();
    if (!contract) return;

    setLoading(true);
    try {
      showNotification('Applying for reviewer status...');
      const tx = await contract.registerReviewer(reviewerName, expertise);
      await tx.wait();

      showNotification('Application submitted successfully! Awaiting admin approval.');
      setReviewerName('');
      setExpertise('');
    } catch (error: any) {
      console.error('Application failed:', error);
      showNotification('Application failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!contract || selectedWorkId === null) return;

    setLoading(true);
    try {
      showNotification('Submitting review...');
      const tx = await contract.submitReview(
        selectedWorkId,
        qualityScore,
        originalityScore,
        impactScore,
        comments
      );
      await tx.wait();

      showNotification('Review submitted successfully!');
      setSelectedWorkId(null);
      setQualityScore('');
      setOriginalityScore('');
      setImpactScore('');
      setComments('');
      loadWorksToReview();
    } catch (error: any) {
      console.error('Review submission failed:', error);
      showNotification('Review submission failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="bg-gray-100 border-l-4 border-blue-600 p-5 rounded-lg mb-5">
        <h3 className="text-blue-600 mb-2.5 font-semibold text-lg">👨‍🏫 Expert Review</h3>
        <p className="text-gray-700">
          {reviewActive ? '✅ Review period active' : '❌ Review period not started'}
        </p>
      </div>

      {!isReviewer ? (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Reviewer Registration</h3>
          <form onSubmit={handleRegisterReviewer}>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-800" htmlFor="reviewerName">
                Expert Name
              </label>
              <input
                type="text"
                id="reviewerName"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-600"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-800" htmlFor="expertise">
                Area of Expertise
              </label>
              <input
                type="text"
                id="expertise"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-600"
                placeholder="e.g., Modern Literature, Classical Poetry, Drama Theory"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-4 px-8 border-none rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-blue-800 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Applying...' : 'Apply to be a Reviewer'}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Work Review</h3>

          {selectedWorkId === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {worksToReview.map((work) => (
                <div key={work.id} className="bg-gray-100 p-5 rounded-xl border border-gray-300">
                  <h4 className="text-blue-600 mb-2.5 font-semibold">{work.title}</h4>
                  <p className="mb-2 text-gray-700">
                    <strong>Author:</strong> {work.author}
                  </p>
                  <p className="mb-4 text-gray-700">
                    <strong>Genre:</strong> {work.genre}
                  </p>
                  <button
                    onClick={() => setSelectedWorkId(work.id)}
                    className="bg-blue-600 text-white py-3 px-6 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-blue-800"
                  >
                    Review This Work
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmitReview}>
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-800" htmlFor="qualityScore">
                  Quality Score (1-100)
                </label>
                <input
                  type="number"
                  id="qualityScore"
                  min="1"
                  max="100"
                  value={qualityScore}
                  onChange={(e) => setQualityScore(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  className="block mb-2 font-semibold text-gray-800"
                  htmlFor="originalityScore"
                >
                  Originality Score (1-100)
                </label>
                <input
                  type="number"
                  id="originalityScore"
                  min="1"
                  max="100"
                  value={originalityScore}
                  onChange={(e) => setOriginalityScore(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-800" htmlFor="impactScore">
                  Impact Score (1-100)
                </label>
                <input
                  type="number"
                  id="impactScore"
                  min="1"
                  max="100"
                  value={impactScore}
                  onChange={(e) => setImpactScore(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-800" htmlFor="comments">
                  Review Comments (Encrypted Storage)
                </label>
                <textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-base h-32 resize-y focus:outline-none focus:border-blue-600"
                  placeholder="Enter your professional review comments - all content will be encrypted"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white py-4 px-8 border-none rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedWorkId(null);
                    setQualityScore('');
                    setOriginalityScore('');
                    setImpactScore('');
                    setComments('');
                  }}
                  className="bg-gray-600 text-white py-4 px-8 border-none rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
