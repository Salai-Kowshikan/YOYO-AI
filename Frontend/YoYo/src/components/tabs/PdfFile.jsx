import { useState, useContext } from "react";
import api from "@/api/v1";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GeneralContext } from "@/context/GeneralContext";

function PdfFile({ setTextData }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const { setLoading } = useContext(GeneralContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const processData = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      console.log("Processing data");
      console.log(formData);
      const response = await api.post("/bulk_pdfs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTextData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-8 gap-5 w-3/4 items-center justify-center">
      <div className="flex gap-4 w-1/2 items-center justify-evenly">
        <Label className="flex-1">Upload PDF file</Label>
        <Input
          type="file"
          id="file-input"
          name="file-input"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
        />
        <Label
          htmlFor="file-input"
          className="flex-1 bg-blue-500 text-white p-2 rounded cursor-pointer text-center"
        >
          {fileName === "No file selected" ? "Upload a file" : fileName}
        </Label>
      </div>

      <Button onClick={processData}>Process</Button>
    </div>
  );
}

export default PdfFile;
