import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { useUsersTable } from './useUsersTable';
import { TableTopContent, TableBottomContent } from './TableComponents';

export function UsersTable({ onAddUser }) {
    const {
      filteredItems,
      sortedItems,
      headerColumns,
      renderCell,
      page,
      pages,
      selectedKeys,
      visibleColumns,
      statusFilter,
      onPreviousPage,
      onNextPage,
      setSelectedKeys,
      setSortDescriptor,
      sortDescriptor,
      setStatusFilter,
      setVisibleColumns
    } = useUsersTable();
  
    return (
      <Table
        isHeaderSticky
        aria-label="Users table with custom cells, pagination and sorting"
        bottomContent={
          <TableBottomContent
            selectedKeys={selectedKeys}
            filteredItems={filteredItems}
            page={page}
            pages={pages}
            onPreviousPage={onPreviousPage}
            onNextPage={onNextPage}
          />
        }
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={
          <TableTopContent
            statusFilter={statusFilter}
            visibleColumns={visibleColumns}
            onAddUser={onAddUser}
            setStatusFilter={setStatusFilter}
            setVisibleColumns={setVisibleColumns}
          />
        }
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }