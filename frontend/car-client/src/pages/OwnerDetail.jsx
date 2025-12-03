import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../components/Card";
import Table from "../components/Table";
import { OwnersAPI } from "../services/owners";

export default function OwnerDetail() {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    OwnersAPI.get(id).then(setOwner);
    OwnersAPI.carsByOwner(id).then(setCars);
  }, [id]);
  if (!owner) return null;
  return (
    <>
      <Card title="Owner Profile" right={<Link to="/owners">Back</Link>}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <strong>Name:</strong> {owner.firstName} {owner.lastName}
          </div>
          <div>
            <strong>Email:</strong> {owner.email}
          </div>
          <div>
            <strong>Phone:</strong> {owner.phone || "—"}
          </div>
          <div>
            <strong>Cars:</strong> {cars.length}
          </div>
        </div>
      </Card>
      <Table
        title={`Cars (${cars.length})`}
        columns={["Brand", "Model", "Color", "Year", "Price", "Plate"]}
        rows={cars.map((c) => [
          c.brand,
          c.model,
          c.color,
          c.modelYear,
          `$${c.price.toLocaleString()}`,
          c.registrationNumber,
        ])}
      />
    </>
  );
}
