'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABIData from '../constants/PaperReviewSystem.json';
import { motion } from 'framer-motion';

const contractABI = contractABIData.abi;
const CONTRACT_ADDRESS = '0x0CFd2312B670FC54ee0B668ad85B5Bda7dF16d8A';

const Home = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paperHash, setPaperHash] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      setAccount(accounts[0]);
      setContract(contract);
      loadPapers();
      setIsWalletConnected(true);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  const loadPapers = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      const paperCount = await contract.paperCount();
      const papers = [];

      for (let i = 0; i < paperCount; i++) {
        const paper = await contract.papers(i);
        if (paper.author.toLowerCase() === account.toLowerCase()) {
          papers.push({
            id: i,
            hash: paper.paperHash,
            status: getStatusString(paper.status),
            submissionTime: new Date(paper.submissionTime * 1000).toLocaleString(),
            reviewer: paper.assignedReviewer,
            comments: paper.comments,
          });
        }
      }

      setPapers(papers);
    } catch (error) {
      console.error('Error loading papers:', error);
    }
    setLoading(false);
  };

  const submitPaper = async (e) => {
    e.preventDefault();
    if (!contract || !paperHash) return;

    setLoading(true);
    try {
      const tx = await contract.submitPaper(paperHash);
      await tx.wait();
      setPaperHash('');
      loadPapers();
    } catch (error) {
      console.error('Error submitting paper:', error);
    }
    setLoading(false);
  };

  const getStatusString = (status) => {
    const statusMap = {
      0: 'Submitted',
      1: 'Assigned to Reviewer',
      2: 'Under Review',
      3: 'Review Completed',
      4: 'Rejected',
      5: 'Accepted',
    };
    return statusMap[status] || 'Unknown';
  };

  useEffect(() => {
    if (contract) {
      contract.on('PaperSubmitted', (paperId, author, hash) => {
        if (author.toLowerCase() === account.toLowerCase()) {
          loadPapers();
        }
      });

      contract.on('ReviewCompleted', (paperId, status) => {
        loadPapers();
      });

      return () => {
        contract.removeAllListeners();
      };
    }
  }, [contract, account]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-6 flex flex-col justify-center sm:py-12"
    >
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative px-4 py-10 bg-white shadow-lg rounded-3xl sm:p-20"
        >
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                {!isWalletConnected ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={connectWallet}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-transform duration-200"
                  >
                    Connect Wallet
                  </motion.button>
                ) : (
                  <>
                    <motion.h2
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-3xl font-bold mb-6 text-center text-blue-700"
                    >
                      Submit Paper
                    </motion.h2>
                    <form onSubmit={submitPaper} className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Paper Hash (IPFS):
                        </label>
                        <input
                          type="text"
                          value={paperHash}
                          onChange={(e) => setPaperHash(e.target.value)}
                          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
                          required
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-transform duration-200 ${
                          loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Submitting...' : 'Submit Paper'}
                      </motion.button>
                    </form>

                    <motion.h2
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="text-3xl font-bold mt-8 mb-6 text-center text-purple-700"
                    >
                      Your Papers
                    </motion.h2>
                    {papers.map((paper) => (
                      <motion.div
                        key={paper.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + paper.id * 0.1 }}
                        className="border p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow duration-200"
                      >
                        <p>
                          <strong>ID:</strong> {paper.id}
                        </p>
                        <p>
                          <strong>Hash:</strong> {paper.hash}
                        </p>
                        <p>
                          <strong>Status:</strong> {paper.status}
                        </p>
                        <p>
                          <strong>Submitted:</strong> {paper.submissionTime}
                        </p>
                        {paper.comments && (
                          <p>
                            <strong>Comments:</strong> {paper.comments}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;