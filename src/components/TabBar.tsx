import { useState } from "react";

interface ITabBarProps {
  onTabChange: (tab: string) => void;
  views: string[];
  selectedView: string;
}

export default function TabBar(props: ITabBarProps) {
  return (
    <div style={{ display: "flex", width: "100%", backgroundColor: "#2c3e50" }}>
      {props.views.map((view) => (
        <button
          key={view}
          onClick={() => props.onTabChange(view)}
          style={{
            backgroundColor:
              props.selectedView === view ? "#3498db" : "#2c3e50",
            color: props.selectedView === view ? "white" : "white",
            border: "none",
            padding: "10px 15px",
            flex: 1,
            cursor: "pointer",
            outline: "none",
            borderRadius: "5px",
            boxShadow:
              props.selectedView === view
                ? "0 0 5px rgba(0, 0, 0, 0.3)"
                : "none",
          }}
        >
          {view}
        </button>
      ))}
    </div>
  );
}
