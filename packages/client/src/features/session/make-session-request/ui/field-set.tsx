import { RepsField, SetsField } from "./field"

export const SessionFieldSet = () => {
    return (
        <div className="space-y-3 px-4 text-white">
            <SetsField />
            <RepsField />
        </div>
    )
}