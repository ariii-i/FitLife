import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useExerciseStore } from "../../store/excersiseStore";
import { useForm } from "react-hook-form";

export function ExerciseTable() {
    const { reset } = useForm()
    const { exercises, deleteExercise, fetchExercises, editExercise } = useExerciseStore();

    // const onEdit = () => {
    //     return (0)
    // }

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
            cell: ({ row }) => {
                const exerciseVal = row.original;

                return <div>
                    <button onClick={() => deleteExercise(row.original._id, async () => {
                        await fetchExercises()
                    })}
                        className="bg-red-600 text-white rounded-xl px-2 hover:bg-red-700">
                        Delete
                    </button>
                    {/* <button className="bg-stone-900 text-white rounded-xl px-2 hover:bg-stone-950"
                        onClick={() => onEdit(exerciseVal)}>Edit</button> */}
                </div>
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
                            <th key={header.id} className="border border-gray-900 p-2">
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
                            <td key={cell.id} className="border border-gray-900 px-3 py-2">

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