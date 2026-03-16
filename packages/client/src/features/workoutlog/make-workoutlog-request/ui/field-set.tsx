import { Card } from "@/components/ui/card";
import { SessionField } from "./fields";

type Props = {
    register: any;
};

export const SessionFieldSet = ({ register }: Props) => {
    return (
        <Card className="bg-stone-700 p-4 rounded-xl shadow-md flex flex-col gap-3">
            <SessionField label="Sets" placeholder="Enter sets" name="sets" register={register} />

            <SessionField label="Reps" placeholder="Enter reps" name="reps" register={register} />

            <SessionField label="Weight" placeholder="Enter weight" name="weight" register={register} />
        </Card>
    );
};