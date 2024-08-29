import { useState, useContext } from "react";
import api from "@/api/v1";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GeneralContext } from "@/context/GeneralContext";

function TextFile({ setTextData }) {
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("No file selected");
  const { setLoading } = useContext(GeneralContext);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setFileContent(content);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const processData = async () => {
    try {
      setLoading(true);
      console.log("Processing data");
      const request = {
        text: fileContent,
      };
      const response = await api.post("/text", request);
      console.log(response.data);
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
        <Label className="flex-1">Upload text-files</Label>
        <Input
          type="file"
          id="file-input"
          name="file-input"
          className="hidden"
          accept=".txt"
          onChange={handleFileChange}
        />
        <Label
          htmlFor="file-input"
          className="bg-blue-500 flex-1 text-white p-2 rounded cursor-pointer text-center"
        >
          {fileName === "No file selected" ? "Upload a file" : fileName}
        </Label>
      </div>

      <Button onClick={processData}>Process</Button>
    </div>
  );
}

export default TextFile;
