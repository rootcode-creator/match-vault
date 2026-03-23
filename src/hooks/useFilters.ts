
"use client";

import { Selection } from "@heroui/react";
import { useEffect } from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useFilterStore from "./useFilterStore";
import usePaginationStore from "./usePaginationStore";

export const useFilters = () => {
    
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentQuery = searchParams.toString();

    const { filters, setFilters } = useFilterStore();

    const pageNumber = usePaginationStore((state) => state.pagination.pageNumber);
    const pageSize = usePaginationStore((state) => state.pagination.pageSize);
    const totalCount = usePaginationStore((state) => state.pagination.totalCount);


    const { gender, ageRange, orderBy, withPhoto } = filters;

    
    useEffect(() => {
        const params = new URLSearchParams();

        if (gender) params.set("gender", gender.join(","));
        if(ageRange) params.set("ageRange", ageRange.toString());
        if(orderBy) params.set("orderBy", orderBy);
        if(pageSize) params.set('pageSize', pageSize.toString());
        if(pageNumber) params.set('pageNumber', pageNumber.toString());
        params.set("withPhoto", withPhoto.toString());

        const nextQuery = params.toString();

        if (nextQuery !== currentQuery) {
            router.replace(`${pathname}?${nextQuery}`);
        }
    }, [ageRange, orderBy, gender, router, pathname, withPhoto, pageNumber, pageSize, currentQuery]);

    const orderByList = [
        { label: "Last active", value: "updated" },
        { label: "Newest members", value: "created" },
    ];

    const genderList = [
        { value: "male", icon: FaMale },
        { value: "female", icon: FaFemale },
    ] as const;

    const handleAgeSelect = (value: number[]) => {
        setFilters("ageRange", value);
    };

    const handleOrderSelect = (value: Selection) => {
        if (value instanceof Set) {
                setFilters("orderBy", value.values().next().value);
            
        }
    };

    const handleGenderSelect = (value: "male" | "female") => {
        if (gender.includes(value)) {
            setFilters("gender", gender.filter(g => g !== value));
           
        }

        else setFilters("gender", [...gender, value]);
    };

    const handleWithPhotoToggle = (checked: boolean) => {
        setFilters("withPhoto", checked);
    };

    return {
        orderByList,
        genderList,
        selectAge: handleAgeSelect,
        SelectGender: handleGenderSelect,
        selectOrder: handleOrderSelect,
        selectWithPhoto: handleWithPhotoToggle,
        filters,
        totalCount
    };
};
