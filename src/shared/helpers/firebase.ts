import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

const dataURLToFile = (dataURL: string, fileName: string): File => {
  // Divide el dataURL en cabecera y contenido base64
  const [header, base64Data] = dataURL.split(",");
  const byteString = atob(base64Data); // Decodifica el contenido base64
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  // Extrae el tipo MIME desde el encabezado
  const mimeType = header.match(/:(.*?);/)?.[1] || "application/octet-stream";

  // Crea y retorna el archivo
  return new File([uint8Array], fileName, { type: mimeType });
};

export const uploadFiles = async (filesString: string[]) => {
  try {
    const urls = await Promise.all(
      filesString.map(async (fileString: string) => {
        let fileUrl = await uploadFile(fileString) as string;
        return fileUrl;
      })
    );

    return urls;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
  }
}

export const uploadFile = async (fileString:string) => {
  try {
    let date = new Date();
    let file = dataURLToFile(fileString!, `DCIM-${date.getTime()}.png`);
    const storageRef = ref(storage, `uploads/${file.name}`);
    
    const snapshot = await uploadBytes(storageRef, file);

    console.log('Archivo subido exitosamente:', snapshot.metadata);

    const url = await getDownloadURL(storageRef);
    console.log('URL de descarga:', url);

    return url;
  } catch (error) {
    console.error('Error al subir el archivo:', error);
  }
};
