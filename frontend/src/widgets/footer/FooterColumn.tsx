import React from "react";

interface FooterColumnProps {
  title: string;
  items: string[];
}

export default function FooterColumn({ title, items }: FooterColumnProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.map((item, idx) => ( 
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

