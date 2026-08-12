"use client";

import {
  type ColumnDef,
  flexRender,
  type RowData,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import { cn } from "tailwind-variants";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

interface ColumnMeta {
  cellClassName?: string;
  headClassName?: string;
}

const dataTableFeatures = tableFeatures({
  rowSelectionFeature,
});

/** Shared feature set every `<DataTable />` column registry types against. */
export type DataTableFeatures = typeof dataTableFeatures;

interface DataTableProps<TData extends RowData> {
  caption?: ReactNode;
  className?: string;
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];

  emptyState?: ReactNode;

  footer?: ReactNode;

  footerRows?: ReactNode;

  getRowId?: (row: TData, index: number) => string;

  isLoading?: boolean;
  loadingState?: ReactNode;
  totalCount?: number;
}

export function DataTable<TData extends RowData>({
  caption,
  columns,
  data,
  className,
  footer,
  footerRows,
  getRowId,
  isLoading = false,
  loadingState,
  emptyState,
}: DataTableProps<TData>) {
  const table = useTable({
    columns,
    data,
    features: dataTableFeatures,
    getRowId,
  });

  const { rows } = table.getRowModel();

  let body: ReactNode;

  if (isLoading) {
    body = (
      <TableRow className="hover:bg-transparent">
        <TableCell
          className="h-36 text-center text-muted-foreground"
          colSpan={columns.length}
        >
          {loadingState ?? (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
              <span className="text-sm">Loading…</span>
            </div>
          )}
        </TableCell>
      </TableRow>
    );
  } else if (rows.length === 0 && !footerRows) {
    body = (
      <TableRow className="hover:bg-transparent">
        <TableCell
          className="h-40 text-center text-muted-foreground"
          colSpan={columns.length}
        >
          {emptyState ?? (
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl opacity-40">📭</div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">No results found</p>
                <p className="text-muted-foreground text-sm">
                  There is nothing to display.
                </p>
              </div>
            </div>
          )}
        </TableCell>
      </TableRow>
    );
  } else {
    body = (
      <>
        {rows.map((row) => (
          <TableRow
            className={cn(
              "group transition-colors",
              "hover:bg-muted/40",
              "data-[state=selected]:bg-primary/5",
              "data-[state=selected]:shadow-[inset_3px_0_0] data-[state=selected]:shadow-primary"
            )}
            data-state={row.getIsSelected() && "selected"}
            key={row.id}
          >
            {row.getAllCells().map((cell) => (
              <TableCell
                className={cn(
                  "px-4 py-3 align-middle text-sm",
                  (cell.column.columnDef.meta as ColumnMeta | undefined)
                    ?.cellClassName
                )}
                key={cell.id}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}

        {footerRows}
      </>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm",
        className
      )}
    >
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          {caption ? <TableCaption>{caption}</TableCaption> : null}

          <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="border-border/60 border-b hover:bg-transparent"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className={cn(
                      "h-11 whitespace-nowrap px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider",
                      (header.column.columnDef.meta as ColumnMeta | undefined)
                        ?.headClassName
                    )}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="[&_tr:last-child]:border-0">{body}</TableBody>

          {footer ? (
            <TableFooter className="bg-muted/30 font-medium">
              {footer}
            </TableFooter>
          ) : null}
        </Table>
      </div>
    </div>
  );
}
