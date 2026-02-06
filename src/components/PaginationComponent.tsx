"use client";

import { Pagination } from '@heroui/react';
import React from 'react';
import clsx from 'clsx';

export default function PaginationComponent() {

    const resultText = `Showing 1-2 of 24 results`;
    return (
        <div className='border-t border-default-200 w-full mt-5'>
            <div className='flex flex-row justify-between items-center py-4'>

                <div className='text-sm text-default-500'>{resultText}</div>

                <Pagination
                    total={24}
                    color='default'
                    page={1}
                    variant='bordered'
                    classNames={{
                        item: "min-w-7 w-7 h-7 text-xs border-2 border-foreground rounded-md",
                        cursor: "min-w-7 w-7 h-7 text-xs border-2 border-foreground rounded-md bg-white text-foreground",
                    }}
                />

                <div className='flex flex-row gap-1.5 items-center text-sm text-default-500'>
                    <span className='mr-0.5'>Page size:</span>
                    {[3, 6, 12].map((size) => (
                        <div
                            key={size}
                            className={clsx("page-size-box", {
                                "bg-white text-black border-black":
                                    size === 3,
                            })}
                        >
                            {size}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
