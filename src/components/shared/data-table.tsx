import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";
interface Column<T> { key: string; header: string; render?: (row: T) => React.ReactNode; }
interface DataTableProps<T> { data: T[]; columns: Column<T>[]; emptyMessage?: string; }
export function DataTable<T extends Record<string, unknown>>({ data, columns, emptyMessage = "No data found." }: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader><TableRow>{columns.map((col) => <TableHead key={col.key}>{col.header}</TableHead>)}</TableRow></TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow><TableCell colSpan={columns.length} className="text-center text-slate-500 py-8">{emptyMessage}</TableCell></TableRow>
        ) : (
          data.map((row, i) => (
            <TableRow key={i}>{columns.map((col) => <TableCell key={col.key}>{col.render ? col.render(row) : String(row[col.key] ?? "")}</TableCell>)}</TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
