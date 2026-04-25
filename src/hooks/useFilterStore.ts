import { UserFilters } from '@/types'
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type FilterState = {
    filters: UserFilters;
    setFilters: <K extends keyof UserFilters>(
        filterName: K,
        value: UserFilters[K]
    ) => void;
}

const useFilterStore = create<FilterState>()(devtools((set) => ({
    filters: {
        ageRange: [18, 100],
        gender: ['male', 'female'],
        orderBy: 'updated',
        withPhoto: true
    },
    setFilters: (filterName, value) => set(state => {
        const currentValue = state.filters[filterName];

        if (Array.isArray(currentValue) && Array.isArray(value)) {
            const isSameArray =
                currentValue.length === value.length &&
                currentValue.every((item, index) => item === value[index]);

            if (isSameArray) return state;
        } else if (currentValue === value) {
            return state;
        }

        return {
            filters: { ...state.filters, [filterName]: value }
        }
    })
})))

export default useFilterStore;