import { open } from "@tauri-apps/plugin-dialog";
import "./App.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { Folder } from "@nsmr/pixelart-react";
import ModsTable from "./components/mods/mods-table";

function App() {
  const [directory, setDirectory] = useState<string | null>(null);

  const openDialog = async () => {
    const directory = await open({
      multiple: false,
      directory: true,
    });
    setDirectory(directory);
  };

  return (
    <ThemeProvider>
      <main
        className="h-screen w-full overflow-y-auto bg-black/1 dark:bg-black/40"
        style={{ colorScheme: "light dark" }}
      >
        <div className="p-8 text-black dark:text-white">
          <Button onClick={openDialog}>
            <Folder className="size-8" /> Select folder
          </Button>
          <div className="flex flex-col gap-4">
            <h2 className="mt-4 overflow-hidden text-2xl text-ellipsis">
              {directory ? directory : "No folder selected"}
            </h2>
            <ModsTable />
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
