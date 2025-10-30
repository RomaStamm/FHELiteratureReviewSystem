'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface AwardsViewProps {
  contract: ethers.Contract | null;
}

interface Award {
  category: string;
  winner: string;
  announced: boolean;
}

export default function AwardsView({ contract }: AwardsViewProps) {
  const [awards, setAwards] = useState<Award[]>([]);

  useEffect(() => {
    if (contract) {
      loadAwardsData();
    }
  }, [contract]);

  async function loadAwardsData() {
    if (!contract) return;
    try {
      const currentPeriod = await contract.currentReviewPeriod();
      if (currentPeriod > 0) {
        const awardsData = await contract.getAwards(currentPeriod);
        const loadedAwards: Award[] = [];

        for (let i = 0; i < awardsData.categories.length; i++) {
          loadedAwards.push({
            category: awardsData.categories[i],
            winner: awardsData.winners[i],
            announced: awardsData.announced[i],
          });
        }

        setAwards(loadedAwards);
      }
    } catch (error) {
      console.error('Failed to load awards data:', error);
    }
  }

  const announcedAwards = awards.filter((award) => award.announced);

  return (
    <div>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 p-8 rounded-2xl">
        <h3 className="text-center mb-5 text-3xl font-bold">🏆 Award Results</h3>
        <div className="space-y-4">
          {announcedAwards.length === 0 ? (
            <p className="text-center text-gray-700">No award results announced yet</p>
          ) : (
            announcedAwards.map((award, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-90 p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <strong className="text-lg">{award.category}</strong>
                  <br />
                  <small className="text-gray-600">Winner: {award.winner}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-gray-100 border-l-4 border-blue-600 p-5 rounded-lg mt-8">
        <h3 className="text-blue-600 mb-2.5 font-semibold text-lg">🎯 Historical Awards</h3>
        <p className="text-gray-700">No historical awards records available</p>
      </div>
    </div>
  );
}
