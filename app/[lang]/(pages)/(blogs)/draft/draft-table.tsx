"use client";
import * as React from "react";
import {useEffect} from "react";

import {MoreHorizontal} from "lucide-react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Icon} from "@iconify/react";
import {cn} from "@/lib/utils";
import {blogService} from "@/app/api/services/blog.Service";
import {BlogModel} from "@/models/blog";


export function DraftDataTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [allData, setAllData] = React.useState([]);
    const router = useRouter();

    useEffect(() => {
        fetchData()
    }, []);


    const fetchData = async () => {
        const response = await blogService.getAllDraftBlogs();
        if (response.status === 200) {
            setAllData(response.data)
        }
    }

    const columns: ColumnDef<BlogModel>[] = [
        {
            accessorKey: "blog_title",
            header: "Title",
            cell: ({row}) => {
                const blogTitle = row.original.blog_title;
                return (
                    <div className="font-medium text-card-foreground/80">
                        <div className="flex space-x-3 rtl:space-x-reverse items-center">
                        <span className="text-sm text-card-foreground whitespace-nowrap">
              {blogTitle ?? "Unknown Title"}
            </span>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "blog_slug",
            header: "Slug",
            cell: ({row}) => <div className="lowercase whitespace-nowrap">{row.getValue("blog_slug")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({row}) => {
                const blog = row.original;
                return (
                    <div className=" text-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                    onClick={() => router.push(`/en/editblog/?id=${blog.blog_id}`)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];


    const table = useReactTable({
        data: allData,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
    });

    return (
        <>
            <div className="flex items-center flex-wrap gap-2  px-4">
                <Input
                    placeholder="Search by title..."
                    value={(table.getColumn("blog_title")?.getFilterValue() as string) || ""}
                    onChange={(event) =>
                        table.getColumn("blog_title")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm min-w-[200px] h-10"
                />
            </div>
            <div>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center flex-wrap gap-4 px-4 py-4">
                <div className="flex gap-2  items-center">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-8 w-8"
                    >
                        <Icon icon="heroicons:chevron-left" className="w-5 h-5 rtl:rotate-180"/>
                    </Button>

                    {table.getPageOptions().map((page, pageIdx) => (
                        <Button
                            key={`basic-data-table-${pageIdx}`}
                            onClick={() => table.setPageIndex(pageIdx)}

                            className={cn("w-8 h-8")}
                        >
                            {page + 1}
                        </Button>

                    ))}
                    <Button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                    >
                        <Icon icon="heroicons:chevron-right" className="w-5 h-5 rtl:rotate-180"/>
                    </Button>
                </div>
            </div>
        </>
    );
}

export default DraftDataTable;
