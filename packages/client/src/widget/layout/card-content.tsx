import { Card } from "@/components/ui/card";

type CardContentProps = {
    children?: React.ReactNode;
    button?: React.ReactNode;
    message?: string;
    className?: string;
};

export const ReusableCardContent = ({
    button,
    message,
    children,
    className = "",
}: CardContentProps) => {
    return (
        <Card
            className={`bg-gray-800 border border-gray-700 p-7 rounded-xl text-stone-100 font-semibold flex-col flex justify-center items-center text-2xl ${className}`}
        >
            {button && <div className="mb-4">{button}</div>}
            {message && <p className="text-center">{message}</p>}
            {children}
        </Card>
    );
};