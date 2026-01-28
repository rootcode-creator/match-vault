import { MessageDto } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type MessageState = {
    messages: MessageDto[];
    unreadCount: number;
    setUnreadCount: (count: number) => void;
    add: (message: MessageDto) => void;
    remove: (id: string) => void;
    set: (messages: MessageDto[]) => void;
    updateUnreadCount: (amount: number) => void;
}

const useMessageStore = create<MessageState>()(devtools((set) => ({
    messages: [],
    unreadCount: 0,
    setUnreadCount: (count) =>
        set({ unreadCount: Number.isFinite(count) ? Math.max(0, count) : 0 }),
    add: (message) => set(state => ({ messages: [message, ...state.messages] })),
    remove: (id) => set(state => ({ messages: state.messages.filter(message => message.id !== id) })),
    set: (messages) => set({ messages }),
    updateUnreadCount: (amount: number) =>
        set((state) => {
            const current = Number.isFinite(state.unreadCount) ? state.unreadCount : 0;
            const delta = Number.isFinite(amount) ? amount : 0;
            const next = current + delta;
            return { unreadCount: Number.isFinite(next) ? Math.max(0, next) : current };
        })
}), { name: 'messageStoreDemo' }))

export default useMessageStore;