import PartitionsView from "./partitions/PartitionsView";
import ProcessesView from "./processes/ProcessesView";

export default function StaticAllocationView() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        marginTop: "14px",
      }}
    >
      <PartitionsView />
      <ProcessesView />
    </div>
  );
}
