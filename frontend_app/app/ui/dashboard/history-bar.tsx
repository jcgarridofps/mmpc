"use client";

import Search from '@/app/ui/search';
import { MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { fetchHistory } from '@/app/lib/data';
import { useRef } from 'react';

export default function HistoryBar() {

    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);

    const handleFindHistoryButton = async ()=>{
        const history_appId = searchRef.current?.value;
        if (!history_appId) return alert("Please enter an ID");

        const history: object = await fetchHistory(history_appId);
        if(history)
            console.log("History exists");
    }

    const handleNewHistoryButton = ()=>{
        router.push('/dashboard/histories/create/')
    }

    return (
        <div className="p-4 w-full flex justify-between h-20 bg-gray-50 rounded-xl mb-4">
            <div className="flex-1 h:full flex items-center justify-center">
                <Search placeholder="Find history by patient ID" />
            </div>
            <div className="pl-2 pr-1 h:full flex items-center justify-center">
                <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    onClick={handleFindHistoryButton}
                    title='Find history'
                >
                    <MagnifyingGlassIcon className="h-5" />
                    <span className="mr-2">
                    </span> Find history
                </button>
            </div>
            <div className="p-1 aspect-square h:full flex items-center justify-center">
                <button
                    type="button"
                    className="w-full h-full aspect-square bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                    title='New history'
                    onClick={handleNewHistoryButton}
                >
                    <UserPlusIcon className="h-5" />
                </button>
            </div>
        </div>
    );
}