'use client'

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { formatEther } from 'viem';
import { useWeb3 } from '../contexts/web3Context';

interface Project {
  projectId: bigint;
  creator: string;
  donor: string;
  totalAmount: bigint;
  fundsRaised: bigint;
  isComplete: boolean;
  projectName: string;
  description: string;
  createdAt: bigint;
}

export default function DonationPage() {
  const params = useParams();
  const projectId = Number(params?.projectId);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [txState, setTxState] = useState<'idle' | 'confirm' | 'mining' | 'success' | 'error'>('idle');
  const { contractService } = useWeb3();

  // Fetch project details via service
  const [project, setProject] = React.useState<any>(null);
  const [isProjectLoading, setIsProjectLoading] = React.useState(true);
  React.useEffect(() => {
    const load = async () => {
      try {
        if (!contractService) return;
        setIsProjectLoading(true);
        const p = await contractService.getProjectDetails(projectId);
        setProject(p);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load project');
      } finally {
        setIsProjectLoading(false);
      }
    };
    load();
  }, [contractService, projectId]);

  const handleDonate = async () => {
    try {
      setError('');
      if (!amount || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      if (!contractService) {
        setError('Wallet not connected');
        return;
      }
      setTxState('confirm');
      setTxState('mining');
      await contractService.donateToProject(projectId, amount);
      setTxState('success');
    } catch (err) {
      console.error('Error donating:', err);
      setError('Transaction failed. Please try again.');
      setTxState('error');
    }
  };

  const getTransactionState = () => {
    if (txState === 'confirm') return 'Please confirm the transaction in your wallet...';
    if (txState === 'mining') return 'Processing transaction...';
    if (txState === 'success') return 'Donation successful!';
    return '';
  };

  if (isProjectLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Project not found</div>
      </div>
    );
  }

  const typedProject = project as unknown as Project;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">{typedProject.projectName}</h1>
        <p className="text-gray-600 mb-6">{typedProject.description}</p>
        
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${Number((typedProject.fundsRaised * BigInt(100)) / typedProject.totalAmount)}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{formatEther(typedProject.fundsRaised)} ETH raised</span>
            <span>{formatEther(typedProject.totalAmount)} ETH goal</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Donation Amount (ETH)
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.0"
          />
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}

        <button
          onClick={handleDonate}
          disabled={txState === 'confirm' || txState === 'mining'}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
        >
          {txState === 'confirm' || txState === 'mining' ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              {getTransactionState()}
            </div>
          ) : (
            'Donate Now'
          )}
        </button>

        {txState === 'success' && (
          <div className="mt-4 text-center text-green-500">
            Thank you for your contribution!
          </div>
        )}
      </div>
    </div>
  );
}