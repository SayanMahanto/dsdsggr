import { Globe, MoveRight } from "lucide-react";

const PoliceStationCard = ({ name, address, phone }) => {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg w-full md:w-3/4 lg:w-1/2 mx-auto mt-4">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm text-gray-400">{address}</p>
      <p className="text-sm font-medium mt-1">{phone}</p>
      <p className="text-green-400 mt-1">Open 24 hours</p>
      <div className="flex gap-4 mt-3">
        <button className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 transition">
          <Globe size={16} /> Website
        </button>
        <button className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 transition">
          <MoveRight size={16} /> Directions
        </button>
      </div>
    </div>
  );
};

export default PoliceStationCard;
