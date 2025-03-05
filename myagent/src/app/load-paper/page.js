'use client'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABIData from '../../constants/PaperReviewSystem.json';

const CONTRACT_ADDRESS="0x880A3B3245af33eb743e3e569033269B1AF46685";
const contractABI=contractABIData.abi;

export default function Home ()
{
        const [ account, setAccount ]=useState( '' );
        const [ contract, setContract ]=useState( null );
        const [ papers, setPapers ]=useState( [] );
        const [ loading, setLoading ]=useState( false );
        const [ paperHash, setPaperHash ]=useState( '' );

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
                        const contract=new ethers.Contract(
                                CONTRACT_ADDRESS,
                                contractABI,
                                signer
                        );

                        setAccount( accounts[ 0 ] );
                        setContract( contract );
                        loadPapers();
                } catch ( error )
                {
                        console.error( 'Error connecting to wallet:', error );
                }
        };

        const loadPapers=async () =>
        {
                if ( !contract ) return;

                setLoading( true );
                try
                {
                        const paperCount=await contract.paperCount();
                        const papers=[];

                        for ( let i=0; i<paperCount; i++ )
                        {
                                const paper=await contract.papers( i );
                                if ( paper.author.toLowerCase()===account.toLowerCase() )
                                {
                                        const status=await getStatusString( paper.status );
                                        papers.push( {
                                                id: i,
                                                hash: paper.paperHash,
                                                marksheetHash: paper.marksheetHash,
                                                status: status,
                                                submissionTime: new Date( paper.submissionTime*1000 ).toLocaleString(),
                                                reviewer: paper.assignedReviewer,
                                                comments: paper.comments
                                        } );
                                }
                        }

                        setPapers( papers );
                } catch ( error )
                {
                        console.error( 'Error loading papers:', error );
                }
                setLoading( false );
        };

        const submitPaper=async ( e ) =>
        {
                e.preventDefault();
                if ( !contract||!paperHash ) return;

                setLoading( true );
                try
                {
                        const tx=await contract.submitPaper( paperHash );
                        await tx.wait();
                        setPaperHash( '' );
                        loadPapers();
                } catch ( error )
                {
                        console.error( 'Error submitting paper:', error );
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

        const getStatusColor=( status ) =>
        {
                const colorMap={
                        'Pending': 'bg-yellow-100',
                        'Under Review': 'bg-blue-100',
                        'Completed': 'bg-green-100',
                        'Rejected': 'bg-red-100'
                };
                return colorMap[ status ]||'bg-gray-100';
        };

        const formatIPFSLink=( hash ) =>
        {
                if ( !hash ) return null;
                return `https://ipfs.io/ipfs/${ hash }`;
        };

        useEffect( () =>
        {
                if ( contract )
                {
                        contract.on( 'PaperSubmitted', ( paperId, author, hash ) =>
                        {
                                if ( author.toLowerCase()===account.toLowerCase() )
                                {
                                        loadPapers();
                                }
                        } );

                        contract.on( 'ReviewCompleted', ( paperId, status, marksheetHash ) =>
                        {
                                loadPapers();
                        } );

                        return () =>
                        {
                                contract.removeAllListeners();
                        };
                }
        }, [ contract, account ] );

        return (
                <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
                        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                                        <div className="max-w-md mx-auto">
                                                <div className="divide-y divide-gray-200">
                                                        <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                                                { !account? (
                                                                        <button
                                                                                onClick={ connectWallet }
                                                                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                                        >
                                                                                Connect Wallet
                                                                        </button>
                                                                ):(
                                                                        <>
                                                                                <h2 className="text-2xl font-bold mb-4">Submit Paper</h2>
                                                                                <form onSubmit={ submitPaper } className="space-y-4">
                                                                                        <div>
                                                                                                <label className="block mb-2">Paper Hash (IPFS):</label>
                                                                                                <input
                                                                                                        type="text"
                                                                                                        value={ paperHash }
                                                                                                        onChange={ ( e ) => setPaperHash( e.target.value ) }
                                                                                                        className="w-full border p-2 rounded"
                                                                                                        required
                                                                                                />
                                                                                        </div>
                                                                                        <button
                                                                                                type="submit"
                                                                                                disabled={ loading }
                                                                                                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-600"
                                                                                        >
                                                                                                { loading? 'Submitting...':'Submit Paper' }
                                                                                        </button>
                                                                                </form>

                                                                                <h2 className="text-2xl font-bold mt-8 mb-4">Your Papers</h2>
                                                                                { papers.map( ( paper ) => (
                                                                                        <div
                                                                                                key={ paper.id }
                                                                                                className={ `border p-4 rounded mb-4 ${ getStatusColor( paper.status ) }` }
                                                                                        >
                                                                                                <p><strong>ID:</strong> { paper.id }</p>
                                                                                                <p>
                                                                                                        <strong>Paper:</strong>{ ' ' }
                                                                                                        <a
                                                                                                                href={ formatIPFSLink( paper.hash ) }
                                                                                                                target="_blank"
                                                                                                                rel="noopener noreferrer"
                                                                                                                className="text-blue-500 hover:text-blue-600"
                                                                                                        >
                                                                                                                View Paper
                                                                                                        </a>
                                                                                                </p>
                                                                                                <p><strong>Status:</strong> { paper.status }</p>
                                                                                                <p><strong>Submitted:</strong> { paper.submissionTime }</p>
                                                                                                { paper.marksheetHash&&(
                                                                                                        <p>
                                                                                                                <strong>Marksheet:</strong>{ ' ' }
                                                                                                                <a
                                                                                                                        href={ formatIPFSLink( paper.marksheetHash ) }
                                                                                                                        target="_blank"
                                                                                                                        rel="noopener noreferrer"
                                                                                                                        className="text-blue-500 hover:text-blue-600"
                                                                                                                >
                                                                                                                        View Marksheet
                                                                                                                </a>
                                                                                                        </p>
                                                                                                ) }
                                                                                                { paper.comments&&(
                                                                                                        <p><strong>Comments:</strong> { paper.comments }</p>
                                                                                                ) }
                                                                                        </div>
                                                                                ) ) }
                                                                        </>
                                                                ) }
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        );
}