"use client";

import { Pagination } from '@heroui/react';
import React, { useEffect } from 'react';
import clsx from 'clsx';
import usePaginationStore from '@/hooks/usePaginationStore';

export default function PaginationComponent({
  totalCount,
}: {
  totalCount: number;
}) {
  const setPage = usePaginationStore((state) => state.setPage);
  const setPageSize = usePaginationStore((state) => state.setPageSize);
  const setPagination = usePaginationStore((state) => state.setPagination);
  const pageNumber = usePaginationStore((state) => state.pagination.pageNumber);
  const pageSize = usePaginationStore((state) => state.pagination.pageSize);
  const totalPages = usePaginationStore((state) => state.pagination.totalPages);

  useEffect(() => {
    setPagination(totalCount);
  }, [setPagination, totalCount]);

  const start = (pageNumber - 1) * pageSize + 1;
  const end = Math.min(
    pageNumber * pageSize,
    totalCount
  );
  const resultText = `Showing ${start}-${end} of ${totalCount} results`;
   return (
        <div className='border-t border-default-200 w-full mt-5'>
            <div className='flex flex-row justify-between items-center py-4'>

                <div className='text-sm text-default-500'>{resultText}</div>

                <Pagination
                    total={totalPages}
                    color='default'
                    page={pageNumber}
                    variant='bordered'
                    classNames={{
                        item: "min-w-7 w-7 h-7 text-xs border-2 border-foreground rounded-md",
                        cursor: "min-w-7 w-7 h-7 text-xs border-2 border-foreground rounded-md bg-white text-foreground",
                    }}
                    onChange={setPage}
                />

                <div className='flex flex-row gap-1.5 items-center text-sm text-default-500'>
                    <span className='mr-0.5'>Page size:</span>
                    {[3, 6, 12].map((size) => (
                        <div
                            key={size}
                            onClick={() => setPageSize(size)}
                            className={clsx("page-size-box", {
                                "bg-white text-black border-black":
                                    pageSize === size,
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
