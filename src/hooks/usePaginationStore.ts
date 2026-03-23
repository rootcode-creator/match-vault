import { PagingResult } from '@/types'
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type PaginationState = {
    pagination: PagingResult;
    setPagination: (totalCount: number) => void;
    setPage: (pageNumber: number) => void;
    setPageSize: (pageSize: number) => void;
}

const usePaginationStore = create<PaginationState>()(devtools((set) => ({
    pagination: {
        pageNumber: 1,
        pageSize: 12,
        totalCount: 0,
        totalPages: 1
    },
    setPagination: (totalCount: number) => set(state => {
        const totalPages = Math.max(1, Math.ceil(totalCount / state.pagination.pageSize));

        if (
            state.pagination.pageNumber === 1 &&
            state.pagination.totalCount === totalCount &&
            state.pagination.totalPages === totalPages
        ) {
            return state;
        }

        return {
            pagination: {
                pageNumber: 1,
                pageSize: state.pagination.pageSize,
                totalCount,
                totalPages
            }
        };
    }),
    setPage: (pageNumber: number) => set(state => {
        if (state.pagination.pageNumber === pageNumber) return state;
        return { pagination: { ...state.pagination, pageNumber } };
    }),
    setPageSize: (pageSize: number) => set(state => {
        if (state.pagination.pageSize === pageSize) return state;

        return {
            pagination: {
                ...state.pagination,
                pageSize,
                pageNumber: 1,
                totalPages: Math.max(1, Math.ceil(state.pagination.totalCount / pageSize))
            }
        };
    })
}), { name: 'paginationStoreDemo' }))

export default usePaginationStore