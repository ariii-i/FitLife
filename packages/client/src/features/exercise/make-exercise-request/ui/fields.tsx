import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useDropzone } from "../../../../components/ui/dropzone";
import { When } from "react-if";
import { MUSCLE_GROUP_OPTIONS } from "../../../../entities/exercise/config";
import { useState, useCallback } from "react";

export const NameField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label className="text-sm text-stone-500">Name</label>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            id="name"
            placeholder="e.g. Bench Press"
            value={field.value || ""}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
          />
        )}
      />
      <When condition={!!errors.name}>
        <div className="text-destructive text-sm">
          {errors?.name?.message + ""}
        </div>
      </When>
    </div>
  );
};

export const DesciptionField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label className="text-sm text-stone-500">Description</label>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Input
            id="description"
            placeholder="Give some description about the exercise"
            value={field.value || ""}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
          />
        )}
      />
      <When condition={!!errors.name}>
        <div className="text-destructive text-sm">
          {errors?.name?.message + ""}
        </div>
      </When>
    </div>
  );
};

export const MuscleGroupField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label className="text-sm text-stone-500">Muscle Group</label>
      <Controller
        control={control}
        name="muscle_group"
        render={({ field }) => (
          <Select
            value={field.value || ""}
            onValueChange={(value) => {
              field.onChange(value);
            }}
            modal={false}
          >
            <SelectTrigger id="muscle_group">
              <SelectValue placeholder="Select muscle group" />
            </SelectTrigger>
            <SelectContent
              portalProps={{ container: document.body }}
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
            >
              {MUSCLE_GROUP_OPTIONS.map((group) => (
                <SelectItem key={group} value={group}>
                  {group.charAt(0).toUpperCase() + group.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <When condition={!!errors.muscle_group}>
        <div className="text-destructive text-sm">
          {errors?.muscle_group?.message + ""}
        </div>
      </When>
    </div>
  );
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ImageField = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { getRootProps, getInputProps, onRemoveFile } = useDropzone({
    validation: {
      accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
      maxFiles: 1,
      maxSize: 5 * 1024 * 1024,
    },
    onDropFile: async (file) => {
      const base64 = await fileToBase64(file);
      setValue("image_base64", base64);
      setPreviewUrl(URL.createObjectURL(file));
      return { status: "success" as const, result: base64 };
    },
    onRemoveFile: () => {
      setValue("image_base64", undefined);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    },
  });

  const handleRemove = () => {
    onRemoveFile("");
  };

  return (
    <div>
      <label className="text-sm text-stone-500">Image</label>
      <Controller
        control={control}
        name="image_base64"
        render={() => (
          <div className="space-y-2">
            {previewUrl ? (
              <div className="relative w-full h-40 rounded-md border overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input {...getInputProps()} />
                <p className="text-sm text-gray-500">
                  Click or drag image here
                </p>
              </div>
            )}
          </div>
        )}
      />
      <When condition={!!errors.image_base64}>
        <div className="text-destructive text-sm">
          {errors?.image_base64?.message + ""}
        </div>
      </When>
    </div>
  );
};
