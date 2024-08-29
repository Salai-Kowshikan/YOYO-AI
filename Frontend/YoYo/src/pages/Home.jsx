import DataVisualization from "@/components/datavis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Textinput from "@/components/tabs/Textinput";
import TextFile from "@/components/tabs/TextFile";
import PdfFile from "@/components/tabs/PdfFile";
import { useEffect, useState } from "react";
import DownloadJson from "@/components/DownloadJson";

function Home() {
  const [jsonData, setJsonData] = useState([]);
  const [textData, setTextData] = useState("");

  const extractAndParseJson = (text) => {
    if (text === "") return;
    try {
      const direct = JSON.parse(text);
      setJsonData((prevJsonData) => [...prevJsonData, direct]);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
    }
  };

  useEffect(() => {
    setJsonData([]);
    if (textData.length !== 0) {
      textData.forEach((text) => {
        extractAndParseJson(text);
      });
    }
  }, [textData]);

  useEffect(() => {
    console.log(jsonData);
  }, [jsonData]);

  return (
    <>
      <div className="flex items-center justify-center flex-col p-12 gap-6">
        <Tabs
          defaultValue="input"
          className="w-full items-center justify-center"
        >
          <TabsList className="w-full gap-6">
            <TabsTrigger value="input" className="px-8">
              Input
            </TabsTrigger>
            <TabsTrigger value="text" className="px-8">
              Text
            </TabsTrigger>
            <TabsTrigger value="pdf" className="px-8">
              PDF
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="input"
            className="w-full flex items-center justify-center"
          >
            <Textinput />
          </TabsContent>
          <TabsContent
            value="text"
            className="w-full flex items-center justify-center"
          >
            <TextFile />
          </TabsContent>
          <TabsContent
            value="pdf"
            className="w-full flex items-center justify-center"
          >
            <PdfFile setTextData={setTextData} />
          </TabsContent>
        </Tabs>
        <DownloadJson data={jsonData} />
        <DataVisualization />
      </div>
    </>
  );
}

export default Home;
