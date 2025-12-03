import { Routes, Route } from "react-router-dom";
import CarsList from "../pages/CarsList";
import OwnersList from "../pages/OwnersList";
import OwnerDetail from "../pages/OwnerDetail";
export default function RoutesView() {
  return (
    <Routes>
      <Route path="/" element={<CarsList />} />
      <Route path="/owners" element={<OwnersList />} />
      <Route path="/owners/:id" element={<OwnerDetail />} />
    </Routes>
  );
}
