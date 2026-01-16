// import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

// const data = [{
//     name: "Ari", plan: "doc", status: "Inactive"
// }, {
//     name: "Saf", plan: "racer", status: "Active"
// }]

// const columns = [
//     {
//         header: "Name",
//         accessorKey: "name"
//     }, {
//         header: "Plan",
//         accessorKey: "plan"
//     }, {
//         header: "Status",
//         accessorKey: "status"
//     }
// ]

// export function Table() {
//     const table = useReactTable({
//         data,
//         columns,
//         getCoreRowModel: getCoreRowModel()
//     })

//     return (
//         <div>
//             Hi
//             <table>
//                 <thead className="bg-gray-100">
//                     {table.getHeaderGroups().map(headerGroup =>(
//                     <tr key={headerGroup.id}>
//                         {headerGroup.headres.map(header => (
//                             <th key={header.id}>
//                                 {flexRender(
//                                     header.columns.columnDef.header,
//                                     header.getContext()
//                                 )}</th>
//                         ))}
//                     </tr>
//                     ))}
//                 </thead>
//                 <tbody></tbody>
//             </table>
//         </div>
//     )
// }