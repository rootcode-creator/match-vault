"use client";

import { Select, SelectItem, Button, Slider, Switch } from '@heroui/react';

import {  useFilters } from '@/hooks/useFilters';

export default function Filters() {

    const {orderByList, genderList, selectAge, SelectGender, selectOrder, selectWithPhoto, filters, totalCount,} = useFilters();

const { gender, ageRange, orderBy, withPhoto } = filters;

return (
    <div className='relative z-20 w-full border-b border-t border-neutral-200 bg-white'>
        <div className='flex flex-wrap items-center gap-3 py-3 px-3 sm:gap-4 md:gap-6'>

            <div className='flex items-center min-w-0'>
                <div className='text-sm font-normal whitespace-nowrap text-neutral-500'>
                Results:{totalCount}
                </div>
            </div>


            <div className='flex gap-2 items-center min-w-0 flex-wrap'>

                <div className='text-sm font-normal whitespace-nowrap text-neutral-700'>Gender:</div>

                {genderList.map(({ icon: Icon, value }) => (

                    <Button
                        key={value}
                        size="sm"
                        isIconOnly
                        radius="full"
                        variant="bordered"
                        color="default"
                        className={
                            gender.includes(value)
                            ? "h-7 w-7 min-w-7 rounded-full border border-black bg-black text-white"
                            : "h-7 w-7 min-w-7 rounded-full border border-neutral-200 bg-white text-neutral-700"
                        }
                        
                        onClick={() => SelectGender(value)}
                    >
                        <Icon size={16} />
                    </Button>
                )
                )}


            </div>

            <div className='flex items-center gap-3 w-full md:max-w-[380px]'>
                <div className='text-sm font-normal whitespace-nowrap text-neutral-700'>Age range:</div>

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
                        track: "h-1 bg-neutral-200 rounded-full",
                        filler: "h-1 bg-black rounded-full",
                        step: "w-1 h-1 bg-default-400 rounded-full data-[in-range=true]:bg-default-400",
                        thumb: "w-5 h-5 bg-white border border-black",
                    }}

                    onChangeEnd={(values) => selectAge(values as number[])}
                />

                <div className='text-sm font-normal tabular-nums min-w-[56px] text-right text-neutral-700'>
                    {ageRange[0]}-{ageRange[1]}
                </div>
            </div>

                        <div className='flex items-center gap-2 min-w-0'>

                                <p className='text-sm font-normal whitespace-nowrap text-neutral-700'>
                                    {withPhoto ? 'With photo' : 'Without photo'}
                                </p>

                <Switch
                    color='default'
                    size='sm'
                    isSelected={withPhoto}
                    onValueChange={selectWithPhoto}
                    aria-label='Filter: with photo'
                    classNames={{
                        base: "rounded-full",
                        wrapper: "w-14 h-7 overflow-hidden rounded-full border border-neutral-300 bg-white p-[3px] before:rounded-full after:rounded-full group-data-[selected=true]:border-black group-data-[selected=true]:bg-black",
                        thumb: "!h-5 !w-5 aspect-square shrink-0 rounded-full bg-white group-data-[selected=true]:!ms-[1.875rem] group-data-[pressed=true]:!h-5 group-data-[pressed=true]:!w-5",
                        thumbIcon: "rounded-full",
                    }}
                />

            </div>


            <div className='w-full sm:w-56 sm:ml-auto'>

                <Select
                    size="sm"
                    placeholder="Order by"
                    variant="bordered"
                    color='default'
                    className="w-full"
                    classNames={{
                        trigger: "h-8 min-h-8 rounded-full border border-neutral-300 bg-white",
                        value: "text-sm text-neutral-700",
                        selectorIcon: "hidden",
                        popoverContent: "z-50 rounded-xl border border-neutral-200 bg-white p-2",
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
