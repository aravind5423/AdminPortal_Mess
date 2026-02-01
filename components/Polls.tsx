
import React, { useState, useEffect } from 'react';
import { Plus, BarChart2, Calendar, CheckCircle, Trash2, Users } from 'lucide-react';
import { PollService } from '../services/pollService';
import { Poll } from '../types';

const Polls: React.FC = () => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newPoll, setNewPoll] = useState({
        question: '',
        options: ['', ''],
        target: 'All Students'
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            setLoading(true);
            const data = await PollService.getAllPolls();
            setPolls(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePoll = async () => {
        try {
            setCreating(true);
            // Basic creation logic
            const dateObj = new Date();
            const pollData = {
                question: newPoll.question,
                options: newPoll.options.filter(o => o.trim() !== ''),
                target: newPoll.target,
                totalVotes: 0,
                multiple: false,
                date: dateObj.toISOString().split('T')[0],
                time: dateObj.toLocaleTimeString(),
                comp: dateObj, // In reality, use server timestamp
                creater: { name: 'Admin', uid: 'admin', member: true } as any // Placeholder admin user
            };
            await PollService.createPoll(pollData);
            setShowModal(false);
            setNewPoll({ question: '', options: ['', ''], target: 'All Students' });
            fetchPolls();
        } catch (e) {
            console.error(e);
            alert('Failed to create poll');
        } finally {
            setCreating(false);
        }
    };

    const updateOption = (idx: number, val: string) => {
        const opts = [...newPoll.options];
        opts[idx] = val;
        setNewPoll({ ...newPoll, options: opts });
    };

    const addOption = () => {
        setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Student Polls</h2>
                    <p className="text-slate-500 text-sm">Gather feedback and opinions from students</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={18} />
                    <span>Create New Poll</span>
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl animate-in zoom-in-95">
                        <h3 className="text-xl font-bold mb-4">Create New Poll</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Question</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 rounded-lg p-2"
                                    placeholder="e.g. Which Special Dinner item do you prefer?"
                                    value={newPoll.question}
                                    onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Options</label>
                                {newPoll.options.map((opt, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        className="w-full border border-slate-300 rounded-lg p-2 mb-2"
                                        placeholder={`Option ${idx + 1}`}
                                        value={opt}
                                        onChange={(e) => updateOption(idx, e.target.value)}
                                    />
                                ))}
                                <button onClick={addOption} className="text-indigo-600 text-sm font-bold hover:underline">+ Add Option</button>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <button onClick={handleCreatePoll} disabled={creating} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold">
                                    {creating ? 'Creating...' : 'Launch Poll'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <div className="col-span-full text-center text-slate-400 p-10">Loading Polls...</div> :
                    polls.length === 0 ? <div className="col-span-full text-center text-slate-400 p-10">No polls active</div> :
                        polls.map(poll => (
                            <div key={poll.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Active</span>
                                    <p className="text-xs text-slate-400">{poll.date}</p>
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">{poll.question}</h3>
                                <div className="space-y-2 mb-4">
                                    {poll.options.map((opt, i) => (
                                        <div key={i} className="flex justify-between text-sm text-slate-600 bg-slate-50 p-2 rounded">
                                            <span>{opt}</span>
                                            {/* Placeholder for vote percentage if available explicitly */}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><Users size={14} /> {poll.totalVotes} Votes</span>
                                    <span>By {poll.creater?.name || 'Admin'}</span>
                                </div>
                            </div>
                        ))}
            </div>
        </div>
    );
};

export default Polls;
