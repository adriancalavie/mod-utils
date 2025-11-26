export type Mod = {
  name: string;
  version: string;
  type: Environment;
  iconUrl: string;
  fileName: string;
};

export type Environment = "client" | "server" | "both";
