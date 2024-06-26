import DataTable from "../../../components/Common/Data/DataTable";

const sampleData = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", age: 28 },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", age: 34 },
  { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com", age: 23 },
  { id: 4, name: "Bob Brown", email: "bob.brown@example.com", age: 45 },
  { id: 5, name: "Charlie Black", email: "charlie.black@example.com", age: 30 },
  { id: 6, name: "Jane Smith", email: "jane.smith@example.com", age: 34 },
  { id: 7, name: "Alice Johnson", email: "alice.johnson@example.com", age: 23 },
  { id: 8, name: "Bob Brown", email: "bob.brown@example.com", age: 45 },
];

const columns = [
  { name: "ID", key: "id", sortable: true },
  { name: "Name", key: "name", sortable: true, filterable: true },
  { name: "Email", key: "email", sortable: true },
  { name: "Age", key: "age", sortable: true },
];

export default function DataTablePage() {
  return <DataTable data={sampleData} columns={columns} />;
}
