import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
export default function CarsPage() {
  const [cars, setCars] = useState([]);
  useEffect(() => {
    apiGet("/cars").then(setCars);
  }, []);
  return (
    <div>
      <h2>Cars</h2>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            {car.brand} {car.model} — {car.color}
          </li>
        ))}
      </ul>
    </div>
  );
}
