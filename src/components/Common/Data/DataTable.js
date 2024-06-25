"use client";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useState, useMemo } from "react";

const DataTable = ({
  data,
  columns,
  pageSize = 5,
  filterable = true,
  searchKey = "name",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);
  const [filterConfig, setFilterConfig] = useState({});

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      return Object.keys(filterConfig).every((key) => {
        return item[key]
          .toString()
          .toLowerCase()
          .includes(filterConfig[key].toLowerCase());
      });
    });
  }, [sortedData, filterConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "ascending" };
      }
      return {
        key,
        direction: prev.direction === "ascending" ? "descending" : "ascending",
      };
    });
  };

  const handleFilterChange = (key, value) => {
    setFilterConfig((prev) => ({ ...prev, [key]: value }));
  };

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="p-6">
      {filterable && (
        <input
          aria-label="keywords"
          type="text"
          placeholder={`search by ${searchKey}`}
          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm"
          value={filterConfig[searchKey] || ""}
          onChange={(e) => handleFilterChange(searchKey, e.target.value)}
        />
      )}
      <Table className="mt-4">
        <TableHeader>
          {columns.map((col) => (
            <TableColumn key={col.key}>
              <span className="inline-block me-1">{col.name}</span>
              {col.sortable && (
                <button onClick={() => handleSort(col.key)}>
                  {sortConfig && sortConfig.key === col.key
                    ? sortConfig.direction === "ascending"
                      ? "⬆️"
                      : "⬇️"
                    : "↕️"}
                </button>
              )}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent={"No content found"}>
          {paginatedData.map((item, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.key}>{item[col.key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end gap-2 mt-2">
        <Button
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <Button
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DataTable;
