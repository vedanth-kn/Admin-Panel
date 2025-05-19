'use client';
import Layout from '@/components/layout/Layout';
import React, { useState, useEffect } from "react";
import { Plus, GripVertical, ChevronDown } from 'lucide-react';
import UserCreateDialog from './UserCreateModal';
import { apiService } from '@/services/api';
import { 
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Alert,
} from "@heroui/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const columns = [
  {name: "USERNAME", uid: "username", sortable: true},
  {name: "EMAIL", uid: "email", sortable: true},
  {name: "PHONE", uid: "phone_number", sortable: true},
  {name: "FIRST NAME", uid: "first_name", sortable: true},
  {name: "ACTIONS", uid: "actions"},
];

export default function Users() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "username",
    direction: "ascending",
  });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    profile_picture: '',
    date_of_birth: '',
    gender: '',
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getUsers();
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setError('Invalid data format received');
        toast.error('Error: Invalid data format received');
      }
    } catch (error) {
      setError(error.message);
      
      if (!navigator.onLine) {
        toast.error('Unable to connect to the server. Please check your internet connection.');
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (filterValue) {
      filteredUsers = filteredUsers.filter((user) =>
        user.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.username.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [users, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
  
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <GripVertical className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const topContent = React.useMemo(() => (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <div className="flex-1">
          <h1>USERS</h1>
        </div>
        <Button 
          color="primary"
          onClick={() => setIsOpen(true)}
        >
          <Plus size={20}/> 
          Add New User
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">Total {users.length} users</span>
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  ), [users.length]);

  const bottomContent = React.useMemo(() => (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages}
        onChange={setPage}
      />
    </div>
  ), [page, pages]);

  return (
    <Layout>
      <div className="container">
        <ToastContainer />
        
        {error && (
          <Alert color="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Table
          aria-label="Users table"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSortChange={setSortDescriptor}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn 
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody 
            emptyContent={isLoading ? "Loading..." : "No users found"} 
            items={items}
            isLoading={isLoading}
          >
            {(item) => (
              <TableRow key={item.user_id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <UserCreateDialog 
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          formData={formData}
          setFormData={setFormData}
          isLoading={isLoading}
          onSuccessfulSubmit={fetchUsers}
        />
      </div>
    </Layout>
  );
}