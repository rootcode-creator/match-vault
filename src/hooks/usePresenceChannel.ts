import { useCallback, useEffect, useRef } from 'react'
import usePresenceStore from './usePresenceStore'
import { Channel, Members } from 'pusher-js';
import { pusherClient } from '@/lib/pusher';
import { updateLastActive } from '@/app/actions/memberActions';

export const usePresenceChannel = (userId: string | null) => {
    const set = usePresenceStore((state) => state.set);
    const add = usePresenceStore((state) => state.add);
    const remove = usePresenceStore((state) => state.remove);
    const channelRef = useRef<Channel | null>(null);

    const handleSetMembers = useCallback((memberIds: string[]) => {
        set(memberIds);
    }, [set]);

    const handleAddMember = useCallback((memberId: string) => {
        add(memberId);
    }, [add]);

    const handleRemoveMember = useCallback((memberId: string) => {
        remove(memberId);
    }, [remove])

    const handleSubscriptionSucceeded = useCallback(async (members: Members) => {
        handleSetMembers(Object.keys(members.members));
        await updateLastActive();
    }, [handleSetMembers]);

    const handleMemberAdded = useCallback((member: { id: string }) => {
        handleAddMember(member.id);
    }, [handleAddMember]);

    const handleMemberRemoved = useCallback((member: { id: string }) => {
        handleRemoveMember(member.id);
    }, [handleRemoveMember]);


    useEffect(() => {

        if (!userId) return;
        if (!pusherClient) return;

       

        if (!channelRef.current) {
            channelRef.current = pusherClient.subscribe('presence-match-me');

            channelRef.current.bind('pusher:subscription_succeeded', handleSubscriptionSucceeded)

            channelRef.current.bind('pusher:member_added', handleMemberAdded)

            channelRef.current.bind('pusher:member_removed', handleMemberRemoved);
        }

        return () => {
            if (channelRef.current) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind('pusher:subscription_succeeded', handleSubscriptionSucceeded);
                channelRef.current.unbind('pusher:member_added', handleMemberAdded);
                channelRef.current.unbind('pusher:member_removed', handleMemberRemoved);
                channelRef.current = null;
            }
        }
    }, [handleMemberAdded, handleMemberRemoved, handleSubscriptionSucceeded, userId])
}