import React from "react";
import { ChevronRightIcon, FileTextIcon, ClipboardListIcon, ShieldCheckIcon, FolderIcon } from "lucide-react";

const docItems = [
  { icon: FileTextIcon, label: "Notes", color: "text-blue-500 bg-blue-50" },
  { icon: ClipboardListIcon, label: "Forms and contracts", color: "text-purple-500 bg-purple-50" },
  { icon: ShieldCheckIcon, label: "Permissions", color: "text-green-500 bg-green-50" },
  { icon: FolderIcon, label: "Documents", color: "text-orange-500 bg-orange-50" },
];

const Divider = () => <div className="h-px bg-gray-100 mx-4" />;

export const DocumentsContent = (): JSX.Element => {
  return (
    <div className="flex flex-col bg-white">
      {docItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <React.Fragment key={item.label}>
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-mfneutralsn-500">{item.label}</span>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
            </div>
            {i < docItems.length - 1 && <Divider />}
          </React.Fragment>
        );
      })}
      <div className="h-8" />
    </div>
  );
};
