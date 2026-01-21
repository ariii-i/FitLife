import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useExerciseStore } from "../../store/excersiseStore";

export function ExerciseTable() {
    const { exercises, deleteExercise } = useExerciseStore();

    const columns = [
        {
            header: "Name",
            accessorKey: "name",
            cell: info => info.getValue(),
        },
        {
            header: "Muscle Group",
            accessorKey: "muscleGroup",
            cell: info => info.getValue(),
        },
        {
            header: "Equipment",
            accessorKey: "equipment",
            cell: info => info.getValue(),
        },
        {
            // header:"Delete",
            id: "action",
            cell: (info) => {
                return <div><button onClick={() => deleteExercise(info.row.original._id)}>
                    Delete
                </button>
                <button>Edit</button></div>
            }
        }
    ]

    const table = useReactTable({
        data: exercises,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <table className="border border-gray-900 mt-6 w-full">
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id} className="border p-2">
                                {flexRender(header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>

            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="border px-3 py-2">

                                {flexRender(
                                    cell.column.columnDef.cell ??
                                    cell.column.columnDef.accessorKey,
                                    cell.getContext()
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>

        </table>
    )
}