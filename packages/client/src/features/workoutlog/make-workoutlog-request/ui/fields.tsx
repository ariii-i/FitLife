import { Input } from "@/components/ui/input";

type Props = {
    label: string;
    placeholder?: string;
    register: any;
    name: string;
};

export const SessionField = ({ label, placeholder, register, name }: Props) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-stone-300">{label}</label>
            
            <Input type="number" min={0} placeholder={placeholder} {...register(name)} className="bg-stone-600 text-stone-100 px-3 py-2 rounded" />
        </div>
    );
};