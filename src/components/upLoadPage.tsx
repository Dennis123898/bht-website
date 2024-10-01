import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useClerkUser } from '../hook/useClerkUser';
import { addItem, deleteItem } from '../services/database';

interface Item {
    name: string;
    id: string;
    type: 'file' | 'folder';
}

export const UploadPage: React.FC = () => {
    const { user, isLoading } = useClerkUser();
    const [items, setItems] = useState<Item[]>(() => {
        const savedItems = localStorage.getItem('uploadItems');
        return savedItems ? JSON.parse(savedItems) : [];
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showFolderForm, setShowFolderForm] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    useEffect(() => {
        localStorage.setItem('uploadItems', JSON.stringify(items));
    }, [items]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && user) {
            for (const file of Array.from(files)) {
                try {
                    const fileId = await addItem(user.id, file);
                    setItems(prevItems => [...prevItems, { name: file.name, id: fileId, type: 'file' }]);
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const createFolder = async () => {
        if (newFolderName.trim() && user) {
            try {
                const folderId = await addItem(user.id, newFolderName.trim());
                setItems(prevItems => [...prevItems, { name: newFolderName.trim(), id: folderId, type: 'folder' }]);
                setNewFolderName('');
                setShowFolderForm(false);
            } catch (error) {
                console.error('Error creating folder:', error);
            }
        }
    };

    const removeItem = async (id: string, type: 'file' | 'folder') => {
        if (user) {
            try {
                await deleteItem(user.id, id, type === 'folder');
                setItems(prevItems => prevItems.filter(item => item.id !== id));
            } catch (error) {
                console.error('Error removing item:', error);
            }
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white">
            <div className="w-full md:w-64 bg-gray-800 p-4">
                <div className="flex items-center mb-8">
                    <img src="/Images/BCU_LOGO.png" alt="BCU LOGO" className="w-10 h-10 mr-4 ml-2" />
                    <Link to="/" className="text-2xl font-bold text-purple-400">BCU</Link>
                </div>
                <div className="flex md:flex-col">
                    {["Documents", "Forum", "Games", "Saved Posts"].map((text) => (
                        <div key={text} className="flex items-center mb-4 p-2 hover:bg-gray-700 rounded">
                            <img 
                        src={`/Images/${text === "Documents" ? "documenticon.png" : 
                            text === "Saved Posts" ? "savedposts.icon.png" : 
                            text === "Forum" ? "forumicon.png" : 
                            text === "Games" ? "gamesicon.png" : 
                            text.toLowerCase().replace(' ', '') + 'icon.png'}`} 
                        alt={`${text} Icon`} 
                        className="w-6 h-6 mr-3" />
                            <span className="hidden md:inline cursor-pointer">{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 p-4 md:p-8 overflow-x-auto">
                <div className="flex justify-end items-center mb-8">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="bg-yellow-400 text-blue-900 py-2 px-4 rounded hover:bg-yellow-300 font-bold">
                                Đăng nhập
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>

                {!isLoading && user && (
                    <>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-8">
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple accept=".pdf" />
                            <button onClick={() => fileInputRef.current?.click()} className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                                Add a file
                            </button>
                            <button onClick={() => setShowFolderForm(true)} className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                                Create a folder
                            </button>
                        </div>

                        {showFolderForm && (
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder="Folder name"
                                    className="bg-gray-700 text-white px-3 py-2 rounded-md mr-2"
                                />
                                <button onClick={createFolder} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                                    Create
                                </button>
                            </div>
                        )}

                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <div className="flex items-center px-4 py-2 bg-gray-700">
                                <div className="flex space-x-4 w-2/3">
                                    <span>Category</span>
                                    <span>Name</span>
                                </div>
                                <span className="w-1/3 text-right">Options</span>
                            </div>
                            <div className="divide-y divide-gray-700">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center px-4 py-2 hover:bg-gray-700">
                                        <img 
                                            src={`/Images/${item.type}icon.png`}
                                            alt={item.type}
                                            className="w-5 h-5 mr-3" 
                                        />
                                        <span className="flex items-center flex-grow ml-4 truncate">{item.name}</span>
                                        <button 
                                            className="text-gray-400 hover:text-white ml-2"
                                            onClick={() => removeItem(item.id, item.type)}
                                        >
                                            <img src="/Images/bincan.png" alt="Delete" className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
