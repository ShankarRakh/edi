'use client'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABIData from '../../constants/PaperReviewSystem.json';

export default function StatusUpdate ()
{
        const [ account, setAccount ]=useState( '' );
        const [ contract, setContract ]=useState( null );
        const [ paperId, setPaperId ]=useState( '' );
        const [ selectedStatus, setSelectedStatus ]=useState( '' );
        const [ loading, setLoading ]=useState( false );
        const [ currentStatus, setCurrentStatus ]=useState( null );
        const [ marksheetHash, setMarksheetHash ]=useState( '' );
        const [ comments, setComments ]=useState( '' );

        const CONTRACT_ADDRESS="0x880A3B3245af33eb743e3e569033269B1AF46685"; // Replace with your deployed contract address

        const connectWallet=async () =>
        {
                try
                {
                        if ( !window.ethereum )
                        {
                                alert( 'Please install MetaMask!' );
                                return;
                        }

                        const accounts=await window.ethereum.request( {
                                method: 'eth_requestAccounts'
                        } );

                        const provider=new ethers.providers.Web3Provider( window.ethereum );
                        const signer=provider.getSigner();
                        const contractInstance=new ethers.Contract(
                                CONTRACT_ADDRESS,
                                contractABIData.abi,
                                signer
                        );

                        setAccount( accounts[ 0 ] );
                        setContract( contractInstance );
                } catch ( error )
                {
                        console.error( 'Error connecting to wallet:', error );
                        alert( 'Failed to connect wallet' );
                }
        };

        const fetchPaperStatus=async () =>
        {
                if ( !contract||!paperId ) return;

                try
                {
                        const paper=await contract.papers( paperId );
                        setCurrentStatus( Number( paper.status ) );
                        setMarksheetHash( paper.marksheetHash );
                        setComments( paper.comments );
                } catch ( error )
                {
                        console.error( 'Error fetching paper status:', error );
                        alert( 'Error fetching paper status' );
                }
        };

        const updateStatus=async () =>
        {
                if ( !contract||!paperId||!selectedStatus ) return;

                setLoading( true );
                try
                {
                        const isAccepted=selectedStatus==='2'; // 2 is Completed status
                        const tx=await contract.completeReview(
                                paperId,
                                isAccepted,
                                comments,
                                marksheetHash
                        );
                        await tx.wait();
                        alert( 'Status updated successfully!' );
                        fetchPaperStatus();
                } catch ( error )
                {
                        console.error( 'Error updating status:', error );
                        alert( 'Failed to update status' );
                }
                setLoading( false );
        };

        const getStatusString=( status ) =>
        {
                const statusMap={
                        0: 'Pending',
                        1: 'Under Review',
                        2: 'Completed',
                        3: 'Rejected'
                };
                return statusMap[ status ]||'Unknown';
        };

        return (
                <div className="min-h-screen bg-gray-100 py-8">
                        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
                                <h1 className="text-2xl font-bold mb-6">Paper Status Update</h1>

                                { !account? (
                                        <button
                                                onClick={ connectWallet }
                                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                                        >
                                                Connect MetaMask
                                        </button>
                                ):(
                                        <div className="space-y-4">
                                                <div>
                                                        <p className="text-sm text-gray-600 mb-1">Connected Account:</p>
                                                        <p className="font-mono text-sm">{ account }</p>
                                                </div>

                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Paper ID
                                                        </label>
                                                        <div className="flex gap-2">
                                                                <input
                                                                        type="number"
                                                                        value={ paperId }
                                                                        onChange={ ( e ) => setPaperId( e.target.value ) }
                                                                        className="flex-1 border rounded p-2"
                                                                        placeholder="Enter Paper ID"
                                                                />
                                                                <button
                                                                        onClick={ fetchPaperStatus }
                                                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                                                >
                                                                        Fetch
                                                                </button>
                                                        </div>
                                                </div>

                                                { currentStatus!==null&&(
                                                        <div>
                                                                <p className="text-sm text-gray-600 mb-1">Current Status:</p>
                                                                <p className="font-medium">{ getStatusString( currentStatus ) }</p>
                                                        </div>
                                                ) }

                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                New Status
                                                        </label>
                                                        <select
                                                                value={ selectedStatus }
                                                                onChange={ ( e ) => setSelectedStatus( e.target.value ) }
                                                                className="w-full border rounded p-2"
                                                        >
                                                                <option value="">Select Status</option>
                                                                <option value="0">Pending</option>
                                                                <option value="1">Under Review</option>
                                                                <option value="2">Completed</option>
                                                                <option value="3">Rejected</option>
                                                        </select>
                                                </div>

                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Marksheet Hash
                                                        </label>
                                                        <input
                                                                type="text"
                                                                value={ marksheetHash }
                                                                onChange={ ( e ) => setMarksheetHash( e.target.value ) }
                                                                className="w-full border rounded p-2"
                                                                placeholder="IPFS Hash of Marksheet"
                                                        />
                                                </div>

                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Comments
                                                        </label>
                                                        <textarea
                                                                value={ comments }
                                                                onChange={ ( e ) => setComments( e.target.value ) }
                                                                className="w-full border rounded p-2"
                                                                rows="3"
                                                                placeholder="Add review comments"
                                                        />
                                                </div>

                                                <button
                                                        onClick={ updateStatus }
                                                        disabled={ loading||!selectedStatus||!paperId }
                                                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                                                >
                                                        { loading? 'Updating...':'Update Status' }
                                                </button>
                                        </div>
                                ) }
                        </div>
                </div>
        );
}