"use client";

import { Select, SelectItem, Button, Slider, Switch } from '@heroui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { FaFemale, FaMale } from 'react-icons/fa';

import { Selection } from '@heroui/react';

export default function Filters() {

    const [gender, setGender] = useState<"male" | "female" | null>(null);
    const [ageRange, setAgeRange] = useState<[number, number]>([27, 82]);
    const [withPhoto, setWithPhoto] = useState<boolean>(false);
    const [orderBy, setOrderBy] = useState<string>("created");

    const orderByList = [
        { label: "Last active", value: "updated" },
        { label: "Newest members", value: "created" },
    ];

    const genderList = [
        { value: "male", icon: FaMale },
        { value: "female", icon: FaFemale },
    ] as const;

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const handleAgeSelect = (value: number[]) => {
        const params = new URLSearchParams(searchParams);
        params.set("ageRange", value.toString());
        router.replace(`${pathname}?${params}`);
    }

    const resultText = useMemo(() => {
        return "Results: x";
    }, []);


    

    const handleOrderSelect = (
        value: Selection
    ) => {
        if (value instanceof Set) {
        const params = new URLSearchParams(
            searchParams
        );
        const selected = value.values().next().value;
        if (selected === undefined) return;
        params.set("orderBy", String(selected));

        router.replace(`${pathname}?${params}`);


    }
};


return (
    <div className='w-full bg-white shadow-sm border-b border-default-200 border-t-4 border-rose-500 relative z-20'>
        <div className='flex items-center gap-6 py-2 px-3'>

            <div className='flex items-center min-w-[90px]'>
                <div className='text-sm text-default-600 font-normal whitespace-nowrap'>
                    {resultText}
                </div>
            </div>


            <div className='flex gap-2 items-center min-w-[150px]'>

                <div className='text-sm text-default-700 font-semibold whitespace-nowrap'>Gender:</div>

                {genderList.map(({ icon: Icon, value }) => (

                    <Button
                        key={value}
                        size="sm"
                        isIconOnly
                        radius="sm"
                        variant="bordered"
                        color="default"
                        className={
                            gender === value
                                ? "min-w-7 w-7 h-7 bg-white text-black border-2 border-foreground rounded-md"
                                : "min-w-7 w-7 h-7 bg-transparent text-pink-600 border-0"
                        }
                        aria-label={`Filter gender: ${value}`}
                        onPress={() => setGender((prev) => (prev === value ? null : value))}
                    >
                        <Icon size={16} />
                    </Button>
                )
                )}


            </div>

            <div className='flex items-center gap-3 w-80'>
                <div className='text-sm text-default-700 font-semibold whitespace-nowrap'>Age range:</div>

                <Slider
                    className="flex-1"
                    size="md"
                    minValue={18}
                    maxValue={100}
                    defaultValue={[27, 82]}
                    step={2}
                    showSteps
                    value={ageRange}
                    onChange={(value) => {
                        if (Array.isArray(value) && value.length === 2) {
                            setAgeRange([Number(value[0]), Number(value[1])]);
                        }
                    }}
                    aria-label="Age range"
                    color="foreground"
                    classNames={{
                        track: "h-1 bg-pink-600 rounded-full",
                        filler: "h-1 bg-pink-600 rounded-full",
                        step: "w-1 h-1 bg-default-400 rounded-full data-[in-range=true]:bg-default-400",
                        thumb: "w-5 h-5 bg-white border-2 border-pink-600 shadow-sm",
                    }}

                    onChangeEnd={values => handleAgeSelect(values as number[])}
                />

                <div className='text-sm text-default-700 font-semibold tabular-nums min-w-[56px] text-right'>
                    {ageRange[0]}-{ageRange[1]}
                </div>
            </div>

            <div className='flex items-center gap-2 min-w-[110px]'>

                <p className='text-sm text-default-700 font-semibold whitespace-nowrap'>With photo</p>

                <Switch
                    color='default'
                    size='sm'
                    isSelected={withPhoto}
                    onValueChange={setWithPhoto}
                    aria-label='Filter: with photo'
                    classNames={{
                        base: "rounded-full",
                        wrapper: "w-14 h-7 p-[3px] rounded-full overflow-hidden bg-white border-2 border-default-300 before:rounded-full after:rounded-full group-data-[selected=true]:bg-pink-600 group-data-[selected=true]:border-pink-600",
                        thumb: "!w-5 !h-5 aspect-square shrink-0 rounded-full bg-white shadow-sm group-data-[selected=true]:!ms-[1.875rem] group-data-[pressed=true]:!w-5 group-data-[pressed=true]:!h-5",
                        thumbIcon: "rounded-full",
                    }}
                />

            </div>


            <div className='w-56 ml-auto'>

                <Select
                    size="sm"
                    placeholder="Order by"
                    variant="bordered"
                    color='default'
                    className="w-full"
                    classNames={{
                        trigger: "h-8 min-h-8 border-2 border-foreground rounded-md",
                        value: "text-sm text-default-700",
                        selectorIcon: "hidden",
                        popoverContent: "p-2 rounded-xl shadow-lg border border-default-200 bg-white z-50",
                        listbox: "gap-1",
                    }}
                    selectedKeys={new Set([
                        
                        searchParams.get("orderBy") || "updated",
                        
                        ])
                    }
                    
                    aria-label='Order by selector'

                    onSelectionChange={handleOrderSelect}
                >

                    {orderByList.map((item) => (
                        <SelectItem
                            key={item.value}
                            className="rounded-lg px-3 py-2 text-sm data-[hover=true]:bg-default-100 data-[selected=true]:bg-default-200"
                        >
                            {item.label}
                        </SelectItem>
                    ))}

                </Select>

            </div>

        </div>

    </div>
);
}
