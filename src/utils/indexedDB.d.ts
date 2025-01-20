export const saveData: (key: string, value: string) => Promise<void>;
export const getData: (key: string) => Promise<string | undefined>;
export const deleteData: (key: string) => Promise<void>;