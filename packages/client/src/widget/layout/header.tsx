import { GiStrongMan } from "react-icons/gi";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <Link to="/" className="flex font-bold px-2 pt-2 items-center gap-3 text-xl">
      <GiStrongMan size={60} /> <p>Fit Track Life</p>
    </Link>
  );
};
