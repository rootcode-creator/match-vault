
"use client";

import { Selection } from "@heroui/react";
import { useEffect } from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import useFilterStore from "./useFilterStore";

export const useFilters = () => {
    
    const pathname = usePathname();
    const router = useRouter();

    const { filters, setFilters } = useFilterStore();
    const { gender, ageRange, orderBy, withPhoto } = filters;

    
    

    useEffect(() => {
        const searchParams = new URLSearchParams();

        if (gender) searchParams.set("gender", gender.join(","));
        if(ageRange) searchParams.set("ageRange", ageRange.toString());
        if(orderBy) searchParams.set("orderBy", orderBy);
        searchParams.set("withPhoto", withPhoto.toString());

        router.replace(`${pathname}?${searchParams}`);
    }, [ageRange, orderBy, gender, router, pathname, withPhoto]);

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
    };
};
