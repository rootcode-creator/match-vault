"use client";

import { Select, SelectItem, Button, Slider, Switch } from '@heroui/react';

import {  useFilters } from '@/hooks/useFilters';

export default function Filters() {

    const {orderByList, genderList, selectAge, SelectGender, selectOrder, selectWithPhoto, filters, totalCount,} = useFilters();

const { gender, ageRange, orderBy, withPhoto } = filters;

return (
    <div className='w-full bg-white shadow-sm border-b border-default-200 border-t-4 border-rose-500 relative z-20'>
        <div className='flex items-center gap-6 py-2 px-3'>

            <div className='flex items-center min-w-[90px]'>
                <div className='text-sm text-default-600 font-normal whitespace-nowrap'>
                Results:{totalCount}
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
                            gender.includes(value)
                                ? "min-w-7 w-7 h-7 bg-white text-black border-2 border-foreground rounded-md"
                                : "min-w-7 w-7 h-7 bg-transparent text-pink-600 border-0"
                        }
                        
                        onClick={() => SelectGender(value)}
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
                    defaultValue={ageRange}
                    step={2}
                    
                    
                    
                    aria-label="Age range"
                    color="foreground"
                    classNames={{
                        track: "h-1 bg-pink-600 rounded-full",
                        filler: "h-1 bg-pink-600 rounded-full",
                        step: "w-1 h-1 bg-default-400 rounded-full data-[in-range=true]:bg-default-400",
                        thumb: "w-5 h-5 bg-white border-2 border-pink-600 shadow-sm",
                    }}

                    onChangeEnd={(values) => selectAge(values as number[])}
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
                    onValueChange={selectWithPhoto}
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
                    selectedKeys={new Set([orderBy])}
                    
                    aria-label='Order by selector'

                    onSelectionChange={selectOrder}
                >

                    {orderByList.map((item) => (
                        <SelectItem
                            key={item.value}
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
