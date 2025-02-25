import config from "@/lib/config";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndPoint}/api/auth/imagekit`);
    if (!response.ok) {
      const errorTxt = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorTxt}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error: any) {
    throw new Error(`Authentication request failed ${error.message}`);
  }
};

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const ImageUpload = ({
  onFileChange,
}: {
  onFileChange: (filePath: string) => void;
}) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast({
      title: "Image uploaded successfully",
      description: `${res.filePath} uploaded successfully!`,
    });
  };
  const onError = (err: any) => {
    console.log(err);
    toast({
      title: "Image uploaded failed",
      description: `Your image could not be uploaded. Please try again.`,
      variant: "destructive",
    });
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName="file-name.png"
      />
      <Button
        className="upload-btn bg-dark-400"
        onClick={(e) => {
          e.preventDefault();

          if (ikUploadRef.current) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className="text-base text-light-100">Upload a file</p>
        {file && <p className="upload-filename">{file.filePath}</p>}
      </Button>

      {file && (
        <IKImage
          src={`${urlEndpoint}${file.filePath}`}
          alt={file.filePath}
          height={300}
          width={500}
        />
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
