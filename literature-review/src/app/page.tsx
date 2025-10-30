'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ConnectionStatus from '@/components/ConnectionStatus';
import Notification from '@/components/Notification';
import SubmitWork from '@/components/SubmitWork';
import ExpertReview from '@/components/ExpertReview';
import StatusView from '@/components/StatusView';
import AwardsView from '@/components/AwardsView';

const CONTRACT_ADDRESS = "0xE30e4b2A47C0605AaBaAde36f15d804fec4F9CF0";
const CONTRACT_ABI = [
  "function isSubmissionPeriodActive() view returns (bool)",
  "function isReviewPeriodActive() view returns (bool)",
  "function currentSubmissionPeriod() view returns (uint32)",
  "function currentReviewPeriod() view returns (uint32)",
  "function submitWork(string title, string author, string genre, string ipfsHash)",
  "function registerReviewer(string name, string expertise)",
  "function submitReview(uint32 workId, uint32 qualityScore, uint32 originalityScore, uint32 impactScore, string comments)",
  "function getSubmissionInfo(uint32 period, uint32 workId) view returns (string title, string author, string genre, bool submitted, bool reviewed, uint256 submissionTime, address submitter)",
  "function getReviewerProfile(address reviewer) view returns (string name, string expertise, bool isActive, uint32 reviewCount)",
  "function getPeriodStats(uint32 period) view returns (uint32 totalSubmissions, bool submissionActive, bool reviewActive)",
  "function getAwards(uint32 period) view returns (string[] categories, address[] winners, bool[] announced)",
  "function workCountPerPeriod(uint32) view returns (uint32)",
  "function authorizedReviewers(address) view returns (bool)",
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('submit');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [userAccount, setUserAccount] = useState<string>('');
  const [connected, setConnected] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    initWeb3();
  }, []);

  async function initWeb3() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Signer = await web3Provider.getSigner();
        const account = await web3Signer.getAddress();
        const web3Contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Signer);

        setProvider(web3Provider);
        setSigner(web3Signer);
        setContract(web3Contract);
        setUserAccount(account);
        setConnected(true);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setConnected(false);
        showNotification("Failed to connect wallet", "error");
      }
    } else {
      showNotification("Please install MetaMask wallet", "error");
      setConnected(false);
    }
  }

  function showNotification(message: string, type: string = 'success') {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  return (
    <main>
      <ConnectionStatus connected={connected} userAccount={userAccount} />
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <div className="container max-w-7xl mx-auto px-4 py-5">
        <div className="header text-center text-white mb-10">
          <h1 className="text-5xl font-bold mb-2.5 drop-shadow-lg">
            🏆 Literature Review System
          </h1>
          <p className="text-xl opacity-90">
            Confidential Literary Awards Platform with Fully Homomorphic Encryption
          </p>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-2xl mb-8">
          <div className="flex bg-gray-100 rounded-xl p-1.5 mb-8">
            <button
              className={`flex-1 text-center py-4 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'submit'
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('submit')}
            >
              Submit Work
            </button>
            <button
              className={`flex-1 text-center py-4 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'review'
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('review')}
            >
              Expert Review
            </button>
            <button
              className={`flex-1 text-center py-4 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'status'
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('status')}
            >
              Status
            </button>
            <button
              className={`flex-1 text-center py-4 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'awards'
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('awards')}
            >
              Awards
            </button>
          </div>

          {activeTab === 'submit' && (
            <SubmitWork contract={contract} showNotification={showNotification} />
          )}
          {activeTab === 'review' && (
            <ExpertReview
              contract={contract}
              userAccount={userAccount}
              showNotification={showNotification}
            />
          )}
          {activeTab === 'status' && <StatusView contract={contract} />}
          {activeTab === 'awards' && <AwardsView contract={contract} />}
        </div>
      </div>
    </main>
  );
}
