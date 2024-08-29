import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

function DownloadJson({ data }) {
  const [fileType, setFileType] = useState("json");

  const handleDownload = () => {
    if (!data) return;

    if (fileType === "json") {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(data)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "data.json";
      link.click();
    } else if (fileType === "csv") {
      const csvString = convertToCSV(data);
      const csvData = `data:text/csv;charset=utf-8,${encodeURIComponent(
        csvString
      )}`;
      const link = document.createElement("a");
      link.href = csvData;
      link.download = "data.csv";
      link.click();
    } else if (fileType === "pdf") {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 10;
      const lineHeight = 10;
      const fontSize = 12;
      const maxLineWidth = pageWidth - margin * 2;
      doc.setFontSize(fontSize);
      const jsonData = JSON.stringify(data, null, 2).split("\n");

      let cursorY = margin;
      jsonData.forEach((line) => {
        const lines = doc.splitTextToSize(line, maxLineWidth);
        lines.forEach((wrappedLine) => {
          if (cursorY + lineHeight > pageHeight - margin) {
            doc.addPage();
            cursorY = margin;
          }
          doc.text(wrappedLine, margin, cursorY);
          cursorY += lineHeight;
        });
      });

      doc.save("data.pdf");
    }
  };

  const convertToCSV = (objArray) => {
    const array =
      typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = "";

    for (const index in array[0]) {
      row += index + ",";
    }
    row = row.slice(0, -1);
    str += row + "\r\n";

    for (let i = 0; i < array.length; i++) {
      let line = "";
      for (const index in array[i]) {
        if (line !== "") line += ",";
        line += array[i][index];
      }
      str += line + "\r\n";
    }
    return str;
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-gray-100 p-4 w-3/4">
      <div className="flex justify-between w-full">
        <SelectType setFileType={setFileType} />
        <Button onClick={handleDownload} disabled={!data || data.length === 0}>
          {fileType === "json"
            ? "Download JSON"
            : fileType === "csv"
            ? "Download CSV"
            : "Download PDF"}
        </Button>
      </div>
      <ScrollArea className="w-full">
        <pre className="rounded w-full max-h-96">
          {!data || data.length === 0
            ? "No data to preview"
            : fileType === "json"
            ? JSON.stringify(data, null, 2)
            : fileType === "csv"
            ? convertToCSV(data)
            : "PDF preview not available"}
        </pre>
      </ScrollArea>
    </div>
  );
}

export default DownloadJson;

const SelectType = ({ setFileType }) => {
  return (
    <>
      <Select defaultValue="json" onValueChange={(value) => setFileType(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select file format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="json">JSON</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="pdf">PDF</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};
