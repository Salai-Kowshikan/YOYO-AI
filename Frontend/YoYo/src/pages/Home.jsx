import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Textinput from "@/components/tabs/Textinput";
import axios from "axios";
import { useState } from "react";
import TextFile from "@/components/tabs/TextFile";
import PdfFile from "@/components/tabs/PdfFile";

function Home() {
  return (
    <>
      <div className="flex items-center justify-center flex-col p-12">
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
          <TabsContent value="input">
            <Textinput />
          </TabsContent>
          <TabsContent value="text">
            <TextFile />
          </TabsContent>
          <TabsContent value="pdf">
            <PdfFile />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default Home;
