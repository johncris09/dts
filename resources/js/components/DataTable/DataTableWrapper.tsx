import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Trash2 } from "lucide-react";
import Paginations from "@/components/Pagination";
import { router } from "@inertiajs/react";
import { useDebouncedCallback } from "use-debounce";
import { Checkbox } from "@/components/ui/checkbox";

interface Column<T> {
    key: string;
    label: string;
    className?: string;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: {
        data: T[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
            from: number;
            to: number;
            path: string;
            links: { url: string | null; label: string; active: boolean }[];
        };
    };
    columns: Column<T>[];
    searchPlaceholder?: string;
    routePrefix: string;
    filters?: Record<string, any>;
    createButton?: {
        label: string;
        sheet: React.ReactNode;
    };
    selectable?: boolean;
    onSelectionChange?: (selectedIds: number[]) => void;
    onBulkDelete?: (selectedIds: number[]) => void;
}

export function DataTableWrapper<T extends { id: number;[key: string]: any }>({
    data,
    columns,
    searchPlaceholder = "Search...",
    routePrefix,
    filters,
    createButton,
    selectable = false,
    onSelectionChange,
    onBulkDelete,
}: DataTableProps<T>) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    useEffect(() => {
        setSelectedRows([]);
        onSelectionChange?.([]);
    }, [data.data]);

    const handleSearch = useDebouncedCallback((term: string) => {
        router.get(
            route(`${routePrefix}.index`),
            { search: term },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }, 300);

    const handleSelectAll = (checked: boolean) => {
        const newSelectedRows = checked ? data.data.map((item) => item.id) : [];
        setSelectedRows(newSelectedRows);
        onSelectionChange?.(newSelectedRows);
    };

    const handleSelectRow = (checked: boolean, id: number) => {
        const newSelectedRows = checked
            ? [...selectedRows, id]
            : selectedRows.filter((rowId) => rowId !== id);
        setSelectedRows(newSelectedRows);
        onSelectionChange?.(newSelectedRows);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4 justify-between">
                <div className="flex gap-4 items-center">
                    <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full md:w-[300px]"
                        defaultValue={filters?.search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {selectable && selectedRows.length > 0 && onBulkDelete && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onBulkDelete(selectedRows)}
                        >
                            <Trash2 className="mr-2 size-4" />
                            <span className="hidden md:block">Delete Selected</span> (
                            {selectedRows.length})
                        </Button>
                    )}
                </div>
                {createButton && (
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger>
                            <Button
                                variant="outline"
                                className=""
                                onClick={() => setIsSheetOpen(true)}
                            >
                                <Plus className="mr-2 size-4" />
                                {createButton.label}
                            </Button>
                        </SheetTrigger>
                        {createButton.sheet}
                    </Sheet>
                )}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        {selectable && (
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={
                                        data.data.length > 0 &&
                                        selectedRows.length === data.data.length
                                    }
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all"
                                />
                            </TableHead>
                        )}
                        {columns.map((column) => (
                            <TableHead key={column.key} className={column.className}>
                                {column.label}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.data.map((item) => (
                        <TableRow key={item.id}>
                            {selectable && (
                                <TableCell className="w-12">
                                    <Checkbox
                                        checked={selectedRows.includes(item.id)}
                                        onCheckedChange={(checked: boolean) =>
                                            handleSelectRow(checked, item.id)
                                        }
                                        aria-label={`Select row ${item.id}`}
                                    />
                                </TableCell>
                            )}
                            {columns.map((column) => (
                                <TableCell
                                    key={`${item.id}-${column.key}`}
                                    className={column.className}
                                >
                                    {column.render ? column.render(item) : item[column.key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {data.meta.last_page > 1 && <Paginations pagination={data.meta} />}
        </div>
    );
}